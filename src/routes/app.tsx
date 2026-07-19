import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/scorecard/AppShell";
import { getStore } from "@/lib/scorecard/store";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStore().session) {
      throw redirect({ to: "/" });
    }
  },
  component: AppShell,
});
