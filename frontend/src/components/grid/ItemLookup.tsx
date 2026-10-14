import { useEffect, useRef, useState } from 'react'
import { Search, Loader2, Package, Wrench, Truck } from 'lucide-react'
import { getParts } from '@/api/inventory'
import { getProducts } from '@/api/catalog'
import { getForklifts } from '@/api/forklift'
import '@/styles/shared.css'

/** A picked record, normalised so any document editor can turn it into a line. */
export interface LookupItem {
  item_code: string
  description: string
  unit: string
  unit_price: number
  product_id: number | null
  spare_part_id: number | null
  forklift_id: number | null
}

interface Option extends LookupItem {
  key: string
  kind: 'part' | 'product' | 'forklift'
  hint: string
}

interface Props {
  onPick: (item: LookupItem) => void
  disabled?: boolean
  placeholder?: string
}

const ICON = { part: Wrench, product: Package, forklift: Truck } as const

/**
 * Search-as-you-type picker over stock (spare parts), the catalog and the
 * forklift fleet. Picking a result fills a document line *with the record ids*,
 * which is what lets a document trace back to the stock / catalog / fleet record
 * and what makes a delivery note able to issue stock.
 */
export default function ItemLookup({ onPick, disabled, placeholder }: Props) {
  const [q, setQ] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) { setOptions([]); return }
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(async () => {
      const [parts, products, forklifts] = await Promise.allSettled([
        getParts({ q: term, page_size: 6, is_active: true } as never),
        getProducts({ q: term, page_size: 6, is_active: true }),
        getForklifts({ q: term, page_size: 6 } as never),
      ])
      if (cancelled) return
      const out: Option[] = []
      const linkedProducts = new Set<number>()
      if (parts.status === 'fulfilled') {
        for (const p of parts.value.data.items) {
          if (p.product_id) linkedProducts.add(p.product_id)
          out.push({
            key: `part-${p.id}`, kind: 'part', hint: 'ສະຕັອກ',
            item_code: p.part_number, description: p.name, unit: p.unit, unit_price: p.unit_price,
            product_id: p.product_id ?? null, spare_part_id: p.id, forklift_id: null,
          })
        }
      }
      if (products.status === 'fulfilled') {
        for (const p of products.value.data.items) {
          if (linkedProducts.has(p.id)) continue // already offered via its stock item
          out.push({
            key: `product-${p.id}`, kind: 'product', hint: 'Catalog',
            item_code: p.sku, description: p.name_lo || p.name_en, unit: 'unit', unit_price: 0,
            product_id: p.id, spare_part_id: null, forklift_id: null,
          })
        }
      }
      if (forklifts.status === 'fulfilled') {
        for (const f of forklifts.value.data.items) {
          out.push({
            key: `forklift-${f.id}`, kind: 'forklift', hint: 'ລົດ',
            item_code: f.serial_number, description: f.name_lo || f.name_en, unit: 'unit', unit_price: 0,
            product_id: null, spare_part_id: null, forklift_id: f.id,
          })
        }
      }
      setOptions(out)
      setLoading(false)
    }, 250)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [q])

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const pick = (o: Option) => {
    const { key: _k, kind: _kind, hint: _hint, ...item } = o
    onPick(item)
    setQ(''); setOptions([]); setOpen(false)
  }

  return (
    <div ref={box} style={{ position: 'relative', maxWidth: 420, marginBottom: 10 }}>
      <div className="search-wrap" style={{ maxWidth: 'none' }}>
        <Search size={14} />
        <input
          className="search-input"
          value={q}
          disabled={disabled}
          placeholder={placeholder ?? 'ຄົ້ນຫາອາໄຫຼ່ / ສິນຄ້າ / ລົດ ເພື່ອເພີ່ມເປັນລາຍການ...'}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {loading && <Loader2 size={14} className="spin" style={{ position: 'absolute', right: 10, top: 10 }} />}
      </div>
      {open && q.trim().length >= 2 && (
        <div style={{
          position: 'absolute', zIndex: 30, left: 0, right: 0, top: '100%', marginTop: 4, maxHeight: 280, overflowY: 'auto',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {!loading && options.length === 0 && (
            <div style={{ padding: 12, fontSize: 13, color: 'var(--color-text-muted)' }}>ບໍ່ພົບລາຍການ</div>
          )}
          {options.map((o) => {
            const Icon = ICON[o.kind]
            return (
              <button
                key={o.key} type="button" onClick={() => pick(o)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-subtle)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Icon size={15} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.description}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>{o.item_code}</span>
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{o.hint}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
