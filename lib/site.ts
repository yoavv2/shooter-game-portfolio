/**
 * Canonical site URL for metadata (OG tags, sitemap, robots).
 * Priority: NEXT_PUBLIC_SITE_URL env → Vercel production domain → localhost.
 * Set NEXT_PUBLIC_SITE_URL once you have a custom domain.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
