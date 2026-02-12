# API Reference

## Contract Functions

### deposit(amount: uint)
Deposit STX into the lending pool.

**Parameters:**
- `amount`: Amount in micro-STX

**Returns:** 
- `(ok true)` on success

### borrow(amount: uint)
Borrow STX against collateral.

**Requirements:**
- Sufficient collateral
- Health factor > 1.0

### add-collateral(amount: uint, asset: string-ascii)
Add collateral to your position.
