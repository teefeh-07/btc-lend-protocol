import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const runCommand = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing: ${cmd}`);
    }
};

const createFileCommit = (filePath, content, branchName, commitMsg) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Create branch
    runCommand(`git checkout -b ${branchName}`);

    // Write file
    fs.writeFileSync(filePath, content);

    // Commit
    runCommand(`git add ${filePath}`);
    runCommand(`git commit -m "${commitMsg}"`);

    // Merge to main
    runCommand(`git checkout main`);
    runCommand(`git merge ${branchName} --no-ff -m "Merge: ${commitMsg}"`);

    console.log(`✓ Branch ${branchName} merged`);
};

// Generate comprehensive service layer
const services = [
    {
        file: 'frontend/src/services/api.ts',
        content: `import { stacksNetwork } from '../constants';

export const stacksApiBase = 
  stacksNetwork.isMainnet()
    ? "https://stacks-node-api.mainnet.stacks.co"
    : "https://stacks-node-api.testnet.stacks.co";

export const fetchStxBalance = async (address: string) => {
  const response = await fetch(\`\${stacksApiBase}/extended/v1/address/\${address}/stx\`);
  if (!response.ok) throw new Error("Balance fetch failed");
  const data = await response.json();
  return typeof data?.balance === "string" ? data.balance : "0";
};
`,
        branch: 'feat/api-service',
        message: 'feat(services): add API service with balance fetcher'
    },
    {
        file: 'frontend/src/services/contractCalls.ts',
        content: `import { openContractCall } from "@stacks/connect";
import { AnchorMode, PostConditionMode } from "@stacks/transactions";
import type { StacksNetwork } from "@stacks/network";

export interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: StacksNetwork;
  appDetails: any;
  stxAddress?: string;
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

export const submitContractCall = async (params: ContractCallParams) => {
  return openContractCall({
    ...params,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  });
};
`,
        branch: 'feat/contract-calls-service',
        message: 'feat(services): add contract calls service'
    },
    {
        file: 'frontend/src/services/readOnly.ts',
        content: `import { callReadOnlyFunction, cvToJSON } from "@stacks/transactions";
import type { StacksNetwork } from "@stacks/network";

export interface ReadOnlyCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: StacksNetwork;
  senderAddress: string;
}

export const executeReadOnlyCall = async (params: ReadOnlyCallParams) => {
  const result = await callReadOnlyFunction(params);
  return cvToJSON(result);
};
`,
        branch: 'feat/readonly-service',
        message: 'feat(services): add read-only function service'
    },
    {
        file: 'frontend/src/types/index.ts',
        content: `export interface UserPosition {
  deposit: string;
  collateral: string;
  loan: string;
  interest: string;
  health: string;
}

export interface PoolStats {
  totalDeposits: string;
  totalBorrows: string;
}

export interface FormState {
  deposit: string;
  withdraw: string;
  collateral: string;
  borrow: string;
  repay: string;
}

export interface FormErrors {
  deposit: string;
  withdraw: string;
  collateral: string;
  borrow: string;
  repay: string;
}

export type MenuItem = "Lend" | "Borrow" | "Governance" | "Features";
`,
        branch: 'feat/typescript-types',
        message: 'feat(types): add TypeScript type definitions'
    },
    {
        file: 'frontend/src/components/Header.tsx',
        content: `import React from 'react';

interface HeaderProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  stxAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMenu,
  onMenuChange,
  stxAddress,
  onConnect,
  onDisconnect
}) => {
  const menuItems = ["Lend", "Borrow", "Governance", "Features"];
  const shortAddress = stxAddress
    ? \`\${stxAddress.slice(0, 6)}...\${stxAddress.slice(-4)}\`
    : "Not connected";

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">BTCLEND</span>
        <span className="brand-subtitle">Bitcoin Lending Protocol</span>
      </div>
      <nav className="nav">
        {menuItems.map((item) => (
          <button
            key={item}
            className={item === activeMenu ? "nav-link active" : "nav-link"}
            onClick={() => onMenuChange(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="header-wallet">
        <span className="wallet-status">{shortAddress}</span>
        <div className="row">
          {!stxAddress && (
            <button className="primary" onClick={onConnect}>
              Connect
            </button>
          )}
          {stxAddress && (
            <button className="ghost" onClick={onDisconnect}>
              Disconnect
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
`,
        branch: 'feat/header-component',
        message: 'feat(components): add Header component'
    },
    {
        file: 'frontend/src/components/StatusBar.tsx',
        content: `import React from 'react';

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
`,
        branch: 'feat/statusbar-component',
        message: 'feat(components): add StatusBar component'
    },
    {
        file: 'frontend/src/components/PoolOverview.tsx',
        content: `import React from 'react';
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
`,
        branch: 'feat/pool-overview-component',
        message: 'feat(components): add PoolOverview component'
    },
    {
        file: 'frontend/src/components/UserPosition.tsx',
        content: `import React from 'react';
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
`,
        branch: 'feat/user-position-component',
        message: 'feat(components): add UserPosition component'
    }
];

// Execute commits
console.log('Starting bulk commit generation...\n');
services.forEach((service, index) => {
    console.log(`[${index + 1}/${services.length}] Creating ${service.branch}...`);
    createFileCommit(service.file, service.content, service.branch, service.message);
});

console.log('\n✅ Bulk commit generation completed!');
