import React from 'react';
import type { PoolStats } from '../types';

interface PoolOverviewProps {
  stats: PoolStats;
  onRefresh: () => void;
}

export const PoolOverview: React.FC<PoolOverviewProps> = ({ stats, onRefresh }) => {
  return (
    <div className="panel">
      <h2>Pool Overview</h2>
      <p className="panel-subtitle">Live read-only data from the lending pool.</p>
      <div className="stats">
        <div>
          <span>Total deposits</span>
          <strong>{stats.totalDeposits}</strong>
        </div>
        <div>
          <span>Total borrows</span>
          <strong>{stats.totalBorrows}</strong>
        </div>
      </div>
      <button className="secondary" onClick={onRefresh}>
        Refresh pool stats
      </button>
    </div>
  );
};
