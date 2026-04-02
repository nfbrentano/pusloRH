import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatters';

describe('formatDate', () => {
  it('should format YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(formatDate('2026-04-02')).toBe('02/04/2026');
  });

  it('should return empty string if date is empty', () => {
    expect(formatDate('')).toBe('');
  });

  it('should handle different dates', () => {
    expect(formatDate('1990-12-25')).toBe('25/12/1990');
  });
});
