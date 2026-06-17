import { describe, it, expect } from 'vitest';
import { pareceres, getParecerBySlug, getParecerNeighbors } from '@/content/pareceres';

describe('pareceres', () => {
  it('has 8 entries: 3 full and 5 stubs', () => {
    expect(pareceres).toHaveLength(8);
    expect(pareceres.filter((p) => p.kind === 'full')).toHaveLength(3);
    expect(pareceres.filter((p) => p.kind === 'stub')).toHaveLength(5);
  });

  it('sorts pareceres from newest to oldest', () => {
    const numbers = pareceres.map((p) => p.number);
    expect(numbers).toEqual(['047/2025', '046/2025', '045/2024', '044/2024', '043/2024', '042/2024', '041/2024', '040/2024']);
  });

  it('looks up parecer by slug', () => {
    expect(getParecerBySlug('stf-tributacao-software')?.number).toBe('047/2025');
  });

  it('returns neighbors for navigation', () => {
    const { previous, next } = getParecerNeighbors('lei-do-carf-14689');
    expect(previous?.number).toBe('045/2024');
    expect(next?.number).toBe('047/2025');
  });
});
