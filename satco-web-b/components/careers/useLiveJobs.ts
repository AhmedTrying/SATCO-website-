"use client";

import { useEffect, useState } from "react";
import { isJobDeadlineOpen } from "@satco/shared";
import type { Job } from "@/lib/types";
import { careersJobsUrl } from "@/lib/careers-feed";

export function useLiveJobs(initialJobs: Job[] = []) {
  const [jobs, setJobs] = useState(initialJobs);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;

    const refresh = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch(careersJobsUrl(), {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const body = (await response.json()) as { jobs?: Job[] };
        if (!Array.isArray(body.jobs)) throw new Error("Invalid careers feed");
        if (active) {
          setJobs(body.jobs);
          setStatus("ready");
        }
      } catch (error) {
        if (active && !(error instanceof DOMException && error.name === "AbortError")) {
          setStatus("error");
        }
      }
    };

    void refresh();
    const timer = window.setInterval(() => void refresh(), 60000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return { jobs: jobs.filter((job) => isJobDeadlineOpen(job.applicationDeadline)), status };
}
