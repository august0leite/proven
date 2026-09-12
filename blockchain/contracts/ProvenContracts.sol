// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title ProvenContracts
/// @notice Single MVP entry point for Proven contract verification.
contract ProvenContracts is AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    enum ContractState {
        PENDING,
        READY_TO_SETTLE
    }

    enum ConditionStatus {
        PENDING,
        VERIFIED
    }

    struct ContractData {
        uint256 id;
        address creator;
        address buyer;
        address seller;
        uint256 value;
        bytes32 currency;
        bytes32 metadataHash;
        ContractState state;
        uint64 createdAt;
        uint64 updatedAt;
        uint256 conditionCount;
        uint256 verifiedConditionCount;
    }

    struct ConditionData {
        uint256 id;
        uint256 contractId;
        bytes32 conditionType;
        ConditionStatus status;
        bytes32 metadataHash;
        bytes32 evidenceHash;
        address evidenceIssuer;
        uint64 evidenceTimestamp;
        bytes32 attestationId;
        address verifiedBy;
        uint64 verifiedAt;
        bool evidenceSubmitted;
    }

    error ContractNotFound(uint256 contractId);
    error ConditionNotFound(uint256 conditionId);
    error EvidenceNotFound(uint256 conditionId);
    error ConditionNotPartOfContract(uint256 contractId, uint256 conditionId);
    error NotContractCreator(uint256 contractId, address caller);
    error InvalidContractState(uint256 contractId, ContractState expectedState, ContractState actualState);
    error InvalidAddress();
    error InvalidValue();
    error InvalidCurrency();
    error InvalidHash();
    error InvalidConditionType();
    error ConditionAlreadyVerified(uint256 conditionId);
    error EvidenceAlreadySubmitted(uint256 conditionId);

    event ContractCreated(
        uint256 indexed contractId,
        address indexed creator,
        address indexed buyer,
        address seller,
        uint256 value,
        bytes32 currency,
        bytes32 metadataHash
    );

    event ConditionAdded(
        uint256 indexed contractId,
        uint256 indexed conditionId,
        bytes32 conditionType,
        bytes32 metadataHash
    );

    event EvidenceSubmitted(
        uint256 indexed contractId,
        uint256 indexed conditionId,
        bytes32 evidenceHash,
        address indexed issuer,
        uint64 timestamp,
        bytes32 attestationId
    );

    event ConditionVerified(
        uint256 indexed contractId,
        uint256 indexed conditionId,
        address indexed verifier
    );

    event ContractStateChanged(
        uint256 indexed contractId,
        ContractState previousState,
        ContractState newState
    );

    uint256 private _nextContractId = 1;
    uint256 private _nextConditionId = 1;

    mapping(uint256 => ContractData) private _contracts;
    mapping(uint256 => ConditionData) private _conditions;
    mapping(uint256 => uint256[]) private _contractConditionIds;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Creates a new Proven contract record.
    /// @param buyer The buyer party.
    /// @param seller The seller party.
    /// @param value The economic value of the agreement.
    /// @param currency The currency or unit identifier.
    /// @param metadataHash Hash pointer to offchain metadata.
    /// @return contractId The newly created contract identifier.
    function createContract(
        address buyer,
        address seller,
        uint256 value,
        bytes32 currency,
        bytes32 metadataHash
    ) external returns (uint256 contractId) {
        if (buyer == address(0) || seller == address(0)) {
            revert InvalidAddress();
        }

        if (value == 0) {
            revert InvalidValue();
        }

        if (currency == bytes32(0)) {
            revert InvalidCurrency();
        }

        if (metadataHash == bytes32(0)) {
            revert InvalidHash();
        }

        contractId = _nextContractId;
        _nextContractId = contractId + 1;

        ContractData storage contractData = _contracts[contractId];
        contractData.id = contractId;
        contractData.creator = msg.sender;
        contractData.buyer = buyer;
        contractData.seller = seller;
        contractData.value = value;
        contractData.currency = currency;
        contractData.metadataHash = metadataHash;
        contractData.state = ContractState.PENDING;
        contractData.createdAt = uint64(block.timestamp);
        contractData.updatedAt = uint64(block.timestamp);

        emit ContractCreated(contractId, msg.sender, buyer, seller, value, currency, metadataHash);
    }

    /// @notice Adds a contractual condition to an existing contract.
    /// @param contractId The parent contract identifier.
    /// @param conditionType The condition type identifier.
    /// @param metadataHash Hash pointer to condition metadata.
    /// @return conditionId The newly created condition identifier.
    function addCondition(
        uint256 contractId,
        bytes32 conditionType,
        bytes32 metadataHash
    ) external returns (uint256 conditionId) {
        ContractData storage contractData = _getExistingContract(contractId);
        _requireContractState(contractId, ContractState.PENDING);
        _requireContractEditor(contractData);

        if (conditionType == bytes32(0)) {
            revert InvalidConditionType();
        }

        if (metadataHash == bytes32(0)) {
            revert InvalidHash();
        }

        conditionId = _nextConditionId;
        _nextConditionId = conditionId + 1;

        ConditionData storage conditionData = _conditions[conditionId];
        conditionData.id = conditionId;
        conditionData.contractId = contractId;
        conditionData.conditionType = conditionType;
        conditionData.status = ConditionStatus.PENDING;
        conditionData.metadataHash = metadataHash;

        _contractConditionIds[contractId].push(conditionId);
        contractData.conditionCount += 1;
        contractData.updatedAt = uint64(block.timestamp);

        emit ConditionAdded(contractId, conditionId, conditionType, metadataHash);
    }

    /// @notice Registers evidence for a specific condition.
    /// @param contractId The parent contract identifier.
    /// @param conditionId The condition identifier.
    /// @param evidenceHash Cryptographic commitment to the evidence payload.
    /// @param attestationId Optional external attestation reference.
    function submitEvidence(
        uint256 contractId,
        uint256 conditionId,
        bytes32 evidenceHash,
        bytes32 attestationId
    ) external onlyRole(ISSUER_ROLE) {
        ContractData storage contractData = _getExistingContract(contractId);
        _requireContractState(contractId, ContractState.PENDING);

        ConditionData storage conditionData = _getExistingCondition(conditionId);
        _requireConditionBelongsToContract(contractId, conditionData);

        if (conditionData.status != ConditionStatus.PENDING) {
            revert ConditionAlreadyVerified(conditionId);
        }

        if (conditionData.evidenceSubmitted) {
            revert EvidenceAlreadySubmitted(conditionId);
        }

        if (evidenceHash == bytes32(0)) {
            revert InvalidHash();
        }

        conditionData.evidenceHash = evidenceHash;
        conditionData.evidenceIssuer = msg.sender;
        conditionData.evidenceTimestamp = uint64(block.timestamp);
        conditionData.attestationId = attestationId;
        conditionData.evidenceSubmitted = true;
        contractData.updatedAt = uint64(block.timestamp);

        emit EvidenceSubmitted(contractId, conditionId, evidenceHash, msg.sender, uint64(block.timestamp), attestationId);
    }

    /// @notice Verifies a condition after valid evidence has been submitted.
    /// @param contractId The parent contract identifier.
    /// @param conditionId The condition identifier.
    function verifyCondition(uint256 contractId, uint256 conditionId) external onlyRole(ISSUER_ROLE) {
        ContractData storage contractData = _getExistingContract(contractId);
        _requireContractState(contractId, ContractState.PENDING);

        ConditionData storage conditionData = _getExistingCondition(conditionId);
        _requireConditionBelongsToContract(contractId, conditionData);

        if (!conditionData.evidenceSubmitted) {
            revert EvidenceNotFound(conditionId);
        }

        if (conditionData.status == ConditionStatus.VERIFIED) {
            revert ConditionAlreadyVerified(conditionId);
        }

        conditionData.status = ConditionStatus.VERIFIED;
        conditionData.verifiedBy = msg.sender;
        conditionData.verifiedAt = uint64(block.timestamp);
        contractData.verifiedConditionCount += 1;
        contractData.updatedAt = uint64(block.timestamp);

        emit ConditionVerified(contractId, conditionId, msg.sender);

        _maybePromoteContractState(contractId);
    }

    /// @notice Returns the current contract data snapshot.
    /// @param contractId The contract identifier.
    function getContract(uint256 contractId)
        external
        view
        returns (
            uint256 id,
            address creator,
            address buyer,
            address seller,
            uint256 value,
            bytes32 currency,
            bytes32 metadataHash,
            ContractState state,
            uint64 createdAt,
            uint64 updatedAt,
            uint256 conditionCount,
            uint256 verifiedConditionCount
        )
    {
        ContractData storage contractData = _getExistingContract(contractId);

        return (
            contractData.id,
            contractData.creator,
            contractData.buyer,
            contractData.seller,
            contractData.value,
            contractData.currency,
            contractData.metadataHash,
            contractData.state,
            contractData.createdAt,
            contractData.updatedAt,
            contractData.conditionCount,
            contractData.verifiedConditionCount
        );
    }

    /// @notice Returns a condition snapshot.
    /// @param conditionId The condition identifier.
    function getCondition(uint256 conditionId)
        external
        view
        returns (
            uint256 id,
            uint256 contractId,
            bytes32 conditionType,
            ConditionStatus status,
            bytes32 metadataHash,
            bytes32 evidenceHash,
            address evidenceIssuer,
            uint64 evidenceTimestamp,
            bytes32 attestationId,
            address verifiedBy,
            uint64 verifiedAt,
            bool evidenceSubmitted
        )
    {
        ConditionData storage conditionData = _getExistingCondition(conditionId);

        return (
            conditionData.id,
            conditionData.contractId,
            conditionData.conditionType,
            conditionData.status,
            conditionData.metadataHash,
            conditionData.evidenceHash,
            conditionData.evidenceIssuer,
            conditionData.evidenceTimestamp,
            conditionData.attestationId,
            conditionData.verifiedBy,
            conditionData.verifiedAt,
            conditionData.evidenceSubmitted
        );
    }

    /// @notice Returns the stored evidence fields for a condition.
    /// @param conditionId The condition identifier.
    function getEvidence(uint256 conditionId)
        external
        view
        returns (bytes32 evidenceHash, address issuer, uint64 timestamp, bytes32 attestationId)
    {
        ConditionData storage conditionData = _getExistingCondition(conditionId);

        if (!conditionData.evidenceSubmitted) {
            revert EvidenceNotFound(conditionId);
        }

        return (
            conditionData.evidenceHash,
            conditionData.evidenceIssuer,
            conditionData.evidenceTimestamp,
            conditionData.attestationId
        );
    }

    /// @notice Returns the condition identifiers attached to a contract.
    /// @param contractId The contract identifier.
    function getContractConditionIds(uint256 contractId) external view returns (uint256[] memory) {
        _getExistingContract(contractId);
        return _contractConditionIds[contractId];
    }

    function _getExistingContract(uint256 contractId) internal view returns (ContractData storage contractData) {
        contractData = _contracts[contractId];
        if (contractData.creator == address(0)) {
            revert ContractNotFound(contractId);
        }
    }

    function _getExistingCondition(uint256 conditionId) internal view returns (ConditionData storage conditionData) {
        conditionData = _conditions[conditionId];
        if (conditionData.id == 0) {
            revert ConditionNotFound(conditionId);
        }
    }

    function _requireContractState(uint256 contractId, ContractState expectedState) internal view {
        ContractData storage contractData = _contracts[contractId];
        if (contractData.state != expectedState) {
            revert InvalidContractState(contractId, expectedState, contractData.state);
        }
    }

    function _requireConditionBelongsToContract(uint256 contractId, ConditionData storage conditionData) internal view {
        if (conditionData.contractId != contractId) {
            revert ConditionNotPartOfContract(contractId, conditionData.id);
        }
    }

    function _requireContractEditor(ContractData storage contractData) internal view {
        if (msg.sender != contractData.creator && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert NotContractCreator(contractData.id, msg.sender);
        }
    }

    function _maybePromoteContractState(uint256 contractId) internal {
        ContractData storage contractData = _contracts[contractId];
        if (
            contractData.state == ContractState.PENDING &&
            contractData.conditionCount > 0 &&
            contractData.verifiedConditionCount == contractData.conditionCount
        ) {
            ContractState previousState = contractData.state;
            contractData.state = ContractState.READY_TO_SETTLE;
            contractData.updatedAt = uint64(block.timestamp);
            emit ContractStateChanged(contractId, previousState, contractData.state);
        }
    }
}
