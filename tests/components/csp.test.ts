import { describe, it, expect } from 'vitest';
import { buildCSP } from '@/lib/csp';

describe('Content Security Policy', () => {
  it('production CSP does not allow unsafe-eval (regression guard)', () => {
    const csp = buildCSP('production');
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
  });

  it('test env defaults to strict (no unsafe-eval)', () => {
    expect(buildCSP('test')).not.toContain("'unsafe-eval'");
  });

  it('undefined env defaults to strict (no unsafe-eval)', () => {
    expect(buildCSP(undefined)).not.toContain("'unsafe-eval'");
  });

  it('development CSP allows unsafe-eval for Next.js HMR', () => {
    const csp = buildCSP('development');
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
  });

  it('keeps all hardening directives in both envs', () => {
    for (const env of ['development', 'production']) {
      const csp = buildCSP(env);
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).toContain("form-action 'self'");
      expect(csp).toContain("connect-src 'self'");
    }
  });

  it('does not emit frame-ancestors (ignored when delivered via <meta>)', () => {
    for (const env of ['development', 'production']) {
      expect(buildCSP(env)).not.toContain('frame-ancestors');
    }
  });
});
