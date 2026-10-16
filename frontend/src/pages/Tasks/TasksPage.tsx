import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckSquare } from 'lucide-react'
import { getActivitySummary, listActivities, type ActivityState } from '@/api/crmActivities'
import { ActivityRow } from '@/components/customers/ActivityTimelineCard'
import '@/styles/shared.css'
import '@/pages/Customers/Customer360Page.css'

const TABS: { id: ActivityState; labelKey: string }[] = [
  { id: 'open', labelKey: 'crmWork.tasks.tabOpen' },
  { id: 'overdue', labelKey: 'crmWork.tasks.tabOverdue' },
  { id: 'done', labelKey: 'crmWork.tasks.tabDone' },
]

/** Follow-up tasks across all customers; "mine" narrows to the signed-in user. */
export default function TasksPage() {
  const { t } = useTranslation()
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
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckSquare size={22} /> {t('crmWork.tasks.title')}</h1>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, marginLeft: 'auto' }}>
          <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} /> {t('crmWork.tasks.mine')}
        </label>
      </div>

      {summary.data && (
        <div style={{ display: 'flex', gap: 12, margin: '12px 0', flexWrap: 'wrap', fontSize: 13 }}>
          <span>{t('crmWork.tasks.open')} <b>{summary.data.open}</b></span>
          <span style={{ color: summary.data.overdue ? '#dc2626' : undefined }}>{t('crmWork.tasks.overdue')} <b>{summary.data.overdue}</b></span>
          <span>{t('crmWork.tasks.dueToday')} <b>{summary.data.due_today}</b></span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {TABS.map((tab) => (
          <button key={tab.id} className={`btn btn-sm ${state === tab.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setState(tab.id)}>
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="c360-card" style={{ padding: 0 }}>
        {list.isLoading ? (
          <div className="c360-empty">{t('crmWork.loading')}</div>
        ) : list.isError ? (
          <div className="c360-empty">{t('crmWork.loadFailed')}</div>
        ) : items.length === 0 ? (
          <div className="c360-empty">{t('crmWork.tasks.empty')}</div>
        ) : (
          items.map((a) => <ActivityRow key={a.id} a={a} onChanged={refresh} showCustomer />)
        )}
      </div>
    </div>
  )
}
