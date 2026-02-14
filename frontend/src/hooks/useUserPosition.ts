import { useState, useCallback } from 'react';
import { principalCV } from '@stacks/transactions';
import { executeReadOnlyCall } from '../services/readOnly';
import { unwrapResponse, unwrapOptional, unwrapTuple, readUint } from '../utils';
import type { UserPosition } from '../types';

export const useUserPosition = () => {
  const [position, setPosition] = useState<UserPosition>({
    deposit: '0',
    collateral: '0',
    loan: '0',
    interest: '0',
    health: '0'
  });

  const refreshPosition = useCallback(async (address: string, config: any) => {
    const [deposit, collateral, loan, interest, health] = await Promise.all([
      executeReadOnlyCall({
        ...config,
        functionName: 'get-user-deposit',
        functionArgs: [principalCV(address)]
      }),
      executeReadOnlyCall({
        ...config,
        functionName: 'get-user-collateral',
        functionArgs: [principalCV(address)]
      }),
      executeReadOnlyCall({
        ...config,
        functionName: 'get-user-loan',
        functionArgs: [principalCV(address)]
      }),
      executeReadOnlyCall({
        ...config,
        functionName: 'calculate-current-interest',
        functionArgs: [principalCV(address)]
      }),
      executeReadOnlyCall({
        ...config,
        functionName: 'get-health-factor',
        functionArgs: [principalCV(address)]
      })
    ]);

    const depositTuple = unwrapTuple(unwrapOptional(unwrapResponse(deposit)));
    const collateralTuple = unwrapTuple(unwrapOptional(unwrapResponse(collateral)));
    const loanTuple = unwrapTuple(unwrapOptional(unwrapResponse(loan)));

    setPosition({
      deposit: readUint(depositTuple?.amount),
      collateral: readUint(collateralTuple?.amount),
      loan: readUint(loanTuple?.['principal-amount']),
      interest: readUint(unwrapResponse(interest)),
      health: readUint(unwrapResponse(health))
    });
  }, []);

  return { position, refreshPosition };
};
