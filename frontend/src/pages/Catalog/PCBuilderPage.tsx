import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Heart, ShoppingCart, ChevronDown, ChevronRight, ChevronUp, User as UserIcon,
  Cpu, CircuitBoard, MemoryStick, HardDrive, MonitorPlay, Disc3, Droplets, Fan, Zap,
  Box, Monitor, Mouse, Keyboard, Headphones, Speaker, Copy, MessageCircle, X, Check,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCatalog } from '@/hooks/useCatalog'
import { useCategories } from '@/hooks/useCategories'
import { resolveMediaUrl } from '@/utils/media'
import { toast } from '@/store/toastStore'
import { useAuthStore } from '@/store/authStore'
import type { Product } from '@/types/catalog'
import './PCBuilderPage.css'

/** Fill these in to show them in the footer / floating chat button. Empty = hidden. */
const STORE = {
  name: 'DK',
  whatsapp: '',
  email: '',
  branches: [] as { name: string; phone: string }[],
}

interface Slot { key: string; label: string; icon: LucideIcon; match: RegExp; q: string }

const SLOTS: Slot[] = [
  { key: 'cpu', label: 'CPU', icon: Cpu, match: /^cpu$|processor/i, q: 'CPU' },
  { key: 'mainboard', label: 'MAINBOARD', icon: CircuitBoard, match: /main\s?board|motherboard/i, q: 'MAINBOARD' },
  { key: 'ram', label: 'RAM PC', icon: MemoryStick, match: /^ram|memory/i, q: 'RAM' },
  { key: 'm2', label: 'SSD M.2', icon: HardDrive, match: /m\.?2|nvme/i, q: 'M.2' },
  { key: 'vga', label: 'VGA GRAPHICS CARD', icon: MonitorPlay, match: /vga|graphic/i, q: 'VGA' },
  { key: 'ssd', label: 'SSD SATA', icon: HardDrive, match: /ssd\s?sata|^ssd$/i, q: 'SSD' },
  { key: 'hdd', label: 'HARD DISK DRIVE (HDD)', icon: Disc3, match: /hard\s?disk|hdd/i, q: 'HDD' },
  { key: 'liquid', label: 'LIQUID COOLING', icon: Droplets, match: /liquid/i, q: 'LIQUID' },
  { key: 'cooler', label: 'CPU COOLER', icon: Fan, match: /cooler/i, q: 'COOLER' },
  { key: 'psu', label: 'POWER SUPPLY', icon: Zap, match: /power\s?supply|psu/i, q: 'POWER SUPPLY' },
  { key: 'case', label: 'CASE', icon: Box, match: /^case|chassis/i, q: 'CASE' },
  { key: 'monitor', label: 'MONITOR', icon: Monitor, match: /monitor/i, q: 'MONITOR' },
  { key: 'mouse', label: 'MOUSE / PAD', icon: Mouse, match: /mouse/i, q: 'MOUSE' },
  { key: 'keyboard', label: 'KEYBOARD / COMBOSET', icon: Keyboard, match: /keyboard/i, q: 'KEYBOARD' },
  { key: 'headset', label: 'HEADSET | EARBUDS', icon: Headphones, match: /headset|earbud/i, q: 'HEADSET' },
  { key: 'speaker', label: 'SPEAKER', icon: Speaker, match: /speaker/i, q: 'SPEAKER' },
]

const NAV: { label: string; to?: string; hash?: string; menu?: boolean }[] = [
  { label: 'ໜ້າຫຼັກ', to: '/dashboard' },
  { label: 'ສິນຄ້າແນະນຳ', to: '/catalog' },
  { label: 'ສິນຄ້າໂປຣໂມຊັ່ນ', to: '/catalog' },
  { label: 'ເຊັດຄອມປະກອບ', to: '/catalog/pc-builder', menu: true },
  { label: 'ການຮັບປະກັນ', hash: 'footer', menu: true },
  { label: 'ປະຫວັດການສັ່ງຊື້', to: '/sales-orders' },
  { label: 'ສາຂາຂອງພວກເຮົາ', hash: 'footer' },
  { label: 'ຕິດຕໍ່ພວກເຮົາ', hash: 'footer' },
  { label: 'ກ່ຽວກັບພວກເຮົາ', hash: 'footer' },
  { label: 'ບົດຄວາມຂ່າວສານ', to: '/catalog' },
]

