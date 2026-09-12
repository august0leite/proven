import { createPublicClient, createWalletClient, custom, http, type Address } from "viem";
import { blockchainConfig } from "@/lib/blockchain/config";

export type WalletConnection = {
  address: Address;
  chainId: number;
};

export function getEthereumProvider() {
  if (typeof window === "undefined") return null;
  const provider = (window as Window & { ethereum?: unknown }).ethereum;
  return provider ?? null;
}

export function getPublicClient() {
  return createPublicClient({
    chain: blockchainConfig.chain,
    transport: http(blockchainConfig.rpcUrl),
  });
}

export async function requestWalletConnection(): Promise<WalletConnection> {
  const provider = getEthereumProvider();

  if (!provider || typeof provider !== "object") {
    throw new Error("No wallet provider found. Please install MetaMask or another EVM wallet.");
  }

  const accounts = await (provider as { request: (args: { method: string; params?: unknown[] }) => Promise<string[]> }).request({
    method: "eth_requestAccounts",
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("No wallet account selected.");
  }

  const chainIdHex = await (provider as { request: (args: { method: string; params?: unknown[] }) => Promise<string> }).request({
    method: "eth_chainId",
  });

  const chainId = Number.parseInt(chainIdHex, 16);

  if (chainId !== blockchainConfig.chain.id) {
    await (provider as { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }).request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${blockchainConfig.chain.id.toString(16)}` }],
    });
  }

  return {
    address: accounts[0] as Address,
    chainId: blockchainConfig.chain.id,
  };
}

export async function getWalletClient() {
  const provider = getEthereumProvider();

  if (!provider || typeof provider !== "object") {
    return null;
  }

  return createWalletClient({
    chain: blockchainConfig.chain,
    transport: custom(provider as never),
  });
}
