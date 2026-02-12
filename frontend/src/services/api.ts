import { stacksNetwork } from '../constants';

export const stacksApiBase = 
  stacksNetwork.isMainnet()
    ? "https://stacks-node-api.mainnet.stacks.co"
    : "https://stacks-node-api.testnet.stacks.co";

export const fetchStxBalance = async (address: string) => {
  const response = await fetch(`${stacksApiBase}/extended/v1/address/${address}/stx`);
  if (!response.ok) throw new Error("Balance fetch failed");
  const data = await response.json();
  return typeof data?.balance === "string" ? data.balance : "0";
};
