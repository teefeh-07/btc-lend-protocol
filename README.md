# BTC Lend Protocol

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

```bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

## 🔧 Configuration

Create `.env` in the frontend directory:

```env
VITE_STACKS_NETWORK=testnet
VITE_REOWN_PROJECT_ID=your_walletconnect_project_id
VITE_CONTRACT_DEPLOYER=your_deployer_address
VITE_LENDING_POOL_CONTRACT=lending-pool-v4
VITE_PRICE_ORACLE_CONTRACT=price-oracle-v4
VITE_GOVERNANCE_CONTRACT=protocol-governance-v4
VITE_PASSKEY_CONTRACT=passkey-signer-v4
```

## 🏃 Running

```bash
# Run tests
npm test

# Start frontend dev server
cd frontend && npm run dev

# Deploy contracts (requires Clarinet)
bash scripts/deploy.sh
```

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
