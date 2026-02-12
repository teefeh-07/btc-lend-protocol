export interface UserPosition {
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
