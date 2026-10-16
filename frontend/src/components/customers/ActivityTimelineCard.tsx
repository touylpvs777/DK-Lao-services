import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Phone, MapPin, Users, Mail, MessageCircle, StickyNote, CheckSquare, Check, RotateCcw, Trash2, Plus, History,
} from 'lucide-react'
import {
  ACTIVITY_TYPES, completeActivity, createActivity, deleteActivity, listActivities, reopenActivity,
  type ActivityType, type CrmActivity,
} from '@/api/crmActivities'
import { getContacts } from '@/api/customers'
import { toast } from '@/store/toastStore'

export const TYPE_ICON: Record<ActivityType, React.ElementType> = {
  call: Phone, visit: MapPin, meeting: Users, email: Mail, whatsapp: MessageCircle, note: StickyNote, task: CheckSquare,
}

export function fmtDateTime(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const empty = { type: 'call' as ActivityType, subject: '', notes: '', due_at: '', contact_id: '', done: false }

/** Row used by both the customer timeline and the Tasks page. */
export function ActivityRow({ a, onChanged, showCustomer }: { a: CrmActivity; onChanged: () => void; showCustomer?: boolean }) {
  const { t } = useTranslation()
  const Icon = TYPE_ICON[a.type] ?? CheckSquare
  const onError = () => toast.error(t('crmWork.actionFailed'))
  const done = useMutation({ mutationFn: () => completeActivity(a.id), onSuccess: onChanged, onError })
  const reopen = useMutation({ mutationFn: () => reopenActivity(a.id), onSuccess: onChanged, onError })
  const del = useMutation({ mutationFn: () => deleteActivity(a.id), onSuccess: onChanged, onError })
  const isDone = !!a.completed_at

  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 16px', borderTop: '1px solid var(--color-border)', alignItems: 'flex-start' }}>
      <div style={{ marginTop: 2, color: isDone ? 'var(--color-text-muted)' : a.is_overdue ? '#dc2626' : 'var(--color-primary-600, #2563eb)' }}>
        <Icon size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, textDecoration: isDone && a.due_at ? 'line-through' : 'none' }}>
          {a.subject}
          <span className="cell-muted" style={{ fontWeight: 400 }}> · {t(`crmWork.types.${a.type}`, a.type)}</span>
        </div>
        {a.notes && <div className="cell-muted" style={{ fontSize: 12, marginTop: 2, whiteSpace: 'pre-wrap' }}>{a.notes}</div>}
        <div className="cell-muted" style={{ fontSize: 11.5, marginTop: 3 }}>
          {showCustomer && a.customer_id && <><Link to={`/customers/${a.customer_id}`}>{a.customer_name}</Link> · </>}
          {isDone
            ? t('crmWork.completedOn', { date: fmtDateTime(a.completed_at) })
            : a.due_at && <span style={{ color: a.is_overdue ? '#dc2626' : undefined, fontWeight: a.is_overdue ? 600 : 400 }}>
                {t(a.is_overdue ? 'crmWork.overdueAt' : 'crmWork.dueOn', { date: fmtDateTime(a.due_at) })}
              </span>}
          {a.assigned_name && ` · ${a.assigned_name}`}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {isDone
          ? a.due_at && <button className="btn btn-ghost btn-sm" title={t('crmWork.reopen')} onClick={() => reopen.mutate()}><RotateCcw size={13} /></button>
          : <button className="btn btn-ghost btn-sm" title={t('crmWork.complete')} onClick={() => done.mutate()}><Check size={13} /></button>}
        <button className="btn btn-ghost btn-sm" title={t('crmWork.delete')} onClick={() => window.confirm(t('crmWork.confirmDeleteActivity')) && del.mutate()}><Trash2 size={13} /></button>
      </div>
    </div>
  )
}

/** Customer 360: log calls/visits/notes and schedule follow-ups, newest first. */
export default function ActivityTimelineCard({ customerId }: { customerId: number }) {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const q = useQuery({
    queryKey: ['crm-activities', 'customer', customerId],
    queryFn: () => listActivities({ customer_id: customerId, limit: 200 }).then((r) => r.data),
  })
  const contactsQ = useQuery({ queryKey: ['customer-contacts', customerId], queryFn: () => getContacts(customerId).then((r) => r.data) })
  const [form, setForm] = useState<typeof empty | null>(null)

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['crm-activities'] })
    qc.invalidateQueries({ queryKey: ['activity-summary'] })
  }
  const add = useMutation({
    mutationFn: (f: typeof empty) => createActivity({
      type: f.type, subject: f.subject.trim(), notes: f.notes || null, customer_id: customerId,
      contact_id: f.contact_id ? Number(f.contact_id) : null,
      due_at: f.due_at ? new Date(f.due_at).toISOString() : null,
      completed: f.done,
    }),
    onSuccess: () => { setForm(null); refresh() },
    onError: () => toast.error(t('crmWork.saveFailed')),
  })

  const items = q.data ?? []
  const open = items.filter((a) => !a.completed_at && a.due_at)
  const rest = items.filter((a) => !(!a.completed_at && a.due_at))

  return (
    <div className="c360-card">
      <div className="c360-card-header">
        <History size={16} /> {t('crmWork.activities')} <span className="c360-card-count">({items.length})</span>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setForm(form ? null : { ...empty })}>
          <Plus size={13} /> {t('crmWork.add')}
        </button>
      </div>

      {form && (
        <form className="c360-card-body"
          style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', alignItems: 'end' }}
          onSubmit={(e) => { e.preventDefault(); if (form.subject.trim()) add.mutate(form) }}>
          <div className="form-group">
            <label>{t('crmWork.type')}</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ActivityType })}>
              {ACTIVITY_TYPES.map((x) => <option key={x.value} value={x.value}>{t(x.labelKey)}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>{t('crmWork.subject')}</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} autoFocus />
          </div>
          <div className="form-group">
            <label>{t('crmWork.dueAt')}</label>
            <input type="datetime-local" value={form.due_at} onChange={(e) => setForm({ ...form, due_at: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('crmWork.contact')}</label>
            <select value={form.contact_id} onChange={(e) => setForm({ ...form, contact_id: e.target.value })}>
              <option value="">—</option>
              {(contactsQ.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>{t('crmWork.notes')}</label>
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12.5 }}>
            <input type="checkbox" checked={form.done} onChange={(e) => setForm({ ...form, done: e.target.checked })} />
            {t('crmWork.alreadyDone')}
          </label>
          <button className="btn btn-primary" disabled={add.isPending || !form.subject.trim()}>{t('crmWork.save')}</button>
        </form>
      )}

      {items.length === 0 && !form ? (
        <div className="c360-empty">{t('crmWork.noActivities')}</div>
      ) : (
        <div>
          {[...open, ...rest].map((a) => <ActivityRow key={a.id} a={a} onChanged={refresh} />)}
        </div>
      )}
    </div>
  )
}
