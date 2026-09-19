import type { NextConfig } from "next";

/* Next inlines its own bootstrap scripts, so 'unsafe-inline' stays. Vercel
 * Analytics loads and beacons from this origin in production; in development
 * it comes from va.vercel-scripts.com and Turbopack needs eval. */
const scriptSrc = `script-src 'self' 'unsafe-inline'${
  process.env.NODE_ENV === "development" ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""
}`;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://va.vercel-scripts.com; worker-src 'self' blob:; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tarunyadgirkar.com" }],
        destination: "https://tarunyadgirkar.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
