import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CheckSquare, Receipt, TrendingUp } from 'lucide-react'
import { getCrmSummary } from '@/api/dashboard'
import { useAuthStore } from '@/store/authStore'
import { usePanelStore } from '@/store/panelStore'
import { useNow, formatClock, formatLongDate } from '@/hooks/useNow'
import { useShellStats } from '@/hooks/useShellStats'

function AnalogClock({ date }: { date: Date }) {
  const minutes = date.getMinutes()
  const hours = (date.getHours() % 12) + minutes / 60
  return (
    <svg className="panel-analog" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="29" className="panel-analog-face" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="32" y1="6.5" x2="32" y2={i % 3 === 0 ? '11' : '9'}
          className="panel-analog-tick" transform={`rotate(${i * 30} 32 32)`} />
      ))}
      <line x1="32" y1="32" x2="32" y2="19" className="panel-analog-hour" transform={`rotate(${hours * 30} 32 32)`} />
      <line x1="32" y1="32" x2="32" y2="12" className="panel-analog-minute" transform={`rotate(${minutes * 6} 32 32)`} />
      <circle cx="32" cy="32" r="2.4" className="panel-analog-pin" />
    </svg>
  )
}

/** Right-hand widget column: time and greeting, the sales pipeline and today's follow-ups. */
export default function RightPanel() {
  const { t, i18n } = useTranslation()
  const open = usePanelStore((s) => s.open)
  const user = useAuthStore((s) => s.user)
  const now = useNow()
  const { overdueTasks, newLeads } = useShellStats()
  const crm = useQuery({
    queryKey: ['shell-crm-summary'], queryFn: () => getCrmSummary().then((r) => r.data),
    staleTime: 60_000, enabled: !!user && open, retry: false,
  })

  if (!open) return null

  const name = user?.full_name ?? user?.username ?? ''
  const money = (value: number | undefined) =>
    value === undefined ? '—' : `${Math.round(value).toLocaleString()} ${crm.data?.currency ?? ''}`.trim()

  return (
    <aside className="right-panel" aria-label={t('shell.togglePanel')}>
      <section className="panel-card panel-clock">
        <div className="panel-clock-row">
          <span className="panel-clock-time">{formatClock(now)}</span>
          <AnalogClock date={now} />
        </div>
        <div className="panel-clock-date">{formatLongDate(now, i18n.language)}</div>
        <div className="panel-greeting">{t('shell.greeting', { name })}</div>
      </section>

      <section className="panel-card panel-pipeline">
        <div className="panel-pipeline-label">{t('shell.openPipeline')}</div>
        <div className="panel-pipeline-value">{money(crm.data?.open_pipeline_value)}</div>
        {crm.data && (
          <div className="panel-pipeline-meta">
            {t('shell.winRate')} {Math.round(crm.data.win_rate)}%
          </div>
        )}
        <Link to="/leads" className="panel-pipeline-cta">
          <TrendingUp size={16} /> {t('shell.viewLeads')} <ArrowRight size={15} />
        </Link>
      </section>

      <section className="panel-card panel-today">
        <div className="panel-card-title">{t('shell.today')}</div>
        <Link to="/leads" className="panel-row">
          <span className="panel-row-icon"><TrendingUp size={16} /></span>
          <span className="panel-row-label">{t('shell.newLeads')}</span>
          <span className="panel-row-value">{newLeads}</span>
        </Link>
        <Link to="/tasks" className={`panel-row${overdueTasks > 0 ? ' panel-row--alert' : ''}`}>
          <span className="panel-row-icon"><CheckSquare size={16} /></span>
          <span className="panel-row-label">{t('shell.overdueTasks')}</span>
          <span className="panel-row-value">{overdueTasks}</span>
        </Link>
        <Link to="/billing" className="panel-row">
          <span className="panel-row-icon"><Receipt size={16} /></span>
          <span className="panel-row-label">{t('shell.receivables')}</span>
          <span className="panel-row-value panel-row-value--money">{money(crm.data?.receivables_total)}</span>
        </Link>
      </section>
    </aside>
  )
}
