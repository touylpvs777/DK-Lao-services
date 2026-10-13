"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { ENTERPRISE_CUSTOMERS } from "@/data/customers";
import { useLocale } from "@/lib/locale";

const CUSTOMER_CATEGORIES = ["beverage_fmcg", "mining_energy", "logistics", "infrastructure"] as const;

export function EnterpriseCustomerShowcase() {
  const isLo = useLocale() === "lo";
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const filteredCustomers = activeCategory === "all"
    ? ENTERPRISE_CUSTOMERS
    : ENTERPRISE_CUSTOMERS.filter((customer) => customer.category === activeCategory);

  return (
    <section id="our-customers" className="border-y border-slate-200 bg-slate-50/70 py-16 dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-9 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <ShieldCheck className="h-4 w-4" />
            {isLo ? "ລູກຄ້າອົງກອນ" : "Enterprise Customers"}
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {isLo ? "ໂມດູນບໍລິການທີ່ເຊື່ອມກັບລູກຄ້າຂອງພວກເຮົາ" : "Connected Fleet and Service Customers"}
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["all", ...CUSTOMER_CATEGORIES].map((category) => {
              const customer = ENTERPRISE_CUSTOMERS.find((item) => item.category === category);
              const label = category === "all"
                ? (isLo ? "ທັງໝົດ" : "All")
                : (isLo ? customer?.categoryLo : customer?.categoryEn) ?? category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    activeCategory === category
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCustomers.map((customer) => (
            <article key={customer.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="mb-4 flex h-20 items-center justify-center rounded-xl bg-slate-50 p-3 dark:bg-white/5">
                <img src={customer.logoSrc} alt={isLo ? customer.fullNameLo : customer.fullNameEn} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">{isLo ? customer.categoryLo : customer.categoryEn}</p>
              <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{isLo ? customer.nameLo : customer.nameEn}</h3>
              <p className="mt-3 flex items-start gap-2 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-600 dark:border-white/5 dark:text-slate-300">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {isLo ? customer.serviceTypeLo : customer.serviceTypeEn}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
