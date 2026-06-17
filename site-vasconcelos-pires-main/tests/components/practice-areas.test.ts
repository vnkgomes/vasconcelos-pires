import { describe, it, expect } from 'vitest';
import { practiceAreas, getPracticeAreaBySlug } from '@/content/practice-areas';
import { operations, getOperationsForArea } from '@/content/operations';

describe('practice areas', () => {
  it('has exactly 5 areas with numeric ids 1.1-1.5', () => {
    expect(practiceAreas).toHaveLength(5);
    expect(practiceAreas.map((a) => a.number)).toEqual(['1.1', '1.2', '1.3', '1.4', '1.5']);
  });

  it('looks up area by slug', () => {
    const a = getPracticeAreaBySlug('societario-ma');
    expect(a?.number).toBe('1.1');
  });
});

describe('operations', () => {
  it('has 3 operations mapped to areas 1.1, 1.4, 1.5', () => {
    expect(operations).toHaveLength(3);
    expect(operations.map((o) => o.areaSlug).sort()).toEqual(['arbitragem-disputas', 'compliance-governanca', 'societario-ma']);
  });

  it('returns operations for a given area', () => {
    expect(getOperationsForArea('societario-ma')).toHaveLength(1);
    expect(getOperationsForArea('contratos-empresariais')).toHaveLength(0);
  });
});
