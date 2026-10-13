"use client";

import Link from "next/link";
import { useLocale, useSetLocale } from "@/lib/locale";

export function SiteHeader() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const isLao = locale === "lo";
  const links = [
    { href: "/", label: isLao ? "ໜ້າຫຼັກ" : "Home" },
    { href: "/store", label: isLao ? "ສິນຄ້າ ແລະ ອາໄຫຼ່" : "Shop & Parts" },
    { href: "/services", label: isLao ? "ບໍລິການ 4S" : "4S Services" },
    { href: "/services/rental", label: isLao ? "ເຊົ່າລົດ" : "Forklift Rental" },
    { href: "/services/resource-center", label: isLao ? "ຄັງຄວາມຮູ້" : "Resources" },
    { href: "/client-dashboard", label: isLao ? "ຕິດຕາມ Fleet" : "Fleet Tracking" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-sm font-black tracking-wide text-slate-900 dark:text-white">
          DK LAO <span className="text-emerald-600 dark:text-emerald-400">4S</span>
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <nav aria-label={isLao ? "ເມນູຫຼັກ" : "Main navigation"} className="flex min-w-0 gap-2 overflow-x-auto pb-1 text-xs font-semibold sm:pb-0">
            {links.map((link) => (
              <Link key={link.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-white/10" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div role="group" aria-label={isLao ? "ເລືອກພາສາ" : "Choose language"} className="flex shrink-0 items-center rounded-lg border border-slate-200 p-0.5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setLocale("lo")}
              aria-pressed={locale === "lo"}
              className={`rounded-md px-2 py-1.5 text-xs font-bold transition ${locale === "lo" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}
            >
              ລາວ
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
              className={`rounded-md px-2 py-1.5 text-xs font-bold transition ${locale === "en" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
