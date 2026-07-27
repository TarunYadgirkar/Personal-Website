import type { NextConfig } from "next";

const scriptSrc = `script-src 'self' 'unsafe-inline'${
  process.env.NODE_ENV === "development"
    ? " 'unsafe-eval' https://va.vercel-scripts.com"
    : ""
}`;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value:
      `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
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
