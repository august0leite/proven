import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

const runHskTests = process.env.RUN_HSK_TESTS === "1";
const hskDescribe = runHskTests ? describe : describe.skip;

hskDescribe("ProvenContracts on HSK Testnet", async function () {
	const { viem } = await network.create({ network: "hskTestnet" });
	const publicClient = await viem.getPublicClient();
	const walletClients = await viem.getWalletClients();
	const deployer = walletClients[0];

	const toBytes32 = (value: bigint) =>
		`0x${value.toString(16).padStart(64, "0")}` as `0x${string}`;
	const normalizeAddress = (value: string) => value.toLowerCase();
	const fallbackBuyer = "0x1000000000000000000000000000000000000001" as `0x${string}`;
	const fallbackSeller = "0x1000000000000000000000000000000000000002" as `0x${string}`;
	const buyerAddress = walletClients[1]?.account.address ?? fallbackBuyer;
	const sellerAddress = walletClients[2]?.account.address ?? fallbackSeller;
	const issuerAddress = walletClients[3]?.account.address ?? deployer.account.address;
	let nonce = 0n;

	async function sendAndWait(hash: `0x${string}`) {
		await publicClient.waitForTransactionReceipt({ hash });
	}

	function nextNonce() {
		const currentNonce = nonce;
		nonce += 1n;
		return currentNonce;
	}

	it("deploys and reaches READY_TO_SETTLE on HSK", async function () {
		assert.ok(deployer?.account?.address, "Missing deployer account from DEPLOYER_PRIVATE_KEY");
		nonce = BigInt(await publicClient.getTransactionCount({
			address: deployer.account.address,
			blockTag: "pending",
		}));

		const provenContracts = await viem.deployContract("ProvenContracts");
		const issuerRole = await provenContracts.read.ISSUER_ROLE();

		await sendAndWait(
			await provenContracts.write.grantRole([issuerRole, issuerAddress], {
				account: deployer.account,
				nonce: nextNonce(),
			}),
		);

		await sendAndWait(
			await provenContracts.write.createContract(
				[buyerAddress, sellerAddress, 40_000n, toBytes32(1n), toBytes32(2n)],
				{ account: deployer.account, nonce: nextNonce() },
			),
		);

		for (let index = 1n; index <= 8n; index++) {
			await sendAndWait(
				await provenContracts.write.addCondition(
					[1n, toBytes32(index), toBytes32(index + 100n)],
					{ account: deployer.account, nonce: nextNonce() },
				),
			);
		}

		for (let index = 1n; index <= 7n; index++) {
			await sendAndWait(
				await provenContracts.write.submitEvidence(
					[1n, index, toBytes32(index + 1000n), toBytes32(index + 9000n)],
					{ account: deployer.account, nonce: nextNonce() },
				),
			);
			await sendAndWait(
				await provenContracts.write.verifyCondition([1n, index], { account: deployer.account, nonce: nextNonce() }),
			);
		}

		const pendingContract = await provenContracts.read.getContract([1n]);
		assert.equal(pendingContract[7], 0);

		await sendAndWait(
			await provenContracts.write.submitEvidence([1n, 8n, toBytes32(1008n), toBytes32(9008n)], {
				account: deployer.account,
				nonce: nextNonce(),
			}),
		);

		await sendAndWait(
			await provenContracts.write.verifyCondition([1n, 8n], { account: deployer.account, nonce: nextNonce() }),
		);

		const readyContract = await provenContracts.read.getContract([1n]);
		assert.equal(readyContract[7], 1);
		assert.equal(readyContract[10], 8n);
		assert.equal(readyContract[11], 8n);

		assert.equal(normalizeAddress(readyContract[1]), normalizeAddress(deployer.account.address));
		assert.equal(normalizeAddress(readyContract[2]), normalizeAddress(buyerAddress));
		assert.equal(normalizeAddress(readyContract[3]), normalizeAddress(sellerAddress));

		const chainId = await publicClient.getChainId();
		assert.equal(chainId, 133);
	});
});