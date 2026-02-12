import React from 'react';
import type { UserPosition as UserPositionType } from '../types';

interface UserPositionProps {
  position: UserPositionType;
  onRefresh: () => void;
}

export const UserPosition: React.FC<UserPositionProps> = ({ position, onRefresh }) => {
  return (
    <div className="panel">
      <h2>Your Position</h2>
      <p className="panel-subtitle">Read-only account metrics from the pool.</p>
      <div className="stats">
        <div>
          <span>Deposited</span>
          <strong>{position.deposit}</strong>
        </div>
        <div>
          <span>Collateral</span>
          <strong>{position.collateral}</strong>
        </div>
        <div>
          <span>Loan balance</span>
          <strong>{position.loan}</strong>
        </div>
        <div>
          <span>Health factor</span>
          <strong>{position.health}</strong>
        </div>
      </div>
      <button className="secondary" onClick={onRefresh}>
        Refresh my position
      </button>
    </div>
  );
};
