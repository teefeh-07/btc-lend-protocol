import { useState, useCallback } from 'react';
import { executeReadOnlyCall } from '../services/readOnly';
import { unwrapResponse, readUint } from '../utils';
import type { PoolStats } from '../types';

export const usePoolStats = () => {
  const [stats, setStats] = useState<PoolStats>({
    totalDeposits: '0',
    totalBorrows: '0'
  });

  const refreshStats = useCallback(async (config: any) => {
    const deposits = await executeReadOnlyCall({
      ...config,
      functionName: 'get-total-deposits',
      functionArgs: []
    });
    
    const borrows = await executeReadOnlyCall({
      ...config,
      functionName: 'get-total-borrows',
      functionArgs: []
    });

    setStats({
      totalDeposits: readUint(unwrapResponse(deposits)),
      totalBorrows: readUint(unwrapResponse(borrows))
    });
  }, []);

  return { stats, refreshStats };
};
