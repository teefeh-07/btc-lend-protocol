import React, { createContext, useContext } from 'react';
import { useContractConfig } from '../hooks/useContractConfig';

const ContractContext = createContext<ReturnType<typeof useContractConfig> | null>(null);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useContractConfig();
  return <ContractContext.Provider value={config}>{children}</ContractContext.Provider>;
};

export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (!context) throw new Error('useContractContext must be used within ContractProvider');
  return context;
};
