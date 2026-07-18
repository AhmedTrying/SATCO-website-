import type { MetadataRoute } from "next";
import { getJobs } from "@/lib/jobs";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const staticRoutes = [
  "/",
  "/about/",
  "/about/company/",
  "/about/leadership/",
  "/about/certifications/",
  "/about/clients/",
  "/sectors/",
  "/sectors/airports/",
  "/sectors/construction/",
  "/sectors/operations/",
  "/sectors/ppp/",
  "/careers/",
  "/contact/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({ url: `${SITE_URL}${route}` })),
    ...getJobs().map((job) => ({ url: `${SITE_URL}/careers/${job.slug}/` })),
  ];
}
