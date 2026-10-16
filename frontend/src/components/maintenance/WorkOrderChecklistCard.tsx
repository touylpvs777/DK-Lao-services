import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import {
  addChecklistItem, deleteChecklistItem, getChecklist, updateChecklistItem,
  type ChecklistResult,
} from '@/api/maintenance'
import { toast } from '@/store/toastStore'

const RESULTS: { value: ChecklistResult; color: string }[] = [
  { value: 'ok', color: '#16a34a' },
  { value: 'attention', color: '#d97706' },
  { value: 'fail', color: '#dc2626' },
  { value: 'na', color: '#64748b' },
]

/** PM inspection checklist of a work order: one result per inspection point. */
export default function WorkOrderChecklistCard({ woId, readOnly }: { woId: number; readOnly: boolean }) {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const key = ['wo-checklist', woId]
  const q = useQuery({ queryKey: key, queryFn: () => getChecklist(woId).then((r) => r.data) })
  const [newLabel, setNewLabel] = useState('')
  const refresh = () => qc.invalidateQueries({ queryKey: key })
  const onError = () => toast.error(t('woChecklist.saveFailed'))

  const setResult = useMutation({
    mutationFn: (p: { id: number; result?: ChecklistResult; remark?: string | null }) =>
      updateChecklistItem(woId, p.id, { result: p.result, remark: p.remark }),
    onSuccess: refresh, onError,
  })
  const add = useMutation({
    mutationFn: (label: string) => addChecklistItem(woId, label),
    onSuccess: () => { setNewLabel(''); refresh() }, onError,
  })
  const del = useMutation({ mutationFn: (id: number) => deleteChecklistItem(woId, id), onSuccess: refresh, onError })

  const items = q.data ?? []
  if (!q.isLoading && items.length === 0 && readOnly) return null
  const done = items.filter((i) => i.result !== 'pending').length

  return (
    <div className="doc-editor-section">
      <h3 className="doc-editor-section-title">
        {t('woChecklist.title')} {items.length > 0 && <span className="cell-muted">({done}/{items.length})</span>}
      </h3>
      {items.length === 0 && !q.isLoading && <p className="cell-muted" style={{ fontSize: 13 }}>{t('woChecklist.empty')}</p>}
      {items.map((it) => (
        <div key={it.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px', fontSize: 13 }}>{it.position}. {it.label}</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {RESULTS.map((r) => (
              <button
                key={r.value} type="button" disabled={readOnly || setResult.isPending}
                className="btn btn-sm"
                style={{
                  background: it.result === r.value ? r.color : 'transparent', color: it.result === r.value ? '#fff' : r.color,
                  border: `1px solid ${r.color}`, padding: '2px 8px',
                }}
                onClick={() => setResult.mutate({ id: it.id, result: it.result === r.value ? 'pending' : r.value })}
              >{t(`woChecklist.result.${r.value}`)}</button>
            ))}
          </div>
          <input
            defaultValue={it.remark ?? ''} placeholder={t('woChecklist.remark')} disabled={readOnly}
            style={{ flex: '1 1 160px', fontSize: 12.5 }}
            onBlur={(e) => { if ((e.target.value || null) !== (it.remark ?? null)) setResult.mutate({ id: it.id, remark: e.target.value || null }) }}
          />
          {!readOnly && (
            <button type="button" className="btn btn-ghost btn-sm" title={t('woChecklist.delete')} onClick={() => del.mutate(it.id)}>
              <Trash2 size={13} />
            </button>
          )}
        </div>
      ))}
      {!readOnly && (
        <form
          style={{ display: 'flex', gap: 8, marginTop: 10 }}
          onSubmit={(e) => { e.preventDefault(); if (newLabel.trim()) add.mutate(newLabel.trim()) }}
        >
          <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder={t('woChecklist.addPlaceholder')} style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm" disabled={!newLabel.trim() || add.isPending}><Plus size={13} /> {t('woChecklist.add')}</button>
        </form>
      )}
    </div>
  )
}
