import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";

/** Subscribe module pages to the same live locale change as the app shell. */
export function useCurrentLocale(): string {
  const { i18n } = useTranslation();

  return useSyncExternalStore(
    (onChange) => {
      i18n.on("languageChanged", onChange);
      return () => i18n.off("languageChanged", onChange);
    },
    () => i18n.language || i18n.resolvedLanguage || "en",
    () => i18n.language || i18n.resolvedLanguage || "en",
  );
}

export function isLaoLocale(locale: string): boolean {
  return /^lo(?:[-_]|$)/i.test(locale.trim());
}
