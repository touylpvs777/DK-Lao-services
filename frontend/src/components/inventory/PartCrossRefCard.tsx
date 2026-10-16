import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil } from 'lucide-react'
import { updatePart } from '@/api/inventory'
import { toast } from '@/store/toastStore'
import type { SparePart } from '@/types/inventory'

/** OEM number, equivalent numbers (other brands) and compatible models of a spare part. */
export default function PartCrossRefCard({ part, onSaved }: { part: SparePart; onSaved: () => void }) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    oem_number: part.oem_number ?? '', equivalent_numbers: part.equivalent_numbers ?? '', compatible_models: part.compatible_models ?? '',
  })

  const save = async () => {
    setSaving(true)
    try {
      await updatePart(part.id, {
        oem_number: form.oem_number.trim() || null,
        equivalent_numbers: form.equivalent_numbers.trim() || null,
        compatible_models: form.compatible_models.trim() || null,
      })
      setEditing(false)
      onSaved()
    } catch {
      toast.error(t('partXref.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const rows: { key: keyof typeof form; label: string; multiline?: boolean }[] = [
    { key: 'oem_number', label: t('partXref.oem') },
    { key: 'equivalent_numbers', label: t('partXref.equivalent'), multiline: true },
    { key: 'compatible_models', label: t('partXref.models'), multiline: true },
  ]

  return (
    <div className="detail-specs-section" style={{ marginTop: 24 }}>
      <h2 className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {t('partXref.title')}
        {!editing && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setEditing(true)}>
            <Pencil size={13} /> {t('partXref.edit')}
          </button>
        )}
      </h2>
      {editing ? (
        <div style={{ display: 'grid', gap: 10, marginTop: 10, maxWidth: 560 }}>
          {rows.map((r) => (
            <div className="form-group" key={r.key}>
              <label>{r.label}</label>
              {r.multiline
                ? <textarea rows={2} value={form[r.key]} placeholder={t('partXref.listHint')} onChange={(e) => setForm({ ...form, [r.key]: e.target.value })} />
                : <input value={form[r.key]} onChange={(e) => setForm({ ...form, [r.key]: e.target.value })} />}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" disabled={saving} onClick={save}>{t('partXref.save')}</button>
            <button className="btn btn-ghost btn-sm" disabled={saving} onClick={() => setEditing(false)}>{t('partXref.cancel')}</button>
          </div>
        </div>
      ) : (
        <dl className="detail-meta" style={{ marginTop: 10 }}>
          {rows.map((r) => (
            <div key={r.key} style={{ display: 'contents' }}>
              <dt>{r.label}</dt>
              <dd style={{ whiteSpace: 'pre-wrap' }}>{part[r.key] || '—'}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
