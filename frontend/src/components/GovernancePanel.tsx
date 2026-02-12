import React from 'react';

interface GovernancePanelProps {
  governorContract: string;
}

export const GovernancePanel: React.FC<GovernancePanelProps> = ({ governorContract }) => {
  return (
    <div className="panel">
      <h2>Governance Console</h2>
      <p className="panel-subtitle">Track proposals and coordinate protocol updates.</p>
      <div className="stats">
        <div>
          <span>Governor contract</span>
          <strong>{governorContract}</strong>
        </div>
        <div>
          <span>Active proposals</span>
          <strong>0</strong>
        </div>
      </div>
      <button className="secondary">View proposals</button>
    </div>
  );
};
