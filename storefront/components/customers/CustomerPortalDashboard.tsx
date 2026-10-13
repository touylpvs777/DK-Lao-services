"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Building2, CircleDollarSign, ClipboardList, LogOut, Package, RefreshCw, Wrench } from "lucide-react";
import { useLocale } from "@/lib/locale";

type PortalDashboard = {
  customer: { id: number; display_name: string; company?: string | null };
  summary: {
    forklift_count: number;
    active_rental_count: number;
    open_work_order_count: number;
    outstanding_by_currency: Record<string, number>;
  };
  forklifts: Array<{
    id: number;
    serial_number: string;
    name_en: string;
    name_lo?: string | null;
    model_number?: string | null;
    brand?: string | null;
    status: string;
    fuel_type?: string | null;
    current_hour_meter: number;
  }>;
  rental_contracts: Array<{
    id: number;
    contract_number: string;
    status: string;
    start_date: string;
    end_date: string;
    total_value: number;
    currency: string;
  }>;
  work_orders: Array<{
    id: number;
    work_order_number: string;
    status: string;
    priority: string;
    title: string;
    scheduled_date: string;
    completed_at?: string | null;
    forklift_serial_number: string;
    forklift_name: string;
  }>;
  invoices: Array<{
    id: number;
    invoice_number: string;
    status: string;
    total_amount: number;
    balance_due: number;
    currency: string;
    due_date?: string | null;
  }>;
};

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleDateString(locale === "lo" ? "lo-LA" : "en-GB");
}

function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const STATUS_LABELS_LO: Record<string, string> = {
  active: "ໃຊ້ງານຢູ່",
  active_rental: "ເຊົ່າຢູ່",
  available: "ວ່າງ",
  operational: "ພ້ອມໃຊ້ງານ",
  maintenance: "ກຳລັງບຳລຸງຮັກສາ",
  out_of_service: "ຢຸດໃຊ້ງານ",
  rented: "ກຳລັງເຊົ່າ",
  inactive: "ບໍ່ໄດ້ໃຊ້ງານ",
  open: "ເປີດ",
  scheduled: "ນັດໝາຍແລ້ວ",
  confirmed: "ຢືນຢັນແລ້ວ",
  in_progress: "ກຳລັງດຳເນີນການ",
  on_hold: "ລໍຖ້າ",
  awaiting_parts: "ລໍຖ້າອາໄຫຼ່",
  waiting_parts: "ລໍຖ້າອາໄຫຼ່",
  waiting_for_parts: "ລໍຖ້າອາໄຫຼ່",
  pending_approval: "ລໍຖ້າການຢືນຢັນ",
  assigned: "ມອບໝາຍແລ້ວ",
  dispatched: "ສົ່ງຊ່າງແລ້ວ",
  completed: "ສຳເລັດແລ້ວ",
  cancelled: "ຍົກເລີກແລ້ວ",
  canceled: "ຍົກເລີກແລ້ວ",
  paid: "ຊຳລະແລ້ວ",
  unpaid: "ຍັງບໍ່ຊຳລະ",
  overdue: "ເກີນກຳນົດ",
  partially_paid: "ຊຳລະບາງສ່ວນ",
  pending: "ລໍຖ້າດຳເນີນການ",
  issued: "ອອກແລ້ວ",
  sent: "ສົ່ງແລ້ວ",
  draft: "ຮ່າງ",
  void: "ໂມຄະ",
  expired: "ໝົດອາຍຸແລ້ວ",
  terminated: "ສິ້ນສຸດແລ້ວ",
};

function localizedStatus(value: string, isLao: boolean) {
  return isLao ? (STATUS_LABELS_LO[value.toLowerCase()] || titleCase(value)) : titleCase(value);
}

function localizedPriority(value: string, isLao: boolean) {
  if (!isLao) return titleCase(value);
  const labels: Record<string, string> = {
    low: "ຕ່ຳ",
    normal: "ປົກກະຕິ",
    medium: "ປານກາງ",
    high: "ສູງ",
    urgent: "ດ່ວນ",
    critical: "ວິກິດ",
  };
  return labels[value.toLowerCase()] || titleCase(value);
}

