import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  Activity, ArrowDownRight, ArrowRight, Bell, Boxes, BriefcaseBusiness,
  Building2, CalendarDays, Check, ChevronDown, ChevronRight, CircleDollarSign,
  ClipboardList, CreditCard, FileCheck2, FileText, Forklift, Gauge,
  LayoutDashboard, LifeBuoy, LogOut, Menu, Package, PackageCheck, PackageMinus,
  Radio, Receipt, Search, Settings, TrendingDown,
  TrendingUp, Truck, Users, Warehouse, Wrench, X, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

interface DashboardNavItem {
  labelLo: string
  labelEn: string
  to: string
  icon: LucideIcon
}

interface DashboardNavGroup {
  id: string
  labelLo: string
  labelEn: string
  icon: LucideIcon
  items: DashboardNavItem[]
}

type Locale = 'lo' | 'en'

const NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: 'overview', labelLo: 'ໜ້າປັດຈະຕະການ', labelEn: 'Dashboard', icon: LayoutDashboard,
    items: [{ labelLo: 'ພາບລວມການດຳເນີນງານ', labelEn: 'Operations overview', to: '/dashboard', icon: Activity }],
  },
  {
    id: 'crm', labelLo: 'CRM', labelEn: 'CRM', icon: Users,
    items: [
      { labelLo: 'ຂໍ້ມູນລູກຄ້າ', labelEn: 'Customers', to: '/customers', icon: Users },
      { labelLo: 'ລາຍການຂາຍ', labelEn: 'Sales leads', to: '/leads', icon: TrendingUp },
    ],
  },
  {
    id: 'sales', labelLo: 'ການຂາຍ', labelEn: 'Sales', icon: FileText,
    items: [
      { labelLo: 'ໃບສະເໜີລາຄາ', labelEn: 'Quotations', to: '/quotations', icon: FileText },
      { labelLo: 'ໃບສົ່ງສິນຄ້າ', labelEn: 'Delivery notes', to: '/inventory/delivery-notes', icon: PackageCheck },
      { labelLo: 'ໃບສັ່ງຂາຍ', labelEn: 'Sales orders', to: '/sales-orders', icon: FileCheck2 },
    ],
  },
  {
    id: 'purchasing', labelLo: 'ການຈັດຊື້', labelEn: 'Purchasing', icon: ClipboardList,
    items: [
      { labelLo: 'ໃບສັ່ງຊື້', labelEn: 'Purchase orders', to: '/inventory/purchase-orders', icon: ClipboardList },
      { labelLo: 'ໃບຮັບເຄື່ອງ', labelEn: 'Goods received', to: '/inventory/goods-receive', icon: PackageCheck },
    ],
  },
  {
    id: 'assets', labelLo: 'ຊັບສິນອຸປະກອນ', labelEn: 'Equipment assets', icon: Truck,
    items: [
      { labelLo: 'ສະຖິຕິຊັບສິນ', labelEn: 'Equipment registry', to: '/equipment', icon: Boxes },
      { labelLo: 'ການເຄື່ອນຍ້າຍສິນຄ້າ', labelEn: 'Asset movements', to: '/movements', icon: ArrowDownRight },
    ],
  },
  {
    id: 'rental', labelLo: 'ການດຳເນີນການເຊົ່າ', labelEn: 'Rental operations', icon: BriefcaseBusiness,
    items: [{ labelLo: 'ສັນຍາບໍລິການ', labelEn: 'Rental contracts', to: '/rental-contracts', icon: FileCheck2 }],
  },
  {
    id: 'service-inventory', labelLo: 'ບໍລິການ ແລະ ການບໍລິຫານ', labelEn: 'Service & inventory', icon: Wrench,
    items: [
      { labelLo: 'ບໍລິການ ແລະ ການບໍລິຫານ', labelEn: 'Maintenance', to: '/maintenance', icon: Wrench },
      { labelLo: 'ຄຸ້ມຄອງສາງສິນຄ້າ', labelEn: 'Inventory control', to: '/inventory', icon: Warehouse },
      { labelLo: 'ລາຍການອາໄຫຼ່', labelEn: 'Spare parts', to: '/inventory/parts', icon: Package },
      { labelLo: 'ໃບເບີກສິນຄ້າ', labelEn: 'Goods issue', to: '/inventory/goods-issue', icon: PackageMinus },
      { labelLo: 'ລາຍການສິນຄ້າ', labelEn: 'Product catalog', to: '/catalog', icon: Boxes },
    ],
  },
  {
    id: 'projects', labelLo: 'ຈັດສັນໂຄງການ', labelEn: 'Projects', icon: Building2,
    items: [{ labelLo: 'ໂຄງການຄັງສິນຄ້າ', labelEn: 'Warehouse projects', to: '/projects', icon: Warehouse }],
  },
  {
    id: 'finance', labelLo: 'ການເງິນ ແລະ ບັນຊີ', labelEn: 'Finance & accounting', icon: CircleDollarSign,
    items: [
      { labelLo: 'ພາບລວມການເງິນ', labelEn: 'Billing overview', to: '/billing', icon: CircleDollarSign },
      { labelLo: 'ໃບແຈ້ງໜີ້', labelEn: 'Invoices', to: '/billing/invoices', icon: FileText },
      { labelLo: 'ໃບກຳກັບພາສີ', labelEn: 'Tax invoices', to: '/billing/tax-invoices', icon: Receipt },
      { labelLo: 'ໃບທວງໜີ້', labelEn: 'Credit notes', to: '/billing/credit-notes', icon: FileCheck2 },
      { labelLo: 'ການຈ່າຍເງິນ', labelEn: 'Payments', to: '/billing/payments', icon: CreditCard },
      { labelLo: 'ໃບຮັບເງິນ', labelEn: 'Receipts', to: '/billing/receipts', icon: Receipt },
      { labelLo: 'ໃບຈ່າຍເງິນ', labelEn: 'Payment vouchers', to: '/billing/payment-vouchers', icon: CreditCard },
      { labelLo: 'ເງິນມັດຈຳ', labelEn: 'Deposits', to: '/billing/deposits', icon: CircleDollarSign },
      { labelLo: 'ໃບລາຍງານຍອດບັນຊີ', labelEn: 'Statements', to: '/billing/statements', icon: FileText },
    ],
  },
  {
    id: 'reports', labelLo: 'ລາຍງານດ້ານການຄຸ້ມຄອງ', labelEn: 'Management reports', icon: Activity,
    items: [
      { labelLo: 'ກິດຈະກຳ', labelEn: 'Activity', to: '/activities', icon: Activity },
      { labelLo: 'ລາຍງານ', labelEn: 'Reports', to: '/reports', icon: TrendingUp },
      { labelLo: 'ລະບົບ IoT', labelEn: 'IoT system', to: '/iot-management', icon: Radio },
    ],
  },
]

