"use client";

import { useState, useTransition } from "react";

import type { SaveState } from "@/components/form/SaveBar";
import type { SaveResult } from "@/app/actions/content";

/** Wraps a save action call with transition + status state for editors. */
export function useSave() {
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | undefined>();
  const [, startTransition] = useTransition();

  function run(fn: () => Promise<SaveResult>) {
    setState("saving");
    setError(undefined);
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        setState("saved");
      } else {
        setState("error");
        setError(res.error);
      }
    });
  }

  function markDirty() {
    setState((s) => (s === "saved" ? "idle" : s));
  }

  return { state, error, run, markDirty };
}
