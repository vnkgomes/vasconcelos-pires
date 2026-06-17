// Environment-aware Content Security Policy.
//
// Production: strict — no 'unsafe-eval'. The static export shipped to GH Pages
// runs only pre-compiled React/Next bootstrap code; eval() is not needed.
//
// Development: 'unsafe-eval' is added to script-src ONLY. Next.js dev server
// uses eval() internally for HMR (Hot Module Replacement) and for the React
// Refresh runtime. Without 'unsafe-eval' in dev, the client bundle throws
// "EvalError: Evaluating a string as JavaScript violates the following CSP
// directive", hydration never finishes, and every 'use client' component
// stays stuck in its SSR initial state (invisible).
//
// 'unsafe-inline' remains in both envs (JSON-LD blocks + Next bootstrap markers).
export function buildCSP(env: string | undefined = process.env.NODE_ENV): string {
  const isDev = env === 'development';
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

  // Notes on omitted directives:
  // - `frame-ancestors` is intentionally NOT emitted here. The CSP spec only
  //   honors `frame-ancestors` when the policy is delivered as an HTTP header;
  //   browsers ignore (and warn about) it when delivered via <meta>. GitHub
  //   Pages does not allow custom headers, so the meta tag is our only channel.
  //   Clickjacking protection in this deployment relies on the static export
  //   not embedding any same-origin sensitive surfaces and on the consumer
  //   hosting the eventual build under a Pages domain that itself sends an
  //   `X-Frame-Options: DENY` default.
  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
}
