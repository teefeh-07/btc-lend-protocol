import { useState } from 'react';
import { CONTRACTS } from '../constants';
import { parseContractInput } from '../utils';

export const useContractConfig = () => {
  const [deployer, setDeployer] = useState(CONTRACTS.deployer);
  const [lendingPool, setLendingPool] = useState(CONTRACTS.lendingPool);
  const [priceOracle, setPriceOracle] = useState(CONTRACTS.priceOracle);
  const [governance, setGovernance] = useState(CONTRACTS.governance);

  const lendingPoolConfig = parseContractInput(lendingPool, deployer);
  const priceOracleConfig = parseContractInput(priceOracle, deployer);
  const governanceConfig = parseContractInput(governance, deployer);

  return {
    deployer,
    setDeployer,
    lendingPool,
    setLendingPool,
    priceOracle,
    setPriceOracle,
    governance,
    setGovernance,
    lendingPoolConfig,
    priceOracleConfig,
    governanceConfig
  };
};
