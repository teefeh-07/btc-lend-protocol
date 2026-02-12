import { describe, it, expect } from 'vitest';
import { isValidAddress, isValidAmount } from '../../frontend/src/utils/validation';

describe('Validation Utils', () => {
  it('should validate Stacks addresses', () => {
    expect(isValidAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBe(true);
    expect(isValidAddress('invalid')).toBe(false);
  });

  it('should validate amounts', () => {
    expect(isValidAmount('1.5')).toBe(true);
    expect(isValidAmount('0')).toBe(false);
    expect(isValidAmount('abc')).toBe(false);
  });
});
