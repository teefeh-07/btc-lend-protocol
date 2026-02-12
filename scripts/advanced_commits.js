import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const runCommand = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error: ${cmd}`);
    }
};

const createCommit = (filePath, content, branchName, commitMsg) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    runCommand(`git checkout -b ${branchName}`);
    fs.writeFileSync(filePath, content);
    runCommand(`git add ${filePath}`);
    runCommand(`git commit -m "${commitMsg}"`);
    runCommand(`git checkout main`);
    runCommand(`git merge ${branchName} --no-ff -m "Merge: ${commitMsg}"`);
    console.log(`✓ ${branchName}`);
};

const commits = [
    {
        file: 'docs/ARCHITECTURE.md',
        content: `# Bitcoin Lending Protocol Architecture

## Overview
This protocol enables decentralized lending on Stacks blockchain using STX as collateral.

## Core Components

### Smart Contracts
- **lending-pool-v4**: Main lending pool logic
- **price-oracle-v4**: Price feed management
- **protocol-governance-v4**: DAO governance
- **passkey-signer-v4**: WebAuthn authentication
- **simple-liquidator-v4**: Liquidation mechanism

### Frontend
- React + TypeScript
- Stacks Connect integration
- WalletConnect support
- Real-time updates via Chainhooks
`,
        branch: 'docs/architecture',
        message: 'docs: add architecture overview'
    },
    {
        file: 'docs/SETUP.md',
        content: `# Setup Guide

## Prerequisites
- Node.js v18+
- Clarinet
- Git

## Installation

\`\`\`bash
npm install
cd frontend && npm install
\`\`\`

## Configuration

Create \`.env\` files:

\`\`\`env
VITE_STACKS_NETWORK=testnet
VITE_REOWN_PROJECT_ID=your_project_id
VITE_CONTRACT_DEPLOYER=your_deployer_address
\`\`\`
`,
        branch: 'docs/setup-guide',
        message: 'docs: add setup guide'
    },
    {
        file: 'docs/API.md',
        content: `# API Reference

## Contract Functions

### deposit(amount: uint)
Deposit STX into the lending pool.

**Parameters:**
- \`amount\`: Amount in micro-STX

**Returns:** 
- \`(ok true)\` on success

### borrow(amount: uint)
Borrow STX against collateral.

**Requirements:**
- Sufficient collateral
- Health factor > 1.0

### add-collateral(amount: uint, asset: string-ascii)
Add collateral to your position.
`,
        branch: 'docs/api-reference',
        message: 'docs: add API reference'
    },
    {
        file: 'frontend/src/hooks/usePoolStats.ts',
        content: `import { useState, useCallback } from 'react';
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
`,
        branch: 'feat/pool-stats-hook',
        message: 'feat(hooks): add usePoolStats hook'
    },
    {
        file: 'frontend/src/hooks/useUserPosition.ts',
        content: `import { useState, useCallback } from 'react';
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
`,
        branch: 'feat/user-position-hook',
        message: 'feat(hooks): add useUserPosition hook'
    },
    {
        file: 'frontend/src/components/ActionCard.tsx',
        content: `import React from 'react';

interface ActionCardProps {
  title: string;
  metadata: string;
  value: string;
  error?: string;
  buttonText: string;
  buttonPending?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  metadata,
  value,
  error,
  buttonText,
  buttonPending = false,
  disabled = false,
  onChange,
  onSubmit
}) => {
  return (
    <div className="action-card">
      <h3>{title}</h3>
      <p className="action-meta">{metadata}</p>
      <input
        type="number"
        min="0"
        step="0.000001"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'input-error' : ''}
      />
      {error && <p className="field-error">{error}</p>}
      <button
        className="primary"
        disabled={disabled}
        onClick={onSubmit}
      >
        {buttonPending ? 'Pending...' : buttonText}
      </button>
    </div>
  );
};
`,
        branch: 'feat/action-card-component',
        message: 'feat(components): add ActionCard component'
    },
    {
        file: 'frontend/src/components/WalletSummary.tsx',
        content: `import React from 'react';

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
`,
        branch: 'feat/wallet-summary-component',
        message: 'feat(components): add WalletSummary component'
    },
    {
        file: 'scripts/deploy.sh',
        content: `#!/bin/bash

echo "Deploying Bitcoin Lending Protocol..."

# Check if clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "Error: Clarinet not found. Please install it first."
    exit 1
fi

# Deploy contracts
echo "Deploying contracts..."
clarinet integrate

echo "Deployment complete!"
`,
        branch: 'feat/deploy-script',
        message: 'feat(scripts): add deployment script'
    },
    {
        file: '.github/workflows/test.yml',
        content: `name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
`,
        branch: 'feat/ci-workflow',
        message: 'feat(ci): add GitHub Actions test workflow'
    },
    {
        file: 'frontend/src/config/contracts.ts',
        content: `import { CONTRACTS } from '../constants';

export const getContractIdentifier = (contractName: string) => {
  const deployer = CONTRACTS.deployer;
  return \`\${deployer}.\${contractName}\`;
};

export const CONTRACT_NAMES = {
  LENDING_POOL: CONTRACTS.lendingPool,
  PRICE_ORACLE: CONTRACTS.priceOracle,
  GOVERNANCE: CONTRACTS.governance,
  PASSKEY_SIGNER: CONTRACTS.passkey
} as const;
`,
        branch: 'feat/contract-config',
        message: 'feat(config): add contract configuration helpers'
    },
    {
        file: 'frontend/src/styles/variables.css',
        content: `:root {
  /* Colors */
  --primary: #ff6b35;
  --primary-dark: #e85a2a;
  --secondary: #4ecdc4;
  --background: #0a0e27;
  --surface: #1a1f3a;
  --text: #e8eaed;
  --text-muted: #9aa0b8;
  --border: #2a3150;
  --error: #ff4757;
  --success: #4ecdc4;

  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.2);

  /* Transitions */
  --transition: all 0.2s ease;
}
`,
        branch: 'feat/css-variables',
        message: 'feat(styles): add CSS custom properties'
    },
    {
        file: 'frontend/src/styles/components.css',
        content: `.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: var(--transition);
}

.panel:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
}

.action-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.secondary {
  background: transparent;
  color: var(--secondary);
  border: 1px solid var(--secondary);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
}
`,
        branch: 'feat/component-styles',
        message: 'feat(styles): add component styles'
    }
];

console.log('Starting advanced commit generation...\n');
commits.forEach((commit, index) => {
    console.log(`[${index + 1}/${commits.length}] ${commit.branch}...`);
    createCommit(commit.file, commit.content, commit.branch, commit.message);
});

console.log('\n✅ Advanced commits completed!');
