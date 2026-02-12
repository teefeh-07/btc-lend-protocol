# Bitcoin Lending Protocol Architecture

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
