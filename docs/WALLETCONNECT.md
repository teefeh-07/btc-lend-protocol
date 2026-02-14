# WalletConnect Integration

## Setup

1. Get Project ID from https://cloud.walletconnect.network
2. Add to `.env`:
   ```
   VITE_REOWN_PROJECT_ID=your_project_id
   ```

## Usage

The app automatically initializes WalletConnect with:
- Sepolia network for Ethereum
- Stacks network integration
- Multi-wallet support

## Supported Wallets
- Hiro Wallet
- Leather Wallet
- Other WalletConnect compatible wallets

## Troubleshooting

If connection fails:
1. Check Project ID is valid
2. Verify network configuration
3. Clear browser cache