interface Pick { product: Product; price: number }
type Tab = 'set' | 'spec'
const STORAGE_KEY = 'pc-builder-v1'
const FAV_KEY = 'pc-builder-fav-v1'
const PAGE = 15
const fmt = (n: number) => n.toLocaleString('en-US')

function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T } catch { return fallback }
}

export default function PCBuilderPage() {
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState<Tab>('spec')
  const [active, setActive] = useState(SLOTS[0].key)
  const [search, setSearch] = useState('')
  const [headerSearch, setHeaderSearch] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const [showTop, setShowTop] = useState(false)
  const [picks, setPicks] = useState<Record<string, Pick>>(() => load(STORAGE_KEY, {}))
  const [favs, setFavs] = useState<number[]>(() => load(FAV_KEY, []))

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(picks)) } catch { /* ignore */ } }, [picks])
  useEffect(() => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)) } catch { /* ignore */ } }, [favs])
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const slot = SLOTS.find((s) => s.key === active)!

  // Shared Catalog module: same hooks, same react-query cache as CatalogPage.
  const { flat: cats } = useCategories()
  const categoryId = useMemo(() => cats.find((c) => slot.match.test(c.name_en))?.id, [cats, slot])

  const { products: items, total: totalCount, isLoading, isFetching, error, applyParams } = useCatalog({
    page: 1, page_size: PAGE, is_active: true,
  })

  useEffect(() => {
    applyParams(
      tab === 'set'
        ? { page_size: limit, is_featured: true, category_id: undefined, q: search || undefined }
        : {
            page_size: limit, is_featured: undefined,
            category_id: categoryId,
            q: search || (categoryId ? undefined : slot.q),
          },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, categoryId, slot.q, search, limit])

  const total = Object.values(picks).reduce((s, p) => s + (p.price || 0), 0)
  const count = Object.keys(picks).length

  const selectSlot = (key: string) => { setActive(key); setSearch(''); setLimit(PAGE); setTab('spec') }
  const choose = (p: Product) =>
    setPicks((prev) => ({
      ...prev,
      [active]: { product: p, price: prev[active]?.product.id === p.id ? prev[active].price : 0 },
    }))
  const remove = (key: string) => setPicks((prev) => { const n = { ...prev }; delete n[key]; return n })
  const setPrice = (key: string, price: number) => setPicks((prev) => ({ ...prev, [key]: { ...prev[key], price } }))
  const toggleFav = (id: number) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const submitHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setTab('spec'); setSearch(headerSearch); setLimit(PAGE)
  }

  const copySpec = async () => {
    const lines = SLOTS.filter((s) => picks[s.key]).map((s) => {
      const { product, price } = picks[s.key]
      return `${s.label}: ${product.name_en}${price ? ` — ${fmt(price)} ກີບ` : ''}`
    })
    lines.push(`ລາຄາລວມ: ${fmt(total)} ກີບ`)
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      toast.success('ຄັດລອກສະເປັກແລ້ວ')
    } catch {
      toast.error('ຄັດລອກບໍ່ສຳເລັດ')
    }
  }

  const hasMore = totalCount > items.length
  const title = tab === 'set' ? 'ເຊັດຄອມປະກອບ' : slot.label

  return (
    <div className="pcs">
      {/* ───────── Header ───────── */}
      <header className="pcs-header">
        <div className="pcs-header-top">
          <Link to="/catalog/pc-builder" className="pcs-logo"><span>{STORE.name}</span><small>computer</small></Link>
          <form className="pcs-search" onSubmit={submitHeaderSearch}>
            <input value={headerSearch} onChange={(e) => setHeaderSearch(e.target.value)} placeholder="ຄົ້ນຫາໃນຄອມຄອມ..." />
            <button type="submit" aria-label="search"><Search size={18} /></button>
          </form>
          <div className="pcs-header-icons">
            <button type="button" aria-label="favorites" className="pcs-icon-btn"><Heart size={24} />{favs.length > 0 && <b>{favs.length}</b>}</button>
            <button type="button" aria-label="cart" className="pcs-icon-btn" onClick={copySpec}><ShoppingCart size={24} />{count > 0 && <b>{count}</b>}</button>
            <span className="pcs-lang" title="Lao">🇱🇦 <ChevronDown size={14} /></span>
            <Link to="/profile" className="pcs-user"><UserIcon size={26} /> {user?.full_name || user?.username || 'user'} <ChevronDown size={14} /></Link>
          </div>
        </div>
        <nav className="pcs-nav">
          {NAV.map((n) => {
            const inner = <>{n.label}{n.menu && <ChevronDown size={14} />}</>
            return n.to
              ? <Link key={n.label} to={n.to}>{inner}</Link>
              : <a key={n.label} href={`#${n.hash}`}>{inner}</a>
          })}
        </nav>
      </header>

      <main className="pcs-container">
        <div className="pcs-breadcrumb">
          <Link to="/dashboard">ໜ້າຫຼັກ</Link><ChevronRight size={16} /><span>ຈັດສະເປັກຄອມ</span>
        </div>

        <div className="pcs-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'set'} className={tab === 'set' ? 'on' : ''} onClick={() => { setTab('set'); setSearch(''); setLimit(PAGE) }}>ເຊັດຄອມປະກອບ</button>
          <button role="tab" aria-selected={tab === 'spec'} className={tab === 'spec' ? 'on' : ''} onClick={() => setTab('spec')}>ຈັດສະເປັກຄອມ</button>
        </div>

        <div className="pcs-layout">
          {/* ───────── Sidebar ───────── */}
          <aside className="pcs-side">
            <h2>ລາຍການຈັດສະເປັກຄອມ</h2>
            <div className="pcs-sum">ລາຄາລວມ: <strong>{fmt(total)} <em>ກີບ</em></strong></div>
            {SLOTS.map((s) => {
              const pick = picks[s.key]
              const Icon = s.icon
              return (
                <div key={s.key} className={`pcs-slot${tab === 'spec' && active === s.key ? ' on' : ''}`}>
                  <button type="button" onClick={() => selectSlot(s.key)}>
                    <span className="pcs-slot-ico"><Icon size={28} /></span>
                    <span className="pcs-slot-name">{s.label}</span>
                    {pick && <Check size={16} className="pcs-ok" />}
                  </button>
                  {pick && (
                    <div className="pcs-slot-pick">
                      <span title={pick.product.name_en}>{pick.product.name_en}</span>
                      <input type="number" min={0} placeholder="ລາຄາ" value={pick.price || ''}
                        onChange={(e) => setPrice(s.key, Number(e.target.value) || 0)} />
                      <button type="button" aria-label="remove" onClick={() => remove(s.key)}><X size={14} /></button>
                    </div>
                  )}
                </div>
              )
            })}
            <button type="button" className="pcs-build" disabled={!count} onClick={copySpec}>
              <Copy size={16} /> ສ້າງສະເປັກຄອມພິວເຕີ
            </button>
            <p className="pcs-note">ຈະມີຄ່າຈັດສະເປັກຄອມເພີ່ມ ມູນຄ່າ 300 ບາດ ທີ່ບໍ່ລວມໃນບິນ</p>
          </aside>

          {/* ───────── Product list ───────── */}
          <section className="pcs-main">
            <h2>{title}</h2>
            <p className="pcs-count">{totalCount} ລາຍການ</p>
            {isLoading && <p className="pcs-empty">ກຳລັງໂຫຼດ...</p>}
            {error && <p className="pcs-empty">{error}</p>}
            {!isLoading && !error && items.length === 0 && <p className="pcs-empty">ບໍ່ພົບສິນຄ້າໃນໝວດນີ້</p>}

            <div className="pcs-grid">
              {items.map((p) => {
                const selected = tab === 'spec' && picks[active]?.product.id === p.id
                const fav = favs.includes(p.id)
                return (
                  <article key={p.id} className={`pcs-card${selected ? ' sel' : ''}`}>
                    <button type="button" className={`pcs-fav${fav ? ' on' : ''}`} aria-label="favorite" onClick={() => toggleFav(p.id)}>
                      <Heart size={20} fill={fav ? 'currentColor' : 'none'} />
                    </button>
                    <div className="pcs-img">
                      {p.primary_image_url
                        ? <img src={resolveMediaUrl(p.primary_image_url)} alt={p.name_en} loading="lazy" />
                        : <Cpu size={56} />}
                      {tab === 'spec' && (
                        <button type="button" className="pcs-pick" onClick={() => (selected ? remove(active) : choose(p))}>
                          <ShoppingCart size={16} /> {selected ? 'ເລືອກແລ້ວ' : 'ເລືອກ'}
                        </button>
                      )}
                    </div>
                    <Link to={`/catalog/products/${p.id}`} className="pcs-name" title={p.name_en}>{p.name_en}</Link>
                    <p className="pcs-spec">{[p.brand?.name, p.model_number, p.sku].filter(Boolean).join(' / ')}</p>
                    <p className="pcs-price">ສອບຖາມລາຄາ</p>
                  </article>
                )
              })}
            </div>

            {hasMore && (
              <button type="button" className="pcs-more" disabled={isFetching} onClick={() => setLimit((l) => l + PAGE)}>
                ເບິ່ງເພີ່ມເຕີມ <ChevronDown size={16} />
              </button>
            )}
          </section>
        </div>
      </main>

      {/* ───────── Footer ───────── */}
      <footer id="footer" className="pcs-footer">
        <div className="pcs-container pcs-footer-grid">
          <div>
            <h4>ຊ່ວຍເຫຼືອ</h4>
            <Link to="/catalog">ເງື່ອນໄຂການຮັບປະກັນສິນຄ້າ</Link>
            <Link to="/sales-orders">ປະຫວັດການສັ່ງຊື້</Link>
            <Link to="/catalog">ລາຍການສິນຄ້າທີ່ຖືກໃຈ</Link>
          </div>
          <div>
            <h4>ສາຂາ</h4>
            {STORE.branches.length === 0 && <span className="pcs-dim">—</span>}
            {STORE.branches.map((b) => <p key={b.name}>{b.name}<br />{b.phone}</p>)}
          </div>
          <div>
            <h4>ຂໍ້ມູນຕິດຕໍ່</h4>
            {STORE.whatsapp && <p>WhatsApp {STORE.whatsapp}</p>}
            {STORE.email && <p>{STORE.email}</p>}
            {!STORE.whatsapp && !STORE.email && <span className="pcs-dim">—</span>}
          </div>
          <div>
            <h4>ຮອງຮັບການຊຳລະເງິນ</h4>
            <h4>ຮອງຮັບການຂົນສົ່ງ</h4>
          </div>
        </div>
      </footer>

      {/* ───────── Floating buttons ───────── */}
      {showTop && (
        <button type="button" className="pcs-top" aria-label="top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp size={28} />
        </button>
      )}
      {STORE.whatsapp && (
        <a className="pcs-wa" aria-label="WhatsApp" href={`https://wa.me/${STORE.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
          <MessageCircle size={34} />
        </a>
      )}
    </div>
  )
}
