import { defineChain } from "viem";

export const hskMainnet = defineChain({
  id: 177,
  name: "HSKChain",
  nativeCurrency: {
    name: "HSK",
    symbol: "HSK",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://mainnet.hsk.xyz"] },
  },
  blockExplorers: {
    default: { name: "HSK BlockScout", url: "https://hashkey.blockscout.com" },
  },
  testnet: false,
});

export const hskTestnet = defineChain({
  id: 133,
  name: "HSKChain Testnet",
  nativeCurrency: {
    name: "HSK",
    symbol: "HSK",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet.hsk.xyz"] },
  },
  blockExplorers: {
    default: { name: "HSK Testnet Explorer", url: "https://testnet-explorer.hsk.xyz" },
  },
  testnet: true,
});

export const provenContractAddress = "0x2Ce2C0224a1C7114b62EC316B071ff7DDe62c25B" as `0x${string}`;

export const blockchainConfig = {
  chain: hskTestnet,
  contractAddress: provenContractAddress,
  rpcUrl: "https://testnet.hsk.xyz",
  explorerUrl: "https://testnet-explorer.hsk.xyz",
  mainnetRpcUrl: "https://mainnet.hsk.xyz",
  testnetRpcUrl: "https://testnet.hsk.xyz",
};