const PORTAL_ERROR_LABELS: Record<string, [string, string]> = {
  "Customer login is not configured.": ["ລະບົບເຂົ້າໃຊ້ລູກຄ້າຍັງບໍ່ໄດ້ຕັ້ງຄ່າ.", "Customer login is not configured."],
  "Enter your username and password.": ["ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ.", "Enter your username and password."],
  "Invalid username or password.": ["ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ.", "Invalid username or password."],
  "Customer login is temporarily unavailable.": ["ຂະນະນີ້ບໍ່ສາມາດເຂົ້າໃຊ້ລະບົບລູກຄ້າໄດ້.", "Customer login is temporarily unavailable."],
  "CRM returned an incomplete login response.": ["CRM ສົ່ງຄຳຕອບການເຂົ້າໃຊ້ທີ່ບໍ່ສົມບູນ.", "CRM returned an incomplete login response."],
  "CRM is unavailable. Please try again shortly.": ["ຂະນະນີ້ CRM ບໍ່ພ້ອມໃຊ້ງານ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.", "CRM is unavailable. Please try again shortly."],
  "Please sign in.": ["ກະລຸນາເຂົ້າລະບົບ.", "Please sign in."],
  "Customer portal is not configured.": ["ລະບົບພອດທັນລູກຄ້າຍັງບໍ່ໄດ້ຕັ້ງຄ່າ.", "Customer portal is not configured."],
  "CRM returned an invalid response.": ["CRM ສົ່ງຄຳຕອບທີ່ບໍ່ຖືກຕ້ອງ.", "CRM returned an invalid response."],
  "Could not load your customer data.": ["ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລູກຄ້າໄດ້.", "Could not load your customer data."],
  "Could not connect to CRM.": ["ບໍ່ສາມາດເຊື່ອມຕໍ່ CRM ໄດ້.", "Could not connect to CRM."],
  "Sign in failed.": ["ເຂົ້າລະບົບບໍ່ສຳເລັດ.", "Sign in failed."],
};

function localizedPortalMessage(message: string, isLao: boolean) {
  const labels = PORTAL_ERROR_LABELS[message];
  return labels ? labels[isLao ? 0 : 1] : message;
}

