import React from 'react';

interface StatusBarProps {
  networkLabel: string;
  contractInfo: string;
  status: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  networkLabel,
  contractInfo,
  status
}) => {
  return (
    <section className="status-bar">
      <div>
        <span>Network</span>
        <strong>{networkLabel}</strong>
      </div>
      <div>
        <span>Contracts</span>
        <strong>{contractInfo}</strong>
      </div>
      <div>
        <span>Status</span>
        <strong>{status}</strong>
      </div>
    </section>
  );
};
