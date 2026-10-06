import type { NextConfig } from "next";

/**
 * Phase 20 security gate (D-093): a conservative V1 header baseline.
 * No nonce-based script-src is wired up (the inline theme-flash
 * script in `app/layout.tsx` and Tailwind's own injected `<style>`
 * tags both need `'unsafe-inline'` without one), so this CSP is not a
 * hardened, XSS-proof policy — it is documented as that, not claimed
 * otherwise. It still meaningfully restricts everything else: no
 * third-party origin is allow-listed anywhere (confirmed — this app
 * loads zero external scripts/images/fonts at runtime; `next/font`
 * self-hosts Inter at build time), framing is fully disabled, and
 * object/base-uri are locked down.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
