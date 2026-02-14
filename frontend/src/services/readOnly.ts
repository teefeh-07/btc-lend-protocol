import { callReadOnlyFunction, cvToJSON } from "@stacks/transactions";
import type { StacksNetwork } from "@stacks/network";

export interface ReadOnlyCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: StacksNetwork;
  senderAddress: string;
}

export const executeReadOnlyCall = async (params: ReadOnlyCallParams) => {
  const result = await callReadOnlyFunction(params);
  return cvToJSON(result);
};
