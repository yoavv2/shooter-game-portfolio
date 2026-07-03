import type { MetadataRoute } from "next";
import { getMissions } from "@/lib/missions";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/missions", "/loadout", "/comms"].map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: new Date(),
  }));
  const missions = getMissions().map((m) => ({
    url: `${siteUrl}/missions/${m.slug}`,
    lastModified: new Date(),
  }));
  return [...pages, ...missions];
}
