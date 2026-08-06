"use client";

import { useEffect } from "react";

const SYNC_INTERVAL_MS = 60 * 60 * 1000;
const STORAGE_KEY = "growth-radar-last-auto-sync";

async function syncIfDue() {
  const lastSync = Number(window.localStorage.getItem(STORAGE_KEY) || "0");
  if (Date.now() - lastSync < SYNC_INTERVAL_MS) return false;

  const response = await fetch("/api/sync-growth-radar", {
    method: "POST",
    credentials: "same-origin"
  });

  if (!response.ok) return false;

  window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  return true;
}

export function AutoGrowthRadarSync() {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const synced = await syncIfDue().catch(() => false);
      if (synced && !cancelled) window.location.reload();
    };

    void run();
    const interval = window.setInterval(() => void run(), SYNC_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
