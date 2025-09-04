import { describe, it, expect } from 'vitest';
import { statusVariant } from '../hooks/useDashboardData';

describe('statusVariant', () => {
  const cases: [Parameters<typeof statusVariant>[0], string | undefined][] = [
    ['Sent','success'], ['Sending','info'], ['Scheduled','warning'], ['Draft','default'], ['Error','danger']
  ];
  it('maps statuses correctly', () => {
    for(const [input, expected] of cases){
      expect(statusVariant(input)).toBe(expected);
    }
  });
});
