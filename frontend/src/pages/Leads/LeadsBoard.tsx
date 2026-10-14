import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lead, LeadStatus } from '@/types/lead'

const COLUMNS: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']

const COLOR: Record<LeadStatus, string> = {
  new: '#7c3aed', contacted: '#0891b2', qualified: '#d97706',
  proposal: '#2563eb', won: '#16a34a', lost: '#dc2626',
}

// Mirrors backend VALID_TRANSITIONS (models/lead.py) so illegal drops are
// refused up-front instead of round-tripping to a 422.
const ALLOWED: Record<LeadStatus, LeadStatus[]> = {
  new: ['contacted', 'lost'],
  contacted: ['qualified', 'lost'],
  qualified: ['proposal', 'lost'],
  proposal: ['won', 'lost'],
  won: [],
  lost: ['new'],
}

const fmt = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 })

interface Props {
  leads: Lead[]
  onMove: (lead: Lead, status: LeadStatus) => Promise<unknown>
  onOpen: (lead: Lead) => void
}

/** Kanban view of the lead pipeline. Drag a card to another column to advance it. */
export default function LeadsBoard({ leads, onMove, onOpen }: Props) {
  const { t } = useTranslation()
  const [dragId, setDragId] = useState<number | null>(null)
  const [over, setOver] = useState<LeadStatus | null>(null)
  const dragged = leads.find((l) => l.id === dragId) ?? null

  const canDrop = (to: LeadStatus) => !!dragged && ALLOWED[dragged.status].includes(to)

  const drop = (to: LeadStatus) => {
    setOver(null)
    if (dragged && canDrop(to)) onMove(dragged, to)
    setDragId(null)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(220px, 1fr))`, gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
      {COLUMNS.map((status) => {
        const items = leads.filter((l) => l.status === status)
        const total = items.reduce((s, l) => s + (l.value ?? 0), 0)
        const highlight = over === status && canDrop(status)
        return (
          <div
            key={status}
            onDragOver={(e) => { if (canDrop(status)) { e.preventDefault(); setOver(status) } }}
            onDragLeave={() => setOver((o) => (o === status ? null : o))}
            onDrop={() => drop(status)}
            style={{
              background: highlight ? `${COLOR[status]}12` : 'var(--color-bg-subtle)',
              border: `1px solid ${highlight ? COLOR[status] : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)', padding: 10, minHeight: 240,
              opacity: dragged && !canDrop(status) && dragged.status !== status ? 0.55 : 1,
              transition: 'background .15s, border-color .15s, opacity .15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLOR[status] }}>{t(`leads.status.${status}`)}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{items.length}</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginBottom: 10 }}>{fmt(total)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((l) => (
                <div
                  key={l.id}
                  draggable
                  onDragStart={() => setDragId(l.id)}
                  onDragEnd={() => { setDragId(null); setOver(null) }}
                  onClick={() => onOpen(l)}
                  style={{
                    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    borderLeft: `3px solid ${COLOR[status]}`, borderRadius: 'var(--radius-md)',
                    padding: '9px 10px', cursor: 'grab', boxShadow: 'var(--shadow-xs)',
                    opacity: dragId === l.id ? 0.4 : 1,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.35 }}>{l.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    <span>{l.value != null ? fmt(l.value) : '—'}</span>
                    {l.source && <span style={{ color: 'var(--color-text-muted)' }}>{l.source.replace('_', ' ')}</span>}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', padding: '18px 0' }}>—</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
