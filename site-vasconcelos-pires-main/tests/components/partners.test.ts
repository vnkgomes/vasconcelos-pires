import { describe, it, expect } from 'vitest';
import { partners, getPartnerBySlug } from '@/content/partners';

describe('partners', () => {
  it('has exactly 4 partners', () => {
    expect(partners).toHaveLength(4);
  });

  it('each partner has required fields', () => {
    for (const p of partners) {
      expect(p.id).toMatch(/^[a-z-]+$/);
      expect(p.slug).toMatch(/^[a-z-]+$/);
      expect(p.name).toBeTruthy();
      expect(p.role).toBeTruthy();
      expect(p.practice).toBeTruthy();
      expect(p.bioShort).toBeTruthy();
      expect(p.bioLong).toBeTruthy();
      expect(p.education.length).toBeGreaterThan(0);
      expect(p.photoSrc).toMatch(/^\/photos\/partners\//);
    }
  });

  it('looks up partner by slug', () => {
    expect(getPartnerBySlug('eduardo-vasconcelos')?.name).toBe('Eduardo Vasconcelos');
    expect(getPartnerBySlug('nope')).toBeUndefined();
  });
});
