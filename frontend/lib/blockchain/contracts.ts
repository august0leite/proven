import { decodeEventLog, encodePacked, keccak256, parseUnits, stringToHex, type Address, type Hex } from "viem";
import { provenContractsAbi } from "@/lib/blockchain/abi";
import { blockchainConfig } from "@/lib/blockchain/config";
import { getPublicClient, getWalletClient } from "@/lib/blockchain/wallet";
import type { Condition, ContractDetail, ContractSummary, Evidence, WorkspaceStatus } from "@/data/types";

function normalizeValueToWei(value: string): bigint {
  const rawValue = value.trim().replace(/,/g, "");

  if (!rawValue || rawValue === ".") {
    return BigInt(0);
  }

  if (rawValue.includes(".")) {
    return parseUnits(rawValue, 18);
  }

  return BigInt(rawValue);
}

function formatAddress(address: Address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function mapOnchainState(state: number): ContractSummary["status"] {
  return state === 1 ? "ready" : "pending";
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallbackMessage: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => reject(new Error(fallbackMessage)), timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function createProvenContract(input: {
  buyer: Address;
  seller: Address;
  value: string;
  currency: string;
  metadataLabel: string;
  creatorAddress?: Address;
}) {
  const walletClient = await getWalletClient();

  if (!walletClient) {
    throw new Error("Wallet is not connected.");
  }

  const connectedAccount = input.creatorAddress ?? walletClient.account ?? (await walletClient.getAddresses())[0];

  if (!connectedAccount) {
    throw new Error("No account is available from the connected wallet.");
  }

  const valueBigInt = normalizeValueToWei(input.value);
  const currencyHash = keccak256(stringToHex(input.currency.trim() || "USD", { size: 32 }));
  const metadataHash = keccak256(stringToHex(input.metadataLabel.trim() || "proven-contract"));

  return walletClient.writeContract({
    account: connectedAccount,
    address: blockchainConfig.contractAddress,
    abi: provenContractsAbi,
    functionName: "createContract",
    args: [input.buyer, input.seller, valueBigInt, currencyHash, metadataHash],
  });
}

export async function addConditionToContract(input: {
  contractId: bigint | number | string;
  conditionType: string;
  metadataLabel: string;
  creatorAddress?: Address;
}) {
  const walletClient = await getWalletClient();

  if (!walletClient) {
    throw new Error("Wallet is not connected.");
  }

  const connectedAccount = input.creatorAddress ?? walletClient.account ?? (await walletClient.getAddresses())[0];

  if (!connectedAccount) {
    throw new Error("No account is available from the connected wallet.");
  }

  const conditionTypeHash = keccak256(stringToHex(input.conditionType.trim() || "contract-condition", { size: 32 }));
  const metadataHash = keccak256(stringToHex(input.metadataLabel.trim() || "proven-condition"));

  return walletClient.writeContract({
    account: connectedAccount,
    address: blockchainConfig.contractAddress,
    abi: provenContractsAbi,
    functionName: "addCondition",
    args: [BigInt(input.contractId), conditionTypeHash, metadataHash],
  });
}

export async function createProvenContractWithConditions(input: {
  buyer: Address;
  seller: Address;
  value: string;
  currency: string;
  metadataLabel: string;
  creatorAddress?: Address;
  conditions: Array<{ title: string; description?: string; requiredEvidence?: string; authorizedIssuer?: string; verificationMethod?: string }>;
}) {
  const txHash = await createProvenContract(input);
  const publicClient = getPublicClient();

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  const createdLog = receipt.logs.find((log) => log.address.toLowerCase() === blockchainConfig.contractAddress.toLowerCase());

  if (!createdLog) {
    throw new Error("Contract creation transaction did not emit a ContractCreated log.");
  }

  const decoded = decodeEventLog({
    abi: provenContractsAbi,
    data: createdLog.data,
    topics: createdLog.topics,
  });

  const contractId = (decoded.args as { contractId?: bigint }).contractId;

  if (!contractId) {
    throw new Error("Could not determine the created contract ID from the blockchain receipt.");
  }

  for (const condition of input.conditions) {
    await addConditionToContract({
      contractId,
      conditionType: condition.title || "Condition",
      metadataLabel: condition.description || condition.requiredEvidence || "On-chain condition",
      creatorAddress: input.creatorAddress,
    });
  }

  return { txHash, contractId };
}

export async function listProvenContracts(): Promise<ContractSummary[]> {
  const publicClient = getPublicClient();
  const maxBlockRange = BigInt(100_000);

  try {
    const latestBlock = await withTimeout(publicClient.getBlockNumber(), 10_000, "HSK RPC timed out while fetching the latest block.");
    const startBlock = latestBlock > maxBlockRange ? latestBlock - maxBlockRange : BigInt(0);
    const allLogs: Awaited<ReturnType<typeof publicClient.getLogs>> = [];
    let fromBlock = startBlock;

    while (fromBlock <= latestBlock) {
      const toBlock = fromBlock + maxBlockRange > latestBlock ? latestBlock : fromBlock + maxBlockRange;

      const logs = await withTimeout(
        publicClient.getLogs({
          address: blockchainConfig.contractAddress,
          event: {
            anonymous: false,
            type: "event",
            name: "ContractCreated",
            inputs: [
              { indexed: true, name: "contractId", type: "uint256" },
              { indexed: true, name: "creator", type: "address" },
              { indexed: true, name: "buyer", type: "address" },
              { indexed: false, name: "seller", type: "address" },
              { indexed: false, name: "value", type: "uint256" },
              { indexed: false, name: "currency", type: "bytes32" },
              { indexed: false, name: "metadataHash", type: "bytes32" },
            ],
          },
          fromBlock,
          toBlock,
        }),
        15_000,
        "HSK RPC timed out while fetching contract events.",
      );

      if (logs.length === 0) {
        if (toBlock >= latestBlock) {
          break;
        }

        fromBlock = toBlock + BigInt(1);
        continue;
      }

      allLogs.push(...logs);

      if (toBlock >= latestBlock) {
        break;
      }

      fromBlock = toBlock + BigInt(1);
    }

    const sortedLogs = [...allLogs].reverse();

    const contracts = await Promise.all(
      sortedLogs.map(async (log) => {
        const args = (log as { args?: { contractId?: bigint } }).args;
        const id = Number(args?.contractId ?? BigInt(0));
        const contract = await fetchProvenContract(id);

        if (!contract) {
          return null;
        }

        return contract;
      }),
    );

    return contracts.filter((item): item is ContractSummary => Boolean(item));
  } catch {
    return [];
  }
}

export async function fetchProvenContract(contractId: bigint | number | string): Promise<ContractSummary | null> {
  const publicClient = getPublicClient();
  const parsedId = BigInt(contractId);

  try {
    const contractData = (await publicClient.readContract({
      address: blockchainConfig.contractAddress,
      abi: provenContractsAbi,
      functionName: "getContract",
      args: [parsedId],
    })) as readonly [
      bigint,
      Address,
      Address,
      Address,
      bigint,
      `0x${string}`,
      `0x${string}`,
      number,
      bigint,
      bigint,
      bigint,
      bigint,
    ];

    const [id, creator, buyer, seller, value, currency, metadataHash, state, createdAt, updatedAt, conditionCount, verifiedConditionCount] = contractData;

    const valueInEth = Number(value) / 1e18;

    return {
      id: String(id),
      name: `Contract #${id}`,
      description: `On-chain contract created on HSK Testnet. Metadata hash ${metadataHash.slice(0, 10)}...`,
      buyer: {
        name: formatAddress(buyer),
        identifier: buyer,
        verificationStatus: "verified",
      },
      seller: {
        name: formatAddress(seller),
        identifier: seller,
        verificationStatus: "verified",
      },
      counterparty: formatAddress(seller),
      value: Number.isFinite(valueInEth) ? valueInEth : 0,
      currency: "HSK",
      reference: `onchain-${id}`,
      status: mapOnchainState(Number(state)),
      verifiedConditions: Number(verifiedConditionCount),
      totalConditions: Number(conditionCount),
      createdAt: new Date(Number(createdAt) * 1000).toISOString(),
      updatedAt: new Date(Number(updatedAt) * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function fetchProvenContractDetail(contractId: bigint | number | string): Promise<ContractDetail | null> {
  const summary = await fetchProvenContract(contractId);

  if (!summary) {
    return null;
  }

  const publicClient = getPublicClient();
  const parsedId = BigInt(contractId);

  try {
    const conditionIds = (await publicClient.readContract({
      address: blockchainConfig.contractAddress,
      abi: provenContractsAbi,
      functionName: "getContractConditionIds",
      args: [parsedId],
    })) as unknown as readonly bigint[];

    const conditions: Condition[] = await Promise.all(
      conditionIds.map(async (conditionId, index) => {
        const conditionData = (await publicClient.readContract({
          address: blockchainConfig.contractAddress,
          abi: provenContractsAbi,
          functionName: "getCondition",
          args: [conditionId],
        })) as readonly [
          bigint,
          bigint,
          `0x${string}`,
          number,
          `0x${string}`,
          `0x${string}`,
          Address,
          bigint,
          `0x${string}`,
          Address,
          bigint,
          boolean,
        ];

        const status: WorkspaceStatus = Number(conditionData[3]) === 1 ? "verified" : "pending";

        return {
          id: `${conditionId}`,
          title: `Condition ${index + 1}`,
          description: `On-chain condition commitment for contract #${summary.id}.`,
          status,
          requiredEvidence: "On-chain evidence",
          authorizedIssuer: formatAddress(conditionData[6]),
          verificationMethod: "Blockchain attestation",
          verifiedAt: status === "verified" ? new Date(Number(conditionData[10]) * 1000).toISOString() : undefined,
        };
      }),
    );

    const evidence: Evidence[] = conditions.map((condition, index) => ({
      id: `evidence-${index + 1}`,
      title: condition.title,
      type: condition.requiredEvidence,
      issuer: condition.authorizedIssuer,
      status: condition.status,
      issuedAt: summary.createdAt,
      source: "HSK RPC",
      attestation: `Condition ${index + 1}`,
      schema: "ProvenContracts",
      proof: `0x${summary.id}`,
      verification: condition.status === "verified" ? "Valid" : "Pending",
      verifiedAt: condition.verifiedAt,
    }));

    return {
      ...summary,
      conditions,
      evidence,
    };
  } catch {
    return {
      ...summary,
      conditions: [],
      evidence: [],
    };
  }
}

export function hashMetadataLabel(label: string) {
  return keccak256(stringToHex(label.trim() || "proven-contract"));
}

export function encodeCurrency(currency: string): Hex {
  return encodePacked(["bytes32"], [keccak256(stringToHex(currency.trim() || "USD", { size: 32 }))]);
}
