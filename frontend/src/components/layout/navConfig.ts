import {
  LayoutDashboard, Users, TrendingUp, Activity, BarChart2,
  Package, Truck, FileText, ClipboardList, ArrowRightLeft, Wrench, Radio,
  Box, Receipt, CreditCard, Landmark, FileSpreadsheet, Warehouse, ShoppingCart,
  FileCheck2, ReceiptText, Undo2, Banknote, FileOutput, PackageCheck, PackageMinus,
  BadgeCheck, LayoutGrid, CheckSquare, PhoneIncoming,
} from 'lucide-react'

export interface NavItem {
  to: string
  labelKey: string
  icon: React.ElementType
  adminOnly?: boolean
}

export interface NavGroup {
  id: string
  labelKey: string
  items: NavItem[]
}

// Module architecture: one group per business module, ordered the way work flows
// (customer -> sale -> asset -> rental -> service -> parts -> project -> money -> reports).
// Customer-facing pages (store, 4S services, client portal) live in the separate website, not here.
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    labelKey: 'nav.groups.dashboard',
    items: [
      { to: '/dashboard', labelKey: 'nav.items.overview', icon: LayoutDashboard },
    ],
  },
  {
    id: 'crm',
    labelKey: 'nav.groups.crm',
    items: [
      { to: '/intake', labelKey: 'nav.items.intake', icon: PhoneIncoming },
      { to: '/customers', labelKey: 'nav.items.customers', icon: Users },
      { to: '/leads', labelKey: 'nav.items.leads', icon: TrendingUp },
      { to: '/tasks', labelKey: 'nav.items.tasks', icon: CheckSquare },
    ],
  },
  {
    id: 'sales',
    labelKey: 'nav.groups.sales',
    items: [
      { to: '/quotations', labelKey: 'nav.items.quotations', icon: FileText },
      { to: '/sales-orders', labelKey: 'nav.items.salesOrders', icon: FileCheck2 },
      { to: '/inventory/delivery-notes', labelKey: 'nav.items.deliveryNotes', icon: FileOutput },
    ],
  },
  {
    id: 'equipment',
    labelKey: 'nav.groups.equipment',
    items: [
      { to: '/equipment', labelKey: 'nav.items.registry', icon: Truck },
      { to: '/movements', labelKey: 'nav.items.movements', icon: ArrowRightLeft },
    ],
  },
  {
    id: 'rental',
    labelKey: 'nav.groups.rental',
    items: [
      { to: '/rental-contracts', labelKey: 'nav.items.contracts', icon: ClipboardList },
    ],
  },
  {
    id: 'maintenance',
    labelKey: 'nav.groups.maintenance',
    items: [
      { to: '/maintenance', labelKey: 'nav.items.maintenance', icon: Wrench },
    ],
  },
  {
    id: 'inventory',
    labelKey: 'nav.groups.inventory',
    items: [
      { to: '/inventory', labelKey: 'nav.items.inventory', icon: Box },
      { to: '/catalog', labelKey: 'nav.items.products', icon: Package },
      { to: '/inventory/pos', labelKey: 'nav.items.partsPOS', icon: LayoutGrid },
      { to: '/inventory/purchase-orders', labelKey: 'nav.items.purchaseOrders', icon: ShoppingCart },
      { to: '/inventory/goods-receive', labelKey: 'nav.items.goodsReceive', icon: PackageCheck },
      { to: '/inventory/goods-issue', labelKey: 'nav.items.goodsIssue', icon: PackageMinus },
    ],
  },
  {
    id: 'projects',
    labelKey: 'nav.groups.projects',
    items: [
      { to: '/projects', labelKey: 'nav.items.warehouseProjects', icon: Warehouse },
    ],
  },
  {
    id: 'finance',
    labelKey: 'nav.groups.finance',
    items: [
      { to: '/billing', labelKey: 'nav.items.billing', icon: Receipt },
      { to: '/billing/invoices', labelKey: 'nav.items.invoices', icon: FileText },
      { to: '/billing/tax-invoices', labelKey: 'nav.items.taxInvoices', icon: ReceiptText },
      { to: '/billing/credit-notes', labelKey: 'nav.items.creditNotes', icon: Undo2 },
      { to: '/billing/payments', labelKey: 'nav.items.payments', icon: CreditCard },
      { to: '/billing/receipts', labelKey: 'nav.items.receipts', icon: BadgeCheck },
      { to: '/billing/payment-vouchers', labelKey: 'nav.items.paymentVouchers', icon: Banknote },
      { to: '/billing/deposits', labelKey: 'nav.items.deposits', icon: Landmark },
      { to: '/billing/statements', labelKey: 'nav.items.statements', icon: FileSpreadsheet },
    ],
  },
  {
    id: 'executive',
    labelKey: 'nav.groups.executive',
    items: [
      { to: '/reports', labelKey: 'nav.items.reports', icon: BarChart2 },
      { to: '/activities', labelKey: 'nav.items.activity', icon: Activity, adminOnly: true },
      { to: '/iot-management', labelKey: 'nav.items.iotTelemetry', icon: Radio, adminOnly: true },
    ],
  },
  // Customer-facing pages (store, 4S services, client portal) live in the separate
  // storefront app, which talks to this backend's /storefront and /portal APIs.
]

/** The module (group) a URL belongs to: the group with the longest matching item path. */
export function findGroupForPath(pathname: string): NavGroup | undefined {
  let best: { group: NavGroup; len: number } | undefined
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      const matches = pathname === item.to || pathname.startsWith(item.to + '/')
      if (matches && (!best || item.to.length > best.len)) best = { group, len: item.to.length }
    }
  }
  return best?.group
}
