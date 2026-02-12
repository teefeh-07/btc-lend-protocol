import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";

export const stacksNetworkName = (import.meta.env.VITE_STACKS_NETWORK as string | undefined) || "testnet";
export const stacksNetwork = stacksNetworkName === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;
export const networkLabel = stacksNetworkName === "mainnet" ? "Stacks Mainnet" : "Stacks Testnet";

export const appDetails = {
    name: "Bitcoin Lending Protocol",
    icon: "https://appkit.reown.com/favicon.ico",
};

export const reownProjectId = import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined;

export const CONTRACTS = {
    deployer: (import.meta.env.VITE_CONTRACT_DEPLOYER as string | undefined) || "",
    lendingPool: (import.meta.env.VITE_LENDING_POOL_CONTRACT as string | undefined) || "lending-pool-v4",
    priceOracle: (import.meta.env.VITE_PRICE_ORACLE_CONTRACT as string | undefined) || "price-oracle-v4",
    governance: (import.meta.env.VITE_GOVERNANCE_CONTRACT as string | undefined) || "protocol-governance-v4",
    passkey: (import.meta.env.VITE_PASSKEY_CONTRACT as string | undefined) || "passkey-signer-v4",
};

export const MICROSTX_FACTOR = 1_000_000;
export const COLLATERAL_RATIO = 150;
