# Proven Blockchain

This package contains the Solidity contracts and Hardhat deployment setup for Proven. The current deployment target is the HSK Testnet.

## Required environment

Copy the example environment file and fill in the values required for deployment:

```bash
cp .env.example .env
```

The current example file contains:

```env
DEPLOYER_PRIVATE_KEY=
RUN_HSK_TESTS=1
```

### What each value means

- `DEPLOYER_PRIVATE_KEY`: private key of the wallet that will deploy and interact with the contract on HSK.
- `RUN_HSK_TESTS=1`: enables the integration test that validates the flow against the HSK network.

> Important: the wallet must have enough native HSK tokens to pay for deployment and transaction gas.

## Install dependencies

From this folder:

```bash
npm install
```

## Compile contracts

```bash
npm run compile
```

## Deploy to HSK Testnet

The project is configured for the HSK Testnet in [hardhat.config.ts](hardhat.config.ts):

- Network: `hskTestnet`
- RPC URL: `https://testnet.hsk.xyz`
- Chain ID: `133`

Deploy with:

```bash
npm run deploy:hsk
```

This runs:

```bash
hardhat ignition deploy ignition/modules/ProvenContracts.ts --network hskTestnet
```

## Local development flow

If you want to test locally before deploying to HSK:

```bash
npm run node
```

Then in another terminal:

```bash
npm run deploy:local
```

## Run HSK-focused integration test

```bash
RUN_HSK_TESTS=1 npm run test:hsk
```

This test validates the contract lifecycle against the HSK network and checks the transition to the `READY_TO_SETTLE` state.

## Deployment checklist

1. Copy `.env.example` to `.env`
2. Set `DEPLOYER_PRIVATE_KEY`
3. Confirm the wallet has HSK funds
4. Run `npm install`
5. Run `npm run compile`
6. Run `npm run deploy:hsk`
7. Confirm deployment output and verify the contract address in the Ignition deployment folder

## Notes

- The deployment module is defined in [ignition/modules/ProvenContracts.ts](ignition/modules/ProvenContracts.ts).
- The contract artifact is generated under the `artifacts/` and `ignition/deployments/` folders.
- The HSK network is configured via `hardhat.config.ts` and uses the deployer key from `.env`.
