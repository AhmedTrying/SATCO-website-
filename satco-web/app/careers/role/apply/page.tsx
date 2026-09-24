import type { Metadata } from "next";
import { Suspense } from "react";

import { LiveJobFromQuery } from "@/components/careers/LiveJob";
import { Container } from "@/components/layout/Container";
import { jobApplicationCopy } from "@/content/job-application";

export const metadata: Metadata = { title: "Careers application" };

export default function LiveApplicationPage() {
  return (
    <Suspense fallback={<Container className="py-20"><h1 role="status">{jobApplicationCopy.loadingRole}</h1></Container>}>
      <LiveJobFromQuery application />
    </Suspense>
  );
}
