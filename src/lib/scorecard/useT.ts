import { useMemo } from "react";
import { useStore, type Store } from "@/lib/scorecard/store";
import { t } from "@/lib/scorecard/i18n";

export function useT() {
  const locale = useStore((s: Store) => s.session?.locale ?? "de");
  return useMemo(() => (key: string) => t(key, locale), [locale]);
}

export function useLocale() {
  return useStore((s: Store) => s.session?.locale ?? "de");
}
