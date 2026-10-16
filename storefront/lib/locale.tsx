"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "lo" | "en";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_STORAGE_KEY = "dk_storefront_locale";

function parseLocale(value: string | null | undefined): Locale | null {
  return value === "lo" || value === "en" ? value : null;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setCurrentLocale] = useState<Locale>("lo");

  const setLocale = useCallback((nextLocale: Locale) => {
    setCurrentLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    document.cookie = `dk_locale=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // The active tab still switches languages when browser storage is disabled.
    }
  }, []);

  useEffect(() => {
    try {
      const storedLocale = parseLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
      if (storedLocale) setCurrentLocale(storedLocale);
    } catch {
      // Keep Lao as the default when browser storage is unavailable.
    }

    const syncLocale = (event: StorageEvent) => {
      if (event.key !== LOCALE_STORAGE_KEY) return;
      setCurrentLocale(parseLocale(event.newValue) ?? "lo");
    };
    window.addEventListener("storage", syncLocale);
    return () => window.removeEventListener("storage", syncLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext)?.locale ?? "lo";
}

export function useSetLocale() {
  return useContext(LocaleContext)?.setLocale ?? (() => undefined);
}

const messages: Record<string, Record<string, string>> = {
  UniPay: {
    w_title: "ກະເປົາເງິນດິຈິຕອນ",
    w_desc: "ຈັດການທຸລະກຳ ແລະ ການເງິນຂອງທ່ານໃນຈຸດດຽວ.",
    qr_title: "ຊຳລະດ້ວຍ QR",
    qr_desc: "ຮັບ ແລະ ຊຳລະເງິນຜ່ານ QR ໄດ້ຢ່າງສະດວກ.",
    pos_title: "ຈຸດຂາຍ POS",
    pos_desc: "ເຊື່ອມຕໍ່ການຂາຍໜ້າຮ້ານກັບລະບົບບັນຊີ.",
    an_title: "ລາຍງານວິເຄາະ",
    an_desc: "ຕິດຕາມຍອດຂາຍ ແລະ ລາຍງານທຸລະກຳ.",
    desc: "ໂຊລູຊັນການຊຳລະເງິນດິຈິຕອນສຳລັບທຸລະກິດ.",
  },
};

type Translator = ((key: string) => string) & { has: (key: string) => boolean };

export function useTranslations(namespace: string): Translator {
  const namespaceMessages = messages[namespace] ?? {};
  const translate = ((key: string) => namespaceMessages[key] ?? key) as Translator;
  translate.has = (key: string) => Object.prototype.hasOwnProperty.call(namespaceMessages, key);
  return translate;
}