export default function CustomerPortalDashboard() {
  const locale = useLocale();
  const isLao = locale === "lo";
  const [dashboard, setDashboard] = useState<PortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/client-portal/dashboard", { cache: "no-store" });
      if (response.status === 401) {
        setDashboard(null);
        return;
      }
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Could not load your customer data.");
      setDashboard(body as PortalDashboard);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not connect to CRM.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/client-portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Sign in failed.");
      setPassword("");
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/client-portal/logout", { method: "POST" });
    setDashboard(null);
    setMessage("");
  }

  const containerClass = "mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8";
  if (loading && !dashboard) {
    return <main className="min-h-[70vh] bg-slate-50 dark:bg-slate-950"><div className={`${containerClass} py-24 text-center text-slate-500`}>{isLao ? "ກຳລັງດຶງຂໍ້ມູນຈາກ CRM…" : "Loading your CRM account…"}</div></main>;
  }

  if (!dashboard) {
    return (
      <main className="min-h-[75vh] bg-slate-50 dark:bg-slate-950">
        <div className={`${containerClass} flex min-h-[75vh] items-center justify-center`}>
          <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><Building2 className="h-6 w-6" /></div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{isLao ? "ລະບົບບັນຊີລູກຄ້າ" : "Customer Fleet Portal"}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{isLao ? "ເຂົ້າເບິ່ງລົດ, ສັນຍາເຊົ່າ, ວຽກບໍລິການ ແລະໃບແຈ້ງໜີ້ທີ່ຜູກກັບບັນຊີຂອງທ່ານ." : "Sign in to view only the fleet, rental contracts, service work, and invoices linked to your account."}</p>
            <label className="mt-6 block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="portal-username">{isLao ? "ຊື່ຜູ້ໃຊ້" : "Username"}</label>
            <input id="portal-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
            <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="portal-password">{isLao ? "ລະຫັດຜ່ານ" : "Password"}</label>
            <input id="portal-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
            {message && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{localizedPortalMessage(message, isLao)}</p>}
            <button disabled={submitting} className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? (isLao ? "ກຳລັງເຂົ້າ…" : "Signing in…") : (isLao ? "ເຂົ້າລະບົບ" : "Sign in")}</button>
            <p className="mt-4 text-xs text-slate-500">{isLao ? "ຮັບບັນຊີເຂົ້າໃຊ້ຈາກຜູ້ດູແລ DK LAO." : "Ask your DK LAO account manager to create your portal login."}</p>
          </form>
        </div>
      </main>
    );
  }

  const stats = [
    { label: isLao ? "ລົດໃນ Fleet" : "Fleet units", value: dashboard.summary.forklift_count, icon: Package },
    { label: isLao ? "ສັນຍາເຊົ່າທີ່ໃຊ້ງານ" : "Active rentals", value: dashboard.summary.active_rental_count, icon: Building2 },
    { label: isLao ? "ວຽກບໍລິການເປີດຢູ່" : "Open service work", value: dashboard.summary.open_work_order_count, icon: Wrench },
    { label: isLao ? "ໜີ້ຄ້າງແຍກຕາມສະກຸນ" : "Outstanding by currency", value: Object.entries(dashboard.summary.outstanding_by_currency).map(([currency, amount]) => `${amount.toLocaleString()} ${currency}`).join(" · ") || "—", icon: CircleDollarSign },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className={containerClass}>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{isLao ? "ພອດທັນລູກຄ້າ · ຂໍ້ມູນຈາກ CRM" : "Customer portal · Live CRM records"}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{dashboard.customer.company || dashboard.customer.display_name}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dashboard.customer.display_name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void loadDashboard()} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"><RefreshCw className="h-4 w-4" />{isLao ? "ອັບເດດ" : "Refresh"}</button>
            <button onClick={() => void handleLogout()} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-rose-400 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"><LogOut className="h-4 w-4" />{isLao ? "ອອກຈາກລະບົບ" : "Sign out"}</button>
          </div>
        </div>

        {message && <p role="alert" className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">{localizedPortalMessage(message, isLao)}</p>}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={isLao ? "ສະຫຼຸບບັນຊີ" : "Account summary"}>
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><Icon className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" /></div>
              <p className="mt-3 break-words text-2xl font-black text-slate-900 dark:text-white">{value}</p>
            </article>
          ))}
        </section>

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10"><h2 className="font-bold text-slate-900 dark:text-white">{isLao ? "ລົດ ແລະ ອຸປະກອນທີ່ຜູກບັນຊີ" : "Linked fleet units"}</h2><Link href="/store?pre_category=spare-parts-consumables" className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400">{isLao ? "ຊອກອາໄຫຼ່" : "Find parts"} →</Link></div>
          {dashboard.forklifts.length === 0 ? <p className="p-6 text-sm text-slate-500">{isLao ? "ຍັງບໍ່ມີລົດທີ່ຜູກກັບລູກຄ້ານີ້ໃນ CRM." : "No units are linked to this customer in CRM yet."}</p> : (
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr><th className="px-5 py-3">{isLao ? "ເລກຊີຣຽວ" : "Serial"}</th><th className="px-5 py-3">{isLao ? "ລຸ້ນ" : "Equipment"}</th><th className="px-5 py-3">{isLao ? "ສະຖານະ" : "Status"}</th><th className="px-5 py-3">{isLao ? "ຊົ່ວໂມງໃຊ້ງານ" : "Hour meter"}</th><th className="px-5 py-3"></th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-white/5">{dashboard.forklifts.map((unit) => <tr key={unit.id}><td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">{unit.serial_number}</td><td className="px-5 py-4"><div className="font-semibold text-slate-800 dark:text-slate-200">{isLao ? (unit.name_lo || unit.name_en) : unit.name_en}</div><div className="text-xs text-slate-500">{[unit.brand, unit.model_number, unit.fuel_type].filter(Boolean).join(" · ")}</div></td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{localizedStatus(unit.status, isLao)}</td><td className="px-5 py-4 font-mono text-slate-700 dark:text-slate-300">{unit.current_hour_meter.toLocaleString()} {isLao ? "ຊົ່ວໂມງ" : "hrs"}</td><td className="px-5 py-4 text-right"><Link href={`/services?request=pm&unit=${encodeURIComponent(unit.serial_number)}&model=${encodeURIComponent(unit.model_number || unit.name_en)}#booking-form`} className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400">{isLao ? "ຂໍບໍລິການ" : "Request service"} →</Link></td></tr>)}</tbody></table></div>
          )}
        </section>

        <div className="mb-8 grid gap-8 xl:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10"><h2 className="font-bold text-slate-900 dark:text-white">{isLao ? "ສັນຍາເຊົ່າ" : "Rental contracts"}</h2><Link href="/services/rental" className="text-xs font-bold text-indigo-700 hover:underline dark:text-indigo-400">{isLao ? "ຂໍລາຄາເຊົ່າ" : "Request rental quote"} →</Link></div>
            {dashboard.rental_contracts.length === 0 ? <p className="p-6 text-sm text-slate-500">{isLao ? "ຍັງບໍ່ມີສັນຍາເຊົ່າທີ່ຜູກບັນຊີ." : "No rental contracts are linked to this account."}</p> : <ul className="divide-y divide-slate-100 dark:divide-white/5">{dashboard.rental_contracts.map((contract) => <li key={contract.id} className="flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="font-mono font-bold text-slate-900 dark:text-white">{contract.contract_number}</p><p className="mt-1 text-xs text-slate-500">{formatDate(contract.start_date, locale)} – {formatDate(contract.end_date, locale)} · {localizedStatus(contract.status, isLao)}</p></div><p className="text-sm font-bold text-slate-800 dark:text-slate-200">{contract.total_value.toLocaleString()} {contract.currency}</p></li>)}</ul>}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10"><h2 className="font-bold text-slate-900 dark:text-white">{isLao ? "ວຽກບໍລິການ" : "Service work orders"}</h2><Link href="/services#booking-form" className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400">{isLao ? "ຈອງບໍລິການ" : "Book service"} →</Link></div>
            {dashboard.work_orders.length === 0 ? <p className="p-6 text-sm text-slate-500">{isLao ? "ຍັງບໍ່ມີໃບສັ່ງງານບໍລິການ." : "No service work orders are linked to this account."}</p> : <ul className="divide-y divide-slate-100 dark:divide-white/5">{dashboard.work_orders.map((order) => <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="font-mono font-bold text-slate-900 dark:text-white">{order.work_order_number} · {order.forklift_serial_number}</p><p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{order.title}</p><p className="mt-1 text-xs text-slate-500">{formatDate(order.scheduled_date, locale)} · {localizedStatus(order.status, isLao)} · {localizedPriority(order.priority, isLao)}</p></div><Wrench className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></li>)}</ul>}
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10"><h2 className="font-bold text-slate-900 dark:text-white">{isLao ? "ໃບແຈ້ງໜີ້" : "Invoices"}</h2><ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div>
          {dashboard.invoices.length === 0 ? <p className="p-6 text-sm text-slate-500">{isLao ? "ບໍ່ມີໃບແຈ້ງໜີ້ໃຫ້ສະແດງ." : "There are no invoices to display."}</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr><th className="px-5 py-3">{isLao ? "ເລກທີ" : "Invoice"}</th><th className="px-5 py-3">{isLao ? "ສະຖານະ" : "Status"}</th><th className="px-5 py-3">{isLao ? "ຍອດລວມ" : "Total"}</th><th className="px-5 py-3">{isLao ? "ຍອດຄ້າງ" : "Balance due"}</th><th className="px-5 py-3">{isLao ? "ວັນຄົບກຳນົດ" : "Due date"}</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-white/5">{dashboard.invoices.map((invoice) => <tr key={invoice.id}><td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">{invoice.invoice_number}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{localizedStatus(invoice.status, isLao)}</td><td className="px-5 py-4">{invoice.total_amount.toLocaleString()} {invoice.currency}</td><td className="px-5 py-4 font-semibold">{invoice.balance_due.toLocaleString()} {invoice.currency}</td><td className="px-5 py-4 text-slate-500">{formatDate(invoice.due_date, locale)}</td></tr>)}</tbody></table></div>}
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label={isLao ? "ລິ້ງໂມດູນ" : "Connected modules"}>
          <Link href="/services#booking-form" className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-emerald-400 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">{isLao ? "ບໍລິການຊ່ອມ ແລະ PM →" : "Service and maintenance →"}</Link>
          <Link href="/store?pre_category=spare-parts-consumables" className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-blue-400 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">{isLao ? "ອາໄຫຼ່ໃນລາຍການ CRM →" : "CRM spare-parts catalog →"}</Link>
          <Link href="/services/rental" className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-indigo-400 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">{isLao ? "ຂໍລາຄາເຊົ່າ →" : "Request rental quote →"}</Link>
        </section>
      </div>
    </main>
  );
}
