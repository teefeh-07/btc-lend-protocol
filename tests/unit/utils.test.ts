import { describe, it, expect } from 'vitest';
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
