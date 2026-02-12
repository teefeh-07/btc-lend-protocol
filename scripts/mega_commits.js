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

const megaCommits = [
    {
        file: 'docs/CONTRIBUTING.md',
        content: `# Contributing Guide

## Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Code Style
- Use TypeScript for frontend
- Follow Clarity best practices for contracts
- Write tests for new features

## Commit Messages
Follow conventional commits:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- test: Tests
- refactor: Code refactoring
`,
        branch: 'docs/contributing',
        message: 'docs: add contributing guide'
    },
    {
        file: 'docs/SECURITY.md',
        content: `# Security Policy

## Supported Versions
| Version | Supported |
|---------|-----------|
| 4.x     | ✅        |
| 3.x     | ❌        |

## Reporting Vulnerabilities
Please report security vulnerabilities to security@btclend.io

## Audit Status
- Last audit: Pending
- Clarity version: 4
- Network: Testnet

## Best Practices
- Never share private keys
- Verify contract addresses
- Test on testnet first
`,
        branch: 'docs/security',
        message: 'docs: add security policy'
    },
    {
        file: 'frontend/src/hooks/useBalance.ts',
        content: `import { useState, useEffect } from 'react';
import { fetchStxBalance } from '../services/api';

export const useBalance = (address: string | null) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }

    const loadBalance = async () => {
      setLoading(true);
      try {
        const bal = await fetchStxBalance(address);
        setBalance(bal);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, [address]);

  return { balance, loading };
};
`,
        branch: 'feat/balance-hook',
        message: 'feat(hooks): add useBalance hook'
    },
    {
        file: 'frontend/src/hooks/useContractConfig.ts',
        content: `import { useState } from 'react';
import { CONTRACTS } from '../constants';
import { parseContractInput } from '../utils';

export const useContractConfig = () => {
  const [deployer, setDeployer] = useState(CONTRACTS.deployer);
  const [lendingPool, setLendingPool] = useState(CONTRACTS.lendingPool);
  const [priceOracle, setPriceOracle] = useState(CONTRACTS.priceOracle);
  const [governance, setGovernance] = useState(CONTRACTS.governance);

  const lendingPoolConfig = parseContractInput(lendingPool, deployer);
  const priceOracleConfig = parseContractInput(priceOracle, deployer);
  const governanceConfig = parseContractInput(governance, deployer);

  return {
    deployer,
    setDeployer,
    lendingPool,
    setLendingPool,
    priceOracle,
    setPriceOracle,
    governance,
    setGovernance,
    lendingPoolConfig,
    priceOracleConfig,
    governanceConfig
  };
};
`,
        branch: 'feat/contract-config-hook',
        message: 'feat(hooks): add useContractConfig hook'
    },
    {
        file: 'frontend/src/components/Topbar.tsx',
        content: `import React from 'react';

interface TopbarProps {
  networkLabel: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({
  networkLabel,
  title,
  description,
  children
}) => {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Bitcoin Lending Protocol</p>
        <h1>{title}</h1>
        <p className="subhead">{description}</p>
      </div>
      {children}
    </header>
  );
};
`,
        branch: 'feat/topbar-component',
        message: 'feat(components): add Topbar component'
    },
    {
        file: 'frontend/src/components/LendActions.tsx',
        content: `import React from 'react';
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
          metadata={\`Wallet balance: \${walletBalance} STX\`}
          value={forms.deposit}
          error={errors.deposit}
          buttonText="Deposit"
          buttonPending={busyAction === 'deposit'}
          onChange={(val) => onUpdate('deposit', val)}
          onSubmit={onDeposit}
        />
        <ActionCard
          title="Withdraw STX"
          metadata={\`Wallet balance: \${walletBalance} STX\`}
          value={forms.withdraw}
          error={errors.withdraw}
          buttonText="Withdraw"
          buttonPending={busyAction === 'withdraw'}
          onChange={(val) => onUpdate('withdraw', val)}
          onSubmit={onWithdraw}
        />
        <ActionCard
          title="Add Collateral"
          metadata={\`Collateral: \${collateral} STX\`}
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
`,
        branch: 'feat/lend-actions-component',
        message: 'feat(components): add LendActions component'
    },
    {
        file: 'frontend/src/components/BorrowActions.tsx',
        content: `import React from 'react';
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
          metadata={\`Available: \${availableBorrow} STX (max \${maxBorrow} STX)\`}
          value={forms.borrow}
          error={errors.borrow}
          buttonText="Borrow"
          buttonPending={busyAction === 'borrow'}
          onChange={(val) => onUpdate('borrow', val)}
          onSubmit={onBorrow}
        />
        <ActionCard
          title="Repay"
          metadata={\`Wallet balance: \${walletBalance} STX\`}
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
`,
        branch: 'feat/borrow-actions-component',
        message: 'feat(components): add BorrowActions component'
    },
    {
        file: 'frontend/src/components/GovernancePanel.tsx',
        content: `import React from 'react';

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
`,
        branch: 'feat/governance-panel-component',
        message: 'feat(components): add GovernancePanel component'
    },
    {
        file: 'frontend/src/components/FeaturesPanel.tsx',
        content: `import React from 'react';

export const FeaturesPanel: React.FC = () => {
  const features = [
    {
      icon: '🔐',
      title: 'WebAuthn Integration',
      description: 'Passkey-based authentication for secure contract interactions'
    },
    {
      icon: '📊',
      title: 'Price Oracle',
      description: 'Real-time price feeds for accurate collateral valuation'
    },
    {
      icon: '⚡',
      title: 'Instant Liquidation',
      description: 'Automated liquidation mechanism protects lenders'
    },
    {
      icon: '🏛️',
      title: 'DAO Governance',
      description: 'Community-driven protocol parameter management'
    },
    {
      icon: '🔗',
      title: 'Chainhooks Integration',
      description: 'Real-time blockchain event monitoring'
    },
    {
      icon: '💼',
      title: 'WalletConnect',
      description: 'Multi-wallet support via industry standard'
    }
  ];

  return (
    <div className="panel wide">
      <h2>Protocol Features</h2>
      <p className="panel-subtitle">Comprehensive lending infrastructure on Stacks</p>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
`,
        branch: 'feat/features-panel-component',
        message: 'feat(components): add FeaturesPanel component'
    },
    {
        file: 'frontend/src/styles/layout.css',
        content: `.app-shell {
  min-height: 100vh;
  background: var(--background);
  color: var(--text);
  position: relative;
  overflow-x: hidden;
}

.bg-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: var(--primary);
  top: -300px;
  right: -200px;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: var(--secondary);
  bottom: -200px;
  left: -150px;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: #9b59b6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  position: relative;
  z-index: 1;
}

.panel.wide {
  grid-column: 1 / -1;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}
`,
        branch: 'feat/layout-styles',
        message: 'feat(styles): add layout styles with glassmorphism'
    },
    {
        file: 'frontend/src/styles/animations.css',
        content: `@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
}
`,
        branch: 'feat/animation-styles',
        message: 'feat(styles): add animation utilities'
    },
    {
        file: 'tests/unit/utils.test.ts',
        content: `import { describe, it, expect } from 'vitest';
import { formatStx, toMicroStx, fromMicroStx, isValidMicroStx } from '../../frontend/src/utils';

describe('Utils', () => {
  describe('formatStx', () => {
    it('should format micro-STX to STX', () => {
      expect(formatStx('1000000')).toBe('1');
      expect(formatStx('1500000')).toBe('1.5');
    });

    it('should handle invalid input', () => {
      expect(formatStx('invalid')).toBe('0');
    });
  });

  describe('toMicroStx', () => {
    it('should convert STX to micro-STX', () => {
      expect(toMicroStx('1')).toBe(1000000);
      expect(toMicroStx('0.5')).toBe(500000);
    });
  });

  describe('fromMicroStx', () => {
    it('should convert micro-STX to STX', () => {
      expect(fromMicroStx('1000000')).toBe(1);
      expect(fromMicroStx('500000')).toBe(0.5);
    });
  });

  describe('isValidMicroStx', () => {
    it('should validate positive amounts', () => {
      expect(isValidMicroStx('1')).toBe(true);
      expect(isValidMicroStx('0.5')).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(isValidMicroStx('0')).toBe(false);
      expect(isValidMicroStx('-1')).toBe(false);
      expect(isValidMicroStx('abc')).toBe(false);
    });
  });
});
`,
        branch: 'test/utils-unit-tests',
        message: 'test: add utils unit tests'
    },
    {
        file: 'README.md',
        content: `# BTC Lend Protocol

A decentralized lending protocol on Stacks blockchain enabling users to lend and borrow STX with collateral-based security.

## 🚀 Features

- **Collateralized Lending**: Deposit STX, post collateral, and borrow against your position
- **WebAuthn Integration**: Secure passkey-based authentication
- **Price Oracle**: Real-time price feeds for accurate valuations
- **DAO Governance**: Community-driven protocol management
- **WalletConnect Support**: Industry-standard multi-wallet connectivity
- **Chainhooks Integration**: Real-time blockchain event monitoring

## 🛠️ Tech Stack

- **Smart Contracts**: Clarity 4 on Stacks
- **Frontend**: React + TypeScript
- **Wallet Integration**: @stacks/connect, WalletConnect
- **Styling**: Vanilla CSS with modern design patterns
- **Testing**: Vitest

## 📦 Installation

\`\`\`bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
\`\`\`

## 🔧 Configuration

Create \`.env\` in the frontend directory:

\`\`\`env
VITE_STACKS_NETWORK=testnet
VITE_REOWN_PROJECT_ID=your_walletconnect_project_id
VITE_CONTRACT_DEPLOYER=your_deployer_address
VITE_LENDING_POOL_CONTRACT=lending-pool-v4
VITE_PRICE_ORACLE_CONTRACT=price-oracle-v4
VITE_GOVERNANCE_CONTRACT=protocol-governance-v4
VITE_PASSKEY_CONTRACT=passkey-signer-v4
\`\`\`

## 🏃 Running

\`\`\`bash
# Run tests
npm test

# Start frontend dev server
cd frontend && npm run dev

# Deploy contracts (requires Clarinet)
bash scripts/deploy.sh
\`\`\`

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [API Reference](docs/API.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Security Policy](docs/SECURITY.md)

## 🔒 Security

This protocol uses Clarity version 4 with enhanced security features. See [SECURITY.md](docs/SECURITY.md) for details.

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT

## 🌐 Network

- **Testnet**: Active
- **Mainnet**: Coming soon

---

Built with ❤️ on Stacks
`,
        branch: 'docs/update-readme',
        message: 'docs: update README with comprehensive project info'
    },
    {
        file: 'frontend/.env.example',
        content: `# Stacks Network Configuration
VITE_STACKS_NETWORK=testnet

# WalletConnect / Reown Configuration
VITE_REOWN_PROJECT_ID=your_project_id_here

# Contract Deployment
VITE_CONTRACT_DEPLOYER=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# Contract Names
VITE_LENDING_POOL_CONTRACT=lending-pool-v4
VITE_PRICE_ORACLE_CONTRACT=price-oracle-v4
VITE_GOVERNANCE_CONTRACT=protocol-governance-v4
VITE_PASSKEY_CONTRACT=passkey-signer-v4

# Chainhooks (Optional)
VITE_CHAINHOOKS_WS_URL=ws://localhost:20456
`,
        branch: 'feat/env-example',
        message: 'feat(config): add environment variables example'
    },
    {
        file: '.gitignore',
        content: `# Dependencies
node_modules/
frontend/node_modules/

# Build outputs
dist/
build/
frontend/dist/
frontend/build/

# Environment variables
.env
.env.local
.env.production
frontend/.env
frontend/.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Clarinet
.cache/
deployments/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/
`,
        branch: 'feat/gitignore',
        message: 'feat(config): add comprehensive gitignore'
    }
];

console.log('Starting mega commit generation...\n');
megaCommits.forEach((commit, index) => {
    console.log(`[${index + 1}/${megaCommits.length}] ${commit.branch}...`);
    createCommit(commit.file, commit.content, commit.branch, commit.message);
});

console.log('\n✅ Mega commits completed!');
console.log('\nGenerating commit summary...');

try {
    execSync('git log --oneline --graph --decorate --all -n 50', { stdio: 'inherit' });
} catch (e) { }

try {
    const branchCount = execSync('git branch | wc -l').toString().trim();
    const commitCount = execSync('git rev-list --count main').toString().trim();
    console.log(`\n📊 Statistics:`);
    console.log(`   Branches: ${branchCount}`);
    console.log(`   Commits: ${commitCount}`);
} catch (e) { }
