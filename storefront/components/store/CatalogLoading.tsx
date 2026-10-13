"use client";

import { useLocale } from "@/lib/locale";

export function CatalogLoading() {
  const isLao = useLocale() === "lo";
  return (
    <div className="py-20 text-center text-slate-400 font-bold" role="status" aria-live="polite">
      {isLao ? "ກຳລັງໂຫຼດລາຍການສິນຄ້າ..." : "Loading catalog products..."}
    </div>
  );
}
