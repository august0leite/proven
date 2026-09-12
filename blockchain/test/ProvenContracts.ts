import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { anyValue } from "@nomicfoundation/hardhat-viem-assertions/predicates";
import { network } from "hardhat";

describe("ProvenContracts", async function () {
	const { viem } = await network.create();
	const [owner, buyer, seller, issuer, outsider] = await viem.getWalletClients();

	const toBytes32 = (value: bigint) =>
		`0x${value.toString(16).padStart(64, "0")}` as `0x${string}`;
	const normalizeAddress = (value: string) => value.toLowerCase();

	async function deployContract() {
		const contract = await viem.deployContract("ProvenContracts");
		const issuerRole = await contract.read.ISSUER_ROLE();

		await contract.write.grantRole([issuerRole, issuer.account.address], {
			account: owner.account,
		});

		return contract;
	}

	async function createBaseContract(contract?: Awaited<ReturnType<typeof deployContract>>) {
		if (!contract) {
			contract = await deployContract();
		}

		await contract.write.createContract(
			[buyer.account.address, seller.account.address, 40_000n, toBytes32(1n), toBytes32(2n)],
			{ account: owner.account },
		);

		return contract;
	}

	async function addCondition(
		contract: Awaited<ReturnType<typeof deployContract>>,
		conditionId: bigint,
		conditionType: bigint = conditionId,
		metadataHash: bigint = conditionId + 100n,
	) {
		await contract.write.addCondition(
			[1n, toBytes32(conditionType), toBytes32(metadataHash)],
			{ account: owner.account },
		);
	}

	async function submitEvidence(
		contract: Awaited<ReturnType<typeof deployContract>>,
		conditionId: bigint,
		account = issuer.account,
		attestationId: bigint = 0n,
	) {
		await contract.write.submitEvidence(
			[1n, conditionId, toBytes32(conditionId + 1000n), toBytes32(attestationId)],
			{ account },
		);
	}

	async function verifyCondition(
		contract: Awaited<ReturnType<typeof deployContract>>,
		conditionId: bigint,
		account = issuer.account,
	) {
		await contract.write.verifyCondition([1n, conditionId], { account });
	}

	it("should create a contract correctly", async function () {
		const contract = await deployContract();

		await viem.assertions.emitWithArgs(
			contract.write.createContract(
				[buyer.account.address, seller.account.address, 40_000n, toBytes32(1n), toBytes32(2n)],
				{ account: owner.account },
			),
			contract,
			"ContractCreated",
			[1n, anyValue, anyValue, anyValue, 40_000n, toBytes32(1n), toBytes32(2n)],
		);

		const storedContract = await contract.read.getContract([1n]);
		assert.equal(storedContract[0], 1n);
		assert.equal(normalizeAddress(storedContract[1]), normalizeAddress(owner.account.address));
		assert.equal(normalizeAddress(storedContract[2]), normalizeAddress(buyer.account.address));
		assert.equal(normalizeAddress(storedContract[3]), normalizeAddress(seller.account.address));
		assert.equal(storedContract[4], 40_000n);
		assert.equal(storedContract[6], toBytes32(2n));
		assert.equal(storedContract[7], 0);
	});

	it("should reject zero currency when creating a contract", async function () {
		const contract = await deployContract();

		await viem.assertions.revertWithCustomError(
			contract.write.createContract(
				[buyer.account.address, seller.account.address, 40_000n, toBytes32(0n), toBytes32(2n)],
				{ account: owner.account },
			),
			contract,
			"InvalidCurrency",
		);
	});

	it("should add conditions to a contract", async function () {
		const contract = await createBaseContract();

		await viem.assertions.emitWithArgs(
			contract.write.addCondition([1n, toBytes32(1n), toBytes32(101n)], {
				account: owner.account,
			}),
			contract,
			"ConditionAdded",
			[1n, 1n, toBytes32(1n), toBytes32(101n)],
		);

		const storedCondition = await contract.read.getCondition([1n]);
		assert.equal(storedCondition[0], 1n);
		assert.equal(storedCondition[1], 1n);
		assert.equal(storedCondition[2], toBytes32(1n));
		assert.equal(storedCondition[3], 0);
		assert.equal(storedCondition[4], toBytes32(101n));

		const storedContract = await contract.read.getContract([1n]);
		assert.equal(storedContract[10], 1n);
	});

	it("should not allow unauthorized users to add conditions", async function () {
		const contract = await createBaseContract();

		await viem.assertions.revertWithCustomError(
			contract.write.addCondition([1n, toBytes32(1n), toBytes32(101n)], {
				account: outsider.account,
			}),
			contract,
			"NotContractCreator",
		);
	});

	it("should allow an authorized issuer to submit evidence", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);

		await viem.assertions.emitWithArgs(
			contract.write.submitEvidence([1n, 1n, toBytes32(1001n), toBytes32(9001n)], {
				account: issuer.account,
			}),
			contract,
			"EvidenceSubmitted",
			[1n, 1n, toBytes32(1001n), anyValue, anyValue, toBytes32(9001n)],
		);
	});

	it("should reject evidence submission from unauthorized issuer", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);

		await viem.assertions.revertWithCustomError(
			contract.write.submitEvidence([1n, 1n, toBytes32(1001n), toBytes32(9001n)], {
				account: outsider.account,
			}),
			contract,
			"AccessControlUnauthorizedAccount",
		);
	});

	it("should submit evidence for a condition", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);

		const attestationId = toBytes32(777n);
		await contract.write.submitEvidence([1n, 1n, toBytes32(1001n), attestationId], {
			account: issuer.account,
		});

		const evidence = await contract.read.getEvidence([1n]);
		assert.equal(evidence[0], toBytes32(1001n));
		assert.equal(normalizeAddress(evidence[1]), normalizeAddress(issuer.account.address));
		assert.notEqual(evidence[2], 0n);
		assert.equal(evidence[3], attestationId);

		const condition = await contract.read.getCondition([1n]);
		assert.equal(condition[1], 1n);
		assert.equal(condition[5], toBytes32(1001n));
		assert.equal(normalizeAddress(condition[6]), normalizeAddress(issuer.account.address));
		assert.equal(condition[8], attestationId);
		assert.equal(condition[11], true);
	});

	it("should reject evidence for a nonexistent condition", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);

		await viem.assertions.revertWithCustomError(
			contract.write.submitEvidence([1n, 999n, toBytes32(1001n), toBytes32(9001n)], {
				account: issuer.account,
			}),
			contract,
			"ConditionNotFound",
		);
	});

	it("should reject evidence for a condition that belongs to another contract", async function () {
		const contract = await createBaseContract();
		await contract.write.addCondition([1n, toBytes32(1n), toBytes32(101n)], {
			account: owner.account,
		});
		await contract.write.createContract(
			[buyer.account.address, seller.account.address, 50_000n, toBytes32(3n), toBytes32(4n)],
			{ account: owner.account },
		);
		await contract.write.addCondition([2n, toBytes32(2n), toBytes32(102n)], {
			account: owner.account,
		});

		await viem.assertions.revertWithCustomErrorWithArgs(
			contract.write.submitEvidence([1n, 2n, toBytes32(1002n), toBytes32(9001n)], {
				account: issuer.account,
			}),
			contract,
			"ConditionNotPartOfContract",
			[1n, 2n],
		);
	});

	it("should verify a condition", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);
		await submitEvidence(contract, 1n);

		await viem.assertions.emitWithArgs(
			contract.write.verifyCondition([1n, 1n], { account: issuer.account }),
			contract,
			"ConditionVerified",
			[1n, 1n, anyValue],
		);

		const condition = await contract.read.getCondition([1n]);
		assert.equal(condition[3], 1);
		assert.equal(normalizeAddress(condition[9]), normalizeAddress(issuer.account.address));
		assert.notEqual(condition[10], 0n);
	});

	it("should reject unauthorized verification", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);
		await submitEvidence(contract, 1n);

		await viem.assertions.revertWithCustomError(
			contract.write.verifyCondition([1n, 1n], { account: outsider.account }),
			contract,
			"AccessControlUnauthorizedAccount",
		);
	});

	it("should reject already verified condition", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);
		await addCondition(contract, 2n);
		await submitEvidence(contract, 1n);
		await verifyCondition(contract, 1n);

		await viem.assertions.revertWithCustomError(
			contract.write.verifyCondition([1n, 1n], { account: issuer.account }),
			contract,
			"ConditionAlreadyVerified",
		);
	});

	it("should reject invalid condition verification", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);

		await viem.assertions.revertWithCustomError(
			contract.write.verifyCondition([1n, 999n], { account: issuer.account }),
			contract,
			"ConditionNotFound",
		);
	});

	it("should keep the contract pending after 7 verified conditions", async function () {
		const contract = await createBaseContract();

		for (let index = 1n; index <= 8n; index++) {
			await addCondition(contract, index);
		}

		for (let index = 1n; index <= 7n; index++) {
			await submitEvidence(contract, index);
			await verifyCondition(contract, index);
		}

		const storedContract = await contract.read.getContract([1n]);
		assert.equal(storedContract[7], 0);
		assert.equal(storedContract[10], 8n);
		assert.equal(storedContract[11], 7n);
	});

	it("should become ready to settle after the 8th verified condition", async function () {
		const contract = await createBaseContract();

		for (let index = 1n; index <= 8n; index++) {
			await addCondition(contract, index);
		}

		for (let index = 1n; index <= 7n; index++) {
			await submitEvidence(contract, index);
			await verifyCondition(contract, index);
		}

		await submitEvidence(contract, 8n, issuer.account, 8_001n);

		await viem.assertions.emitWithArgs(
			contract.write.verifyCondition([1n, 8n], { account: issuer.account }),
			contract,
			"ContractStateChanged",
			[1n, 0, 1],
		);

		const storedContract = await contract.read.getContract([1n]);
		assert.equal(storedContract[7], 1);
		assert.equal(storedContract[10], 8n);
		assert.equal(storedContract[11], 8n);
	});

	it("should not allow arbitrary state transition", async function () {
		const contract = await deployContract();

		assert.equal(
			contract.abi.some(
				(entry) => entry.type === "function" && (entry.name === "setContractState" || entry.name === "setState"),
			),
			false,
		);
	});

	it("should not count the same condition twice", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n);
		await addCondition(contract, 2n);
		await submitEvidence(contract, 1n);
		await verifyCondition(contract, 1n);

		const afterFirstVerify = await contract.read.getContract([1n]);
		assert.equal(afterFirstVerify[11], 1n);

		await viem.assertions.revertWithCustomError(
			contract.write.verifyCondition([1n, 1n], { account: issuer.account }),
			contract,
			"ConditionAlreadyVerified",
		);

		const afterSecondAttempt = await contract.read.getContract([1n]);
		assert.equal(afterSecondAttempt[11], 1n);
	});

	it("should reconstruct contract, condition, and evidence data through read functions", async function () {
		const contract = await createBaseContract();
		await addCondition(contract, 1n, 44n, 55n);
		await submitEvidence(contract, 1n, issuer.account, 123n);

		const storedContract = await contract.read.getContract([1n]);
		const storedCondition = await contract.read.getCondition([1n]);
		const storedEvidence = await contract.read.getEvidence([1n]);

		assert.equal(storedContract[0], 1n);
		assert.equal(normalizeAddress(storedContract[1]), normalizeAddress(owner.account.address));
		assert.equal(normalizeAddress(storedContract[2]), normalizeAddress(buyer.account.address));
		assert.equal(normalizeAddress(storedContract[3]), normalizeAddress(seller.account.address));
		assert.equal(storedContract[4], 40_000n);
		assert.equal(storedContract[7], 0);
		assert.equal(storedContract[10], 1n);
		assert.equal(storedContract[11], 0n);

		assert.equal(storedCondition[0], 1n);
		assert.equal(storedCondition[1], 1n);
		assert.equal(storedCondition[2], toBytes32(44n));
		assert.equal(storedCondition[3], 0);
		assert.equal(storedCondition[4], toBytes32(55n));
		assert.equal(storedCondition[5], toBytes32(1001n));
		assert.equal(normalizeAddress(storedCondition[6]), normalizeAddress(issuer.account.address));
		assert.equal(storedCondition[8], toBytes32(123n));
		assert.equal(storedCondition[11], true);

		assert.equal(storedEvidence[0], toBytes32(1001n));
		assert.equal(normalizeAddress(storedEvidence[1]), normalizeAddress(issuer.account.address));
		assert.equal(storedEvidence[3], toBytes32(123n));
	});

	it("should run the complete 8-condition lifecycle end to end", async function () {
		const contract = await createBaseContract();

		for (let index = 1n; index <= 8n; index++) {
			await addCondition(contract, index);
		}

		for (let index = 1n; index <= 7n; index++) {
			await submitEvidence(contract, index);
			await verifyCondition(contract, index);
		}

		const beforeFinalVerification = await contract.read.getContract([1n]);
		assert.equal(beforeFinalVerification[7], 0);

		await submitEvidence(contract, 8n, issuer.account, 888n);

		await viem.assertions.emitWithArgs(
			contract.write.verifyCondition([1n, 8n], { account: issuer.account }),
			contract,
			"ContractStateChanged",
			[1n, 0, 1],
		);

		const afterFinalVerification = await contract.read.getContract([1n]);
		assert.equal(afterFinalVerification[7], 1);
		assert.equal(afterFinalVerification[10], 8n);
		assert.equal(afterFinalVerification[11], 8n);
	});
});
