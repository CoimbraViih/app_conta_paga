import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents the browser from sniffing the MIME type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Blocks rendering in <frame>/<iframe> from other origins
  { key: "X-Frame-Options", value: "DENY" },
  // Enables XSS filtering in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Controls referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restricts browser features/APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Forces HTTPS for 1 year (includeSubDomains)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
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
};

export default nextConfig;
