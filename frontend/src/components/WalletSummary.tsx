import React from 'react';

interface WalletSummaryProps {
  address: string | null;
  balance: string;
  availableBorrow: string;
  hasWalletConnect: boolean;
}

export const WalletSummary: React.FC<WalletSummaryProps> = ({
  address,
  balance,
  availableBorrow,
  hasWalletConnect
}) => {
  return (
    <div className="wallet-summary">
      <div className="summary-card">
        <p className="card-title">Wallet status</p>
        <p className="address">{address || 'Not connected'}</p>
        <div className="summary-metrics">
          <div>
            <span>Wallet balance</span>
            <strong>{balance} STX</strong>
          </div>
          <div>
            <span>Available to borrow</span>
            <strong>{availableBorrow} STX</strong>
          </div>
        </div>
        <p className="summary-note">
          {hasWalletConnect ? 'WalletConnect ready' : 'Set VITE_REOWN_PROJECT_ID'}
        </p>
      </div>
    </div>
  );
};
