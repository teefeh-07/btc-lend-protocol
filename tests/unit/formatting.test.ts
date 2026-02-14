import { describe, it, expect } from 'vitest';
import { truncateAddress, formatNumber } from '../../frontend/src/utils/formatting';

describe('Formatting Utils', () => {
  it('should truncate addresses', () => {
    const addr = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    expect(truncateAddress(addr)).toBe('ST1PQH...ZGZGM');
  });

  it('should format numbers', () => {
    expect(formatNumber(1234.567, 2)).toBe('1,234.57');
  });
});
