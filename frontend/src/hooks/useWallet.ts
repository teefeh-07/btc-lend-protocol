import { useState, useEffect } from "react";
import { connect, disconnect, getLocalStorage, isConnected } from "@stacks/connect";
import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia } from "@reown/appkit/networks";
import { appDetails, reownProjectId, stacksNetworkName } from "../constants";

let appKitInitialized = false;

export function initAppKit() {
    if (appKitInitialized || !reownProjectId) return;
    createAppKit({
        adapters: [new EthersAdapter()],
        networks: [sepolia],
        projectId: reownProjectId,
        metadata: {
            name: appDetails.name,
            description: "Testnet lending for STX collateral",
            url: window.location.origin,
            icons: [appDetails.icon],
        },
    });
    appKitInitialized = true;
}

export const useWallet = () => {
    const [stxAddress, setStxAddress] = useState<string | null>(null);
    const [status, setStatus] = useState("Ready.");

    useEffect(() => {
        initAppKit();
    }, []);

    useEffect(() => {
        if (isConnected()) {
            const address = getLocalStorage()?.addresses?.stx?.[0]?.address || null;
            setStxAddress(address);
        }
    }, []);

    const connectWallet = async () => {
        if (!reownProjectId) {
            setStatus("Set VITE_REOWN_PROJECT_ID to enable WalletConnect.");
            return;
        }
        setStatus("Connecting wallet...");
        try {
            // cast to any to avoid strict type checks for this specific integration if needed,
            // or ensure types align with @stacks/connect
            await connect({
                network: stacksNetworkName === "mainnet" ? "mainnet" : "testnet",
                walletConnect: {
                    projectId: reownProjectId,
                    metadata: {
                        name: appDetails.name,
                        description: "Testnet lending for STX collateral",
                        url: window.location.origin,
                        icons: [appDetails.icon],
                    },
                },
            } as any);
            const address = getLocalStorage()?.addresses?.stx?.[0]?.address || null;
            setStxAddress(address);
            setStatus(address ? "Wallet connected." : "Wallet connected. No STX address found.");
        } catch (error) {
            setStatus("Wallet connection canceled.");
        }
    };

    const disconnectWallet = () => {
        disconnect();
        setStxAddress(null);
        setStatus("Wallet disconnected.");
    };

    return {
        stxAddress,
        status,
        setStatus,
        connectWallet,
        disconnectWallet,
    };
};
