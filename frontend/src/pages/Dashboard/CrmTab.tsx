import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCrmSummary } from '@/api/dashboard'
import type { CrmStatusBucket } from '@/types/dashboard'

const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const lak = (v: number) => `₭ ${fmt.format(Math.round(v))}`
const pct = (v: number) => `${Math.round(v * 100)}%`

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-violet-500', contacted: 'bg-cyan-500', qualified: 'bg-amber-500', proposal: 'bg-blue-600',
  won: 'bg-emerald-500', lost: 'bg-red-500',
  in_stock: 'bg-slate-500', rented: 'bg-blue-600', sold: 'bg-emerald-500', reserved: 'bg-amber-500',
  in_service: 'bg-orange-500', decommissioned: 'bg-zinc-400',
}

const CARD = 'rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-none'

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className={`${CARD} [container-type:inline-size]`}>
      <p className="text-sm text-slate-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 whitespace-nowrap text-[clamp(1.05rem,11cqw,1.5rem)] font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{hint}</p>}
    </div>
  )
}

function Bars({ title, rows, valueOf, to }: {
  title: string
  rows: { key: string; label: string; n: number; text: string }[]
  to?: string
}) {
  const max = Math.max(1, ...rows.map((r) => r.n))
  const body = (
    <>
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      <div className="flex flex-col gap-3">
        {rows.length === 0 && <p className="text-sm text-slate-400">—</p>}
        {rows.map((r) => (
          <div key={r.key}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-zinc-200">{r.label}</span>
              <span className="text-slate-500 dark:text-zinc-400">{r.text}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div className={`h-full rounded-full ${STATUS_COLOR[r.key] ?? 'bg-blue-600'}`} style={{ width: `${(r.n / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
  return to ? <Link to={to} className={`${CARD} block transition-shadow hover:shadow-md`}>{body}</Link> : <div className={CARD}>{body}</div>
}

const bucketRows = (b: CrmStatusBucket[], withValue: boolean) =>
  b.map((x) => ({
    key: x.status, label: x.status.replace('_', ' '), n: x.count,
    text: withValue ? `${x.count} · ${lak(x.value)}` : String(x.count),
  }))

/** Sales & CRM tab — pipeline, conversion, receivables aging, fleet utilisation, top customers. */
export default function CrmTab() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['crmSummary'],
    queryFn: () => getCrmSummary().then((r) => r.data),
  })

  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
  if (isError || !data) return <p className="text-sm text-red-600">ໂຫຼດຂໍ້ມູນ CRM ບໍ່ສຳເລັດ</p>

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="ມູນຄ່າ Pipeline (ເປີດ)" value={lak(data.open_pipeline_value)} />
        <Kpi label="ອັດຕາຊະນະ (Win rate)" value={pct(data.win_rate)} hint="Lead ທີ່ Won / (Won + Lost)" />
        <Kpi label="ອັດຕາປິດໃບສະເໜີລາຄາ" value={pct(data.quotation_conversion_rate)} hint="ຍອມຮັບ ຫຼື ແປງແລ້ວ" />
        <Kpi label="ລູກໜີ້ຄ້າງຊຳລະ" value={lak(data.receivables_total)} />
        <Kpi label="ອັດຕາໃຊ້ງານລົດ" value={pct(data.fleet_utilisation)} hint="ລົດທີ່ເຊົ່າຢູ່ / ລົດທີ່ໃຊ້ງານໄດ້" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Bars title="Lead Pipeline" rows={bucketRows(data.pipeline, true)} to="/leads" />
        <Bars title="ໃບສະເໜີລາຄາຕາມສະຖານະ" rows={bucketRows(data.quotations, true)} to="/quotations" />
        <Bars
          title="ອາຍຸໜີ້ຄ້າງຊຳລະ (Receivables aging)"
          rows={data.receivables_aging.map((a, i) => ({
            key: ['', 'contacted', 'qualified', 'lost'][i] ?? '', label: a.label, n: a.amount, text: `${a.count} · ${lak(a.amount)}`,
          }))}
          to="/billing/invoices"
        />
        <Bars title="ສະຖານະລົດ" rows={bucketRows(data.fleet, false)} to="/equipment" />
      </div>

      <div className={CARD}>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">ລູກຄ້າອັນດັບຕົ້ນ (ຕາມມູນຄ່າບິນ)</h3>
        {data.top_customers.length === 0 ? (
          <p className="text-sm text-slate-400">—</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="pb-2 font-medium">ລູກຄ້າ</th>
                  <th className="pb-2 text-right font-medium">ມູນຄ່າບິນ</th>
                  <th className="pb-2 text-right font-medium">ຊຳລະແລ້ວ</th>
                </tr>
              </thead>
              <tbody>
                {data.top_customers.map((c) => (
                  <tr key={c.customer_id} className="border-t border-slate-100 dark:border-zinc-800">
                    <td className="py-2"><Link className="font-medium text-blue-700 hover:underline" to={`/customers/${c.customer_id}`}>{c.name}</Link></td>
                    <td className="py-2 text-right">{lak(c.invoiced)}</td>
                    <td className="py-2 text-right text-slate-500">{lak(c.paid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
