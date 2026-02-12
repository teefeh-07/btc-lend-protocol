import React from 'react';
import { ActionCard } from './ActionCard';
import type { FormState, FormErrors } from '../types';

interface LendActionsProps {
  forms: FormState;
  errors: FormErrors;
  busyAction: string | null;
  walletBalance: string;
  collateral: string;
  onUpdate: (key: keyof FormState, value: string) => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onAddCollateral: () => void;
}

export const LendActions: React.FC<LendActionsProps> = ({
  forms,
  errors,
  busyAction,
  walletBalance,
  collateral,
  onUpdate,
  onDeposit,
  onWithdraw,
  onAddCollateral
}) => {
  return (
    <div className="panel wide">
      <h2>Lend Actions</h2>
      <p className="panel-subtitle">Sign transactions with the Stacks wallet.</p>
      <div className="actions">
        <ActionCard
          title="Deposit STX"
          metadata={`Wallet balance: ${walletBalance} STX`}
          value={forms.deposit}
          error={errors.deposit}
          buttonText="Deposit"
          buttonPending={busyAction === 'deposit'}
          onChange={(val) => onUpdate('deposit', val)}
          onSubmit={onDeposit}
        />
        <ActionCard
          title="Withdraw STX"
          metadata={`Wallet balance: ${walletBalance} STX`}
          value={forms.withdraw}
          error={errors.withdraw}
          buttonText="Withdraw"
          buttonPending={busyAction === 'withdraw'}
          onChange={(val) => onUpdate('withdraw', val)}
          onSubmit={onWithdraw}
        />
        <ActionCard
          title="Add Collateral"
          metadata={`Collateral: ${collateral} STX`}
          value={forms.collateral}
          error={errors.collateral}
          buttonText="Add collateral"
          buttonPending={busyAction === 'collateral'}
          onChange={(val) => onUpdate('collateral', val)}
          onSubmit={onAddCollateral}
        />
      </div>
    </div>
  );
};
