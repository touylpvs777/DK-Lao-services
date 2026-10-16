import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckSquare } from 'lucide-react'
import { getActivitySummary, listActivities, type ActivityState } from '@/api/crmActivities'
import { ActivityRow } from '@/components/customers/ActivityTimelineCard'
import '@/styles/shared.css'
import '@/pages/Customers/Customer360Page.css'

const TABS: { id: ActivityState; label: string }[] = [
  { id: 'open', label: 'ກຳລັງລໍຖ້າ' },
  { id: 'overdue', label: 'ເກີນກຳນົດ' },
  { id: 'done', label: 'ສຳເລັດແລ້ວ' },
]

/** Follow-up tasks across all customers; "mine" narrows to the signed-in user. */
export default function TasksPage() {
  const qc = useQueryClient()
  const [state, setState] = useState<ActivityState>('open')
  const [mine, setMine] = useState(true)

  const summary = useQuery({ queryKey: ['activity-summary'], queryFn: () => getActivitySummary().then((r) => r.data) })
  const list = useQuery({
    queryKey: ['crm-activities', 'tasks', state, mine],
    queryFn: () => listActivities({ state, mine, limit: 200 }).then((r) => r.data),
  })
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['crm-activities'] })
    qc.invalidateQueries({ queryKey: ['activity-summary'] })
  }
  const items = list.data ?? []

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckSquare size={22} /> ງານຕິດຕາມ</h1>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, marginLeft: 'auto' }}>
          <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} /> ສະເພາະຂອງຂ້ອຍ
        </label>
      </div>

      {summary.data && (
        <div style={{ display: 'flex', gap: 12, margin: '12px 0', flexWrap: 'wrap', fontSize: 13 }}>
          <span>ເປີດຢູ່ <b>{summary.data.open}</b></span>
          <span style={{ color: summary.data.overdue ? '#dc2626' : undefined }}>ເກີນກຳນົດ <b>{summary.data.overdue}</b></span>
          <span>ຄົບກຳນົດມື້ນີ້ <b>{summary.data.due_today}</b></span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {TABS.map((t) => (
          <button key={t.id} className={`btn btn-sm ${state === t.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setState(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="c360-card" style={{ padding: 0 }}>
        {list.isLoading ? (
          <div className="c360-empty">ກຳລັງໂຫຼດ…</div>
        ) : list.isError ? (
          <div className="c360-empty">ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ</div>
        ) : items.length === 0 ? (
          <div className="c360-empty">ບໍ່ມີລາຍການ. ເພີ່ມງານຕິດຕາມໄດ້ຈາກໜ້າລູກຄ້າ (Customer 360).</div>
        ) : (
          items.map((a) => <ActivityRow key={a.id} a={a} onChanged={refresh} showCustomer />)
        )}
      </div>
    </div>
  )
}
