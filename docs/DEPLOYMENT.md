# Deployment Guide

## Prerequisites
- Clarinet installed
- Testnet STX for deployment
- Contract deployer address configured

## Steps

### 1. Test Contracts
```bash
npm test
```

### 2. Deploy to Testnet
```bash
clarinet integrate
```

### 3. Verify Deployment
Check contracts on Stacks Explorer

### 4. Update Frontend Config
Update contract addresses in `.env`

### 5. Deploy Frontend
```bash
cd frontend
npm run build
```

Deploy `dist` folder to hosting service

## Recommended Hosts
- Vercel
- Netlify
- GitHub Pages
