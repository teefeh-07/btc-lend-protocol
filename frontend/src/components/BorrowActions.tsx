import React from 'react';
import { ActionCard } from './ActionCard';
import type { FormState, FormErrors } from '../types';

interface BorrowActionsProps {
  forms: FormState;
  errors: FormErrors;
  busyAction: string | null;
  walletBalance: string;
  availableBorrow: string;
  maxBorrow: string;
  onUpdate: (key: keyof FormState, value: string) => void;
  onBorrow: () => void;
  onRepay: () => void;
}

export const BorrowActions: React.FC<BorrowActionsProps> = ({
  forms,
  errors,
  busyAction,
  walletBalance,
  availableBorrow,
  maxBorrow,
  onUpdate,
  onBorrow,
  onRepay
}) => {
  return (
    <div className="panel wide">
      <h2>Borrow Actions</h2>
      <p className="panel-subtitle">Borrow and repay against your collateral.</p>
      <div className="actions">
        <ActionCard
          title="Borrow STX"
          metadata={`Available: ${availableBorrow} STX (max ${maxBorrow} STX)`}
          value={forms.borrow}
          error={errors.borrow}
          buttonText="Borrow"
          buttonPending={busyAction === 'borrow'}
          onChange={(val) => onUpdate('borrow', val)}
          onSubmit={onBorrow}
        />
        <ActionCard
          title="Repay"
          metadata={`Wallet balance: ${walletBalance} STX`}
          value={forms.repay}
          error={errors.repay}
          buttonText="Repay"
          buttonPending={busyAction === 'repay'}
          onChange={(val) => onUpdate('repay', val)}
          onSubmit={onRepay}
        />
      </div>
    </div>
  );
};
