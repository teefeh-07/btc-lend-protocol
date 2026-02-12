import { CONTRACTS } from '../constants';

export const getContractIdentifier = (contractName: string) => {
  const deployer = CONTRACTS.deployer;
  return `${deployer}.${contractName}`;
};

export const CONTRACT_NAMES = {
  LENDING_POOL: CONTRACTS.lendingPool,
  PRICE_ORACLE: CONTRACTS.priceOracle,
  GOVERNANCE: CONTRACTS.governance,
  PASSKEY_SIGNER: CONTRACTS.passkey
} as const;