const MAINTENANCE_DATA = [
  { month: 'ມ.ກ.', cost: 28 }, { month: 'ກ.ພ.', cost: 34 },
  { month: 'ມ.ນ.', cost: 30 }, { month: 'ມ.ສ.', cost: 42 },
  { month: 'ພ.ພ.', cost: 36 }, { month: 'ມ.ຖ.', cost: 48 },
]

const FLEET_MIX = [
  { name: 'EP Li-Ion', value: 58, color: '#34d399' },
  { name: 'Heavy Diesel', value: 30, color: '#38bdf8' },
  { name: 'Reach Truck', value: 12, color: '#fb923c' },
]

const TOOLTIP_STYLE = {
  backgroundColor: '#111827',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: 10,
  color: '#e2e8f0',
  fontSize: 12,
}

function DashboardCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-slate-700/60 bg-slate-800/75 shadow-[0_16px_48px_rgba(0,0,0,0.18)] backdrop-blur-xl ${className}`}>
      {children}
    </section>
  )
}

function useText(locale: Locale) {
  return (lao: string, english: string) => locale === 'lo' ? lao : english
}

export default function DKServiceOperationsDashboard() {
  const [locale, setLocale] = useState<Locale>('lo')
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['overview'])
  const [search, setSearch] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const text = useText(locale)

  const filteredGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => `${item.labelLo} ${item.labelEn}`.toLowerCase().includes(search.toLowerCase())),
  })).filter((group) => group.items.length > 0)

  const toggleGroup = (id: string) => {
    setExpandedGroups((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  }

  const sidebar = (
    <aside className="flex h-full min-h-0 flex-col border-r border-slate-700/60 bg-[#0b101a]/95 text-slate-300 backdrop-blur-xl">
      <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-slate-700/50 px-5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
          <Forklift size={23} strokeWidth={1.8} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0b101a] bg-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">DK Service Lao</p>
          <p className="text-[10px] font-medium text-slate-500">FLEET OPERATIONS</p>
        </div>
        <button type="button" onClick={() => setMobileNavOpen(false)} aria-label={text('ປິດເມນູ', 'Close menu')} className="ml-auto rounded-md p-2 text-slate-400 hover:bg-slate-800 lg:hidden">
          <X size={17} />
        </button>
      </div>

      <div className="px-3 pb-2 pt-4">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase text-slate-600">{text('ເມນູຫຼັກ', 'WORKSPACE')}</p>
        <label className="flex h-9 items-center gap-2 rounded-md border border-slate-700/70 bg-slate-900/80 px-2.5 text-slate-500 focus-within:border-cyan-400/50">
          <Search size={14} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={text('ຄົ້ນຫາເມນູ', 'Find a module')} aria-label={text('ຄົ້ນຫາເມນູ', 'Find a module')} className="w-full min-w-0 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600" />
          {search && <button type="button" aria-label={text('ລ້າງຄຳຄົ້ນຫາ', 'Clear search')} onClick={() => setSearch('')}><X size={13} /></button>}
        </label>
      </div>

      <nav aria-label={text('ເມນູຫຼັກ', 'Main navigation')} className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-1 [scrollbar-color:#334155_transparent] [scrollbar-width:thin]">
        {filteredGroups.map((group) => {
          const GroupIcon = group.icon
          const expanded = search ? true : expandedGroups.includes(group.id)
          return (
            <div key={group.id}>
              <button type="button" onClick={() => toggleGroup(group.id)} aria-expanded={expanded} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[11px] font-semibold text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-slate-100">
                <GroupIcon size={14} className="shrink-0 text-slate-500" />
                <span className="min-w-0 flex-1 truncate">{locale === 'lo' ? group.labelLo : group.labelEn}</span>
                {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
              {expanded && <div className="ml-[18px] space-y-0.5 border-l border-slate-700/70 py-1 pl-2">
                {group.items.map((item) => {
                  const ItemIcon = item.icon
                  const active = item.to === '/dashboard'
                  return (
                    <Link key={item.to} to={item.to} onClick={() => setMobileNavOpen(false)} aria-current={active ? 'page' : undefined} className={`relative flex min-h-9 items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] transition-colors ${active ? 'bg-cyan-400/10 font-semibold text-cyan-200' : 'text-slate-400 hover:bg-slate-800/75 hover:text-white'}`}>
                      {active && <span className="absolute -left-[9px] top-1.5 bottom-1.5 w-0.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.85)]" />}
                      <ItemIcon size={14} className={active ? 'shrink-0 text-cyan-300' : 'shrink-0 text-slate-500'} />
                      <span className="min-w-0 flex-1 truncate">{locale === 'lo' ? item.labelLo : item.labelEn}</span>
                      {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />}
                    </Link>
                  )
                })}
              </div>}
            </div>
          )
        })}
        {filteredGroups.length === 0 && <p className="px-3 py-6 text-center text-xs text-slate-500">{text('ບໍ່ພົບເມນູ', 'No modules found')}</p>}
      </nav>

      <div className="shrink-0 border-t border-slate-700/60 p-3">
        <Link to="/settings" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
          <Settings size={15} />{text('ຕັ້ງຄ່າ', 'Settings')}
        </Link>
        <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} className="mt-1 flex w-full items-center gap-2.5 rounded-md border-t border-slate-700/50 px-2.5 pt-3 text-left">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-[10px] font-bold text-cyan-200">SA</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-white">System Admin</span><span className="block text-[10px] text-slate-500">{text('ຜູ້ດູແລລະບົບ', 'System administrator')}</span></span>
          <ChevronDown size={14} className="text-slate-500" />
        </button>
        {profileOpen && <div className="mt-2 rounded-md border border-slate-700 bg-slate-900 p-1">
          <Link to="/profile" className="flex items-center gap-2 rounded px-2 py-2 text-xs text-slate-300 hover:bg-slate-800"><Users size={14} />{text('ໂປຣໄຟລ໌', 'Profile')}</Link>
          <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs text-slate-300 hover:bg-slate-800"><LogOut size={14} />{text('ອອກຈາກລະບົບ', 'Sign out')}</button>
        </div>}
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#0b0f19] font-sans text-slate-100 selection:bg-cyan-300/20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-28 h-80 w-80 rounded-full bg-cyan-500/[0.045] blur-[100px]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-500/[0.035] blur-[110px]" />
      </div>

      <div className="relative flex min-h-screen">
        <div className="hidden h-screen w-[264px] shrink-0 lg:sticky lg:top-0 lg:block">{sidebar}</div>
        {mobileNavOpen && <div className="fixed inset-0 z-[100] lg:hidden">
          <button type="button" onClick={() => setMobileNavOpen(false)} aria-label={text('ປິດເມນູ', 'Close menu')} className="absolute inset-0 bg-black/65" />
          <div className="relative h-full w-[min(88vw,300px)] shadow-2xl">{sidebar}</div>
        </div>}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-[72px] items-center gap-3 border-b border-slate-700/50 bg-[#0b0f19]/85 px-4 backdrop-blur-xl sm:px-6 xl:px-8">
            <button type="button" onClick={() => setMobileNavOpen(true)} aria-label={text('ເປີດເມນູ', 'Open menu')} className="rounded-md border border-slate-700/70 p-2 text-slate-300 hover:bg-slate-800 lg:hidden"><Menu size={17} /></button>
            <div className="hidden min-w-0 items-center gap-2 text-xs text-slate-500 sm:flex"><span>DK Service</span><ChevronRight size={13} /><span className="text-slate-200">{text('ພາບລວມການດຳເນີນງານ', 'Operations overview')}</span></div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <label className="hidden h-9 w-52 items-center gap-2 rounded-md border border-slate-700/70 bg-slate-900/75 px-3 text-slate-500 focus-within:border-cyan-400/50 md:flex xl:w-64">
                <Search size={14} />
                <input placeholder={text('ຄົ້ນຫາ...', 'Search...')} aria-label={text('ຄົ້ນຫາ', 'Search')} className="min-w-0 flex-1 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600" />
                <kbd className="rounded border border-slate-700 px-1 text-[9px] text-slate-500">/</kbd>
              </label>
              <div className="flex h-9 items-center rounded-md border border-slate-700/70 bg-slate-900/70 p-0.5" aria-label={text('ເລືອກພາສາ', 'Choose language')}>
                <button type="button" onClick={() => setLocale('lo')} aria-pressed={locale === 'lo'} className={`h-7 rounded px-2 text-[10px] font-semibold ${locale === 'lo' ? 'bg-cyan-300/15 text-cyan-200' : 'text-slate-500 hover:text-white'}`}>ລາວ</button>
                <button type="button" onClick={() => setLocale('en')} aria-pressed={locale === 'en'} className={`h-7 rounded px-2 text-[10px] font-semibold ${locale === 'en' ? 'bg-cyan-300/15 text-cyan-200' : 'text-slate-500 hover:text-white'}`}>EN</button>
              </div>
              <div className="relative">
                <button type="button" onClick={() => setNotificationsOpen((open) => !open)} aria-label={text('ການແຈ້ງເຕືອນ', 'Notifications')} aria-expanded={notificationsOpen} className="relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-slate-600 hover:text-white">
                  <Bell size={16} /><span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.7)]"><span className="absolute inset-0 animate-ping rounded-full bg-rose-400 opacity-50" /></span>
                </button>
                {notificationsOpen && <div className="absolute right-0 top-11 w-64 rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-2xl"><p className="text-xs font-semibold text-white">{text('ການແຈ້ງເຕືອນ', 'Notifications')}</p><p className="mt-2 text-xs leading-5 text-slate-400">{text('ມີການກວດສອບ PM ທີ່ຈະມາຮອດ 3 ລາຍການ', '3 preventive maintenance checks are due soon')}</p></div>}
              </div>
              <button type="button" onClick={() => setProfileOpen((open) => !open)} className="hidden h-9 items-center gap-2 rounded-md border border-slate-700/70 bg-slate-900/70 px-2.5 sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/15 text-[9px] font-bold text-cyan-200">SA</span><span className="max-w-24 truncate text-[11px] font-medium text-slate-200">System Admin</span><ChevronDown size={13} className="text-slate-500" />
              </button>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1560px] px-4 pb-10 pt-6 sm:px-6 xl:px-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" /><span className="text-[10px] font-semibold uppercase text-emerald-300">{text('ສູນຄວບຄຸມກອງລົດ', 'FLEET CONTROL CENTER')}</span></div>
                <h1 className="text-xl font-semibold text-white sm:text-2xl">{text('ພາບລວມການດຳເນີນງານ', 'Operations overview')}</h1>
                <p className="mt-1 text-xs text-slate-500">{text('ສະຖານະການໃຊ້ງານ ແລະ ການບຳລຸງຮັກສາກອງລົດ', 'Fleet availability and maintenance performance')}</p>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-[10px] text-slate-400"><CalendarDays size={13} className="text-cyan-300" />{text('ຂໍ້ມູນຕົວຢ່າງ', 'SAMPLE DATA')}<span className="text-slate-600">·</span>11 ຕ.ລ. 2026</div>
            </div>

            <section aria-label={text('ສະຫຼຸບຕົວຊີ້ວັດ', 'Key performance indicators')} className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <DashboardCard className="relative overflow-hidden p-4 transition-colors hover:border-emerald-400/30">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-400/[0.07] blur-2xl" />
                <div className="relative flex items-start justify-between gap-3"><div><p className="text-xs text-slate-400">{text('ຈຳນວນລົດໃນກອງ', 'Fleet total')}</p><p className="mt-3 text-2xl font-semibold text-white">24 <span className="text-sm font-normal text-slate-400">{text('ຄັນ', 'units')}</span></p></div><div className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><Forklift size={19} /></div></div>
                <div className="relative mt-4 flex items-center gap-2 border-t border-slate-700/50 pt-3 text-[10px] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{text('ພ້ອມໃຊ້ງານ', 'Ready for operation')}<span className="ml-auto text-slate-500">20 / 24</span></div>
              </DashboardCard>

              <DashboardCard className="relative overflow-hidden p-4 transition-colors hover:border-cyan-300/30">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-400/[0.08] blur-2xl" />
                <div className="relative flex items-start justify-between gap-3"><div><p className="text-xs text-slate-400">{text('ຄວາມພ້ອມໃຊ້ງານ (UPTIME)', 'Availability (UPTIME)')}</p><p className="mt-3 text-2xl font-semibold text-white">99.2<span className="text-sm text-slate-400">%</span></p></div><div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Activity size={19} /></div></div>
                <div className="relative mt-2 h-8"><svg viewBox="0 0 220 38" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={text('ເສັ້ນສະແດງ Uptime', 'Uptime sparkline')}><defs><linearGradient id="uptimePulse" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity=".28" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" /></linearGradient></defs><path d="M0 30 C18 29 18 17 35 20 S54 29 69 17 S89 22 105 13 S125 19 140 10 S161 19 178 7 S201 13 220 4 V38 H0Z" fill="url(#uptimePulse)" /><path d="M0 30 C18 29 18 17 35 20 S54 29 69 17 S89 22 105 13 S125 19 140 10 S161 19 178 7 S201 13 220 4" fill="none" stroke="#67e8f9" strokeWidth="2" /></svg></div>
                <div className="relative mt-2 flex items-center gap-2 border-t border-slate-700/50 pt-3 text-[10px] text-cyan-200"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />{text('ຜ່ານເກນ SLA', 'Within SLA target')}<span className="ml-auto text-slate-500">+0.4%</span></div>
              </DashboardCard>

              <DashboardCard className="relative overflow-hidden p-4 transition-colors hover:border-amber-300/30">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-400/[0.07] blur-2xl" />
                <div className="relative flex items-start justify-between gap-3"><div><p className="text-xs text-slate-400">{text('ແຜນບຳລຸງ PM 30 ຈຸດ', '30-point PM plan')}</p><p className="mt-3 text-2xl font-semibold text-white">18 <span className="text-sm font-normal text-slate-400">{text('ຮອບ', 'cycles')}</span></p></div><div className="flex h-10 w-10 items-center justify-center rounded-md border border-amber-300/20 bg-amber-300/10 text-amber-200"><Wrench size={19} /></div></div>
                <div className="relative mt-4 flex items-center gap-2 border-t border-slate-700/50 pt-3 text-[10px] text-amber-200"><span className="h-1.5 w-1.5 rounded-full bg-amber-300" />{text('ສຳເລັດ 60%', '60% completed')}<span className="ml-auto h-1 w-16 overflow-hidden rounded-full bg-slate-700"><span className="block h-full w-3/5 rounded-full bg-amber-300" /></span></div>
              </DashboardCard>

              <DashboardCard className="relative overflow-hidden p-4 transition-colors hover:border-pink-300/30">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-pink-400/[0.08] blur-2xl" />
                <div className="relative flex items-start justify-between gap-3"><div><p className="text-xs text-slate-400">{text('ຕົ້ນທຶນພະລັງງານ', 'Energy cost')}</p><p className="mt-3 text-2xl font-semibold text-white">₭ 45.2<span className="text-sm font-normal text-slate-400">M</span></p></div><div className="flex h-10 w-10 items-center justify-center rounded-md border border-pink-300/20 bg-pink-300/10 text-pink-200"><Zap size={19} /></div></div>
                <div className="relative mt-4 flex items-center gap-2 border-t border-slate-700/50 pt-3 text-[10px] text-emerald-300"><TrendingDown size={13} />{text('ຫຼຸດລົງ 5%', 'Down 5%')}<span className="ml-auto flex h-5 w-12 items-center justify-center rounded-full border border-pink-300/15 bg-pink-300/[0.07]"><span className="h-2 w-2 rounded-full bg-pink-300 shadow-[0_0_8px_rgba(249,168,212,0.7)]" /><span className="ml-1 h-1 w-4 rounded-full bg-pink-300/50" /></span></div>
              </DashboardCard>
            </section>

            <section aria-label={text('ກຣາຟວິເຄາະ', 'Analytics charts')} className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1.55fr)_minmax(380px,1fr)]">
              <DashboardCard className="min-w-0 p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div><h2 className="text-sm font-semibold text-slate-100">{text('ແນວໂນ້ມຄ່າບຳລຸງຮັກສາ (6 ເດືອນ)', 'Maintenance cost trend (6 months)')}</h2><p className="mt-1 text-[10px] text-slate-500">{text('ໜ່ວຍ: ລ້ານກີບ', 'Unit: million LAK')}</p></div>
                  <span className="inline-flex items-center gap-1.5 rounded border border-cyan-300/15 bg-cyan-300/[0.06] px-2 py-1 text-[9px] font-medium text-cyan-200"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />{text('ຂໍ້ມູນຕົວຢ່າງ', 'SAMPLE')}</span>
                </div>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MAINTENANCE_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <defs><linearGradient id="maintenanceGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity={0.38} /><stop offset="60%" stopColor="#22d3ee" stopOpacity={0.13} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid stroke="rgba(148,163,184,0.10)" strokeDasharray="3 5" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} dy={8} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${value}M`} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`₭ ${Number(value).toFixed(1)}M`, text('ຄ່າບຳລຸງ', 'Maintenance cost')]} />
                      <Area type="monotone" dataKey="cost" stroke="#5eead4" strokeWidth={2.5} fill="url(#maintenanceGradient)" activeDot={{ r: 5, fill: '#99f6e4', stroke: '#0f172a', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/50 pt-3 text-[10px] text-slate-500"><span>{text('ງົບປະມານສະເລ່ຍ', 'Average spend')}: <strong className="font-semibold text-slate-300">₭ 36.3M</strong></span><span className="flex items-center gap-1 text-emerald-300"><TrendingUp size={12} />{text('ທຽບກັບ 6 ເດືອນກ່ອນ', 'Compared to prior 6 months')}</span></div>
              </DashboardCard>

              <DashboardCard className="min-w-0 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-semibold text-slate-100">{text('ສັດສ່ວນປະເພດລົດໃນກອງ', 'Fleet composition')}</h2><p className="mt-1 text-[10px] text-slate-500">{text('ຈຳນວນຕາມປະເພດອຸປະກອນ', 'Units by equipment type')}</p></div><button type="button" aria-label={text('ເບິ່ງລາຍລະອຽດ', 'View details')} className="rounded-md border border-slate-700/70 p-1.5 text-slate-500 hover:text-white"><ArrowRight size={14} /></button></div>
                <div className="relative mx-auto mt-1 h-[204px] max-w-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={FLEET_MIX} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="68%" outerRadius="88%" paddingAngle={3} stroke="none" cornerRadius={5}>
                        {FLEET_MIX.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}%`, text('ສັດສ່ວນ', 'Share')]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-semibold text-white">58%</span><span className="mt-0.5 text-[9px] uppercase text-slate-500">EP Li-Ion</span></div>
                </div>
                <div className="space-y-2 border-t border-slate-700/50 pt-3">
                  {FLEET_MIX.map((entry) => <div key={entry.name} className="flex items-center gap-2 text-[11px]"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} /><span className="flex-1 text-slate-400">{entry.name}</span><span className="font-semibold text-slate-200">{entry.value}%</span></div>)}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-2 text-[10px] text-emerald-200"><Zap size={13} />{text('Class A ປອດການປ່ອຍອາຍພິດ', 'Class A Zero-Emission')}<span className="ml-auto text-emerald-300/70">58%</span></div>
              </DashboardCard>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <DashboardCard className="p-4 lg:col-span-2">
                <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-sm font-semibold text-slate-100">{text('ຕາຕະລາງບຳລຸງຮັກສາທີ່ຈະມາເຖິງ', 'Upcoming maintenance')}</h2><p className="mt-1 text-[10px] text-slate-500">{text('ລາຍການ 7 ມື້ຂ້າງໜ້າ', 'Due in the next 7 days')}</p></div><Link to="/maintenance/schedules" className="flex items-center gap-1 text-[10px] font-medium text-cyan-200 hover:text-cyan-100">{text('ເບິ່ງທັງໝົດ', 'View schedule')}<ArrowRight size={12} /></Link></div>
                <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] gap-x-3 border-y border-slate-700/60 py-2 text-[9px] font-medium text-slate-500"><span>{text('ຊັບສິນ', 'ASSET')}</span><span>{text('ກຳນົດການ', 'SCHEDULE')}</span><span>{text('ສະຖານະ', 'STATUS')}</span></div>
                {[
                  ['MFT-FD25N · FL-024', text('ປ່ຽນນ້ຳມັນເຄື່ອງ', 'Engine oil service'), text('ມື້ນີ້', 'Today'), 'amber'],
                  ['TYT-8FD25 · FL-018', text('ກວດລະບົບໄຮໂດຣລິກ', 'Hydraulic inspection'), text('ມື້ອື່ນ', 'Tomorrow'), 'cyan'],
                  ['HELI-CPCD25 · FL-011', text('ກວດສອບແບັດເຕີຣີ', 'Battery inspection'), text('14 ຕ.ລ.', 'Oct 14'), 'green'],
                ].map(([asset, task, due, status]) => <div key={asset} className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-slate-700/40 py-3 last:border-0"><div className="min-w-0"><p className="truncate text-[10px] font-medium text-slate-200">{asset}</p><p className="mt-0.5 truncate text-[9px] text-slate-500">{task}</p></div><span className="text-[10px] text-slate-400">{due}</span><span className={`rounded border px-1.5 py-1 text-[9px] ${status === 'amber' ? 'border-amber-300/20 bg-amber-300/[0.07] text-amber-200' : status === 'cyan' ? 'border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200' : 'border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200'}`}>{status === 'amber' ? text('ລໍຖ້າ', 'Due') : status === 'cyan' ? text('ກຳນົດແລ້ວ', 'Scheduled') : text('ຕາມແຜນ', 'On track')}</span></div>)}
              </DashboardCard>
              <DashboardCard className="relative overflow-hidden p-4">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/[0.06] blur-3xl" />
                <div className="relative flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Gauge size={16} /></div><div><h2 className="text-xs font-semibold text-slate-100">{text('ສະຖານະລະບົບ', 'System health')}</h2><p className="text-[9px] text-slate-500">{text('ການເຊື່ອມຕໍ່ບໍລິການ', 'Service connectivity')}</p></div></div>
                <div className="relative mt-5 flex items-end justify-between"><div><p className="text-2xl font-semibold text-white">98.7<span className="text-sm text-slate-400">%</span></p><p className="mt-1 flex items-center gap-1 text-[9px] text-emerald-300"><Check size={11} />{text('ທຸກລະບົບປົກກະຕິ', 'All systems operational')}</p></div><div className="flex h-9 items-end gap-1">{[38, 56, 42, 72, 55, 86, 64, 76, 50, 95].map((height, index) => <span key={index} className="w-1.5 rounded-t bg-cyan-300/60" style={{ height: `${height}%` }} />)}</div></div>
                <div className="relative mt-4 space-y-2 border-t border-slate-700/50 pt-3 text-[9px]"><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{text('API ບໍລິການ', 'Service API')}</span><span className="text-emerald-300">99.9%</span></div><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{text('ຖານຂໍ້ມູນ', 'Database')}</span><span className="text-emerald-300">99.8%</span></div></div>
              </DashboardCard>
            </section>

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4 text-[9px] text-slate-600"><span>DK SERVICE · FLEET OPERATIONS</span><span className="flex items-center gap-1.5"><LifeBuoy size={11} />{text('ສູນຊ່ວຍເຫຼືອ', 'Support center')}<span className="mx-1">·</span><span className="text-emerald-400">{text('ອອນລາຍ', 'Online')}</span></span></footer>
          </main>
        </div>
      </div>
    </div>
  )
}
