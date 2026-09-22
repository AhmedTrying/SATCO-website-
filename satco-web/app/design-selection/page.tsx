import type { Metadata } from "next";

import { DesignSelectionApp } from "@/components/design-selection/DesignSelectionApp";

export const metadata: Metadata = {
  title: "Website Design Selection | SATCO",
  description: "Private management review tool for the SATCO website concepts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSelectionPage() {
  return <DesignSelectionApp />;
}
