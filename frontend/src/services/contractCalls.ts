import { openContractCall } from "@stacks/connect";
import { AnchorMode, PostConditionMode } from "@stacks/transactions";
import type { StacksNetwork } from "@stacks/network";

export interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: StacksNetwork;
  appDetails: any;
  stxAddress?: string;
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

export const submitContractCall = async (params: ContractCallParams) => {
  return openContractCall({
    ...params,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  });
};
