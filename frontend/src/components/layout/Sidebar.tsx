import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Settings, Truck, Car, LogOut, UserCircle, KeyRound, PanelLeftClose, PanelLeftOpen, ChevronDown,
  Camera, Plus, TrendingUp, Users, FileText, FileCheck2, ClipboardList, Wrench, Receipt,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getActivitySummary } from '@/api/crmActivities'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useAuthStore } from '@/store/authStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { useAvatarStore } from '@/store/avatarStore'
import { resolveMediaUrl } from '@/utils/media'
import { NAV_GROUPS } from './navConfig'
import './Sidebar.css'

const QUICK_CREATE = [
  { to: '/leads', labelKey: 'shell.newLead', icon: TrendingUp },
  { to: '/customers', labelKey: 'shell.newCustomer', icon: Users },
  { to: '/quotations/new', labelKey: 'shell.newQuotation', icon: FileText },
  { to: '/sales-orders/new', labelKey: 'shell.newSalesOrder', icon: FileCheck2 },
  { to: '/rental-contracts/new', labelKey: 'shell.newContract', icon: ClipboardList },
  { to: '/maintenance/work-orders/new', labelKey: 'shell.newWorkOrder', icon: Wrench },
  { to: '/billing/invoices/new', labelKey: 'shell.newInvoice', icon: Receipt },
]

// Maps a user's `avatar_icon` value to a Lucide icon, used when they have
// no uploaded photo but picked a stand-in icon instead (e.g. drivers/dispatchers).
const AVATAR_ICONS: Record<string, React.ElementType> = {
  truck: Truck,
  car: Car,
}

function SidebarAvatarContent({
  avatarUrl,
  avatarIcon,
  initials,
}: {
  avatarUrl: string | null
  avatarIcon?: string | null
  initials: string
}) {
  if (avatarUrl) return <img src={avatarUrl} alt="" className="sidebar-avatar-img" />
  const Icon = avatarIcon ? AVATAR_ICONS[avatarIcon] : undefined
  if (Icon) return <Icon size={16} />
  return <>{initials}</>
}

export default function Sidebar() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const sidebarState = useSidebarStore((s) => s.state)
  const setState = useSidebarStore((s) => s.setState)
  const toggle = useSidebarStore((s) => s.toggle)
  const collapsedGroups = useSidebarStore((s) => s.collapsedGroups)
  const toggleGroup = useSidebarStore((s) => s.toggleGroup)
  const isExpanded = sidebarState === 'expanded'
  const { data: taskSummary } = useQuery({
    queryKey: ['activity-summary'], queryFn: () => getActivitySummary().then((r) => r.data),
    refetchInterval: 120_000, enabled: !!user,
  })
  const overdueTasks = taskSummary?.overdue ?? 0

  const initials = user
    ? (user.full_name ?? user.username).split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  const userAvatarUrl = resolveMediaUrl(user?.avatar_url)
  const customAvatar = useAvatarStore((s) => s.customAvatar)
  const setCustomAvatar = useAvatarStore((s) => s.setCustomAvatar)
  const avatarFileInputRef = useRef<HTMLInputElement>(null)
  const avatarUrl = customAvatar ?? userAvatarUrl

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCustomAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  const displayName = user?.full_name ?? user?.username ?? '—'
  const role = user?.is_superuser ? t('header.roleAdmin') : t('header.roleUser')

  const closeMobile = () => {
    if (window.innerWidth <= 768) setState('hidden')
  }

  const [newMenuOpen, setNewMenuOpen] = useState(false)
  const newMenuRef = useRef<HTMLDivElement>(null)
  const [isUserMenuOpen, setUserMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<{ left: number; bottom: number } | null>(null)
  const userTriggerRef = useRef<HTMLButtonElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const toggleUserMenu = () => {
    if (!isUserMenuOpen) {
      const rect = userTriggerRef.current?.getBoundingClientRect()
      if (rect) setMenuPos({ left: rect.left, bottom: window.innerHeight - rect.top + 8 })
    }
    setUserMenuOpen((v) => !v)
  }

  useEffect(() => {
    if (!isUserMenuOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        userTriggerRef.current && !userTriggerRef.current.contains(target) &&
        userMenuRef.current && !userMenuRef.current.contains(target)
      ) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isUserMenuOpen])

  useEffect(() => {
    if (!newMenuOpen) return
    const onDown = (e: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) setNewMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNewMenuOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [newMenuOpen])

  const handleLogout = () => {
    setUserMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }


  return (
    <>
      <div
        className={`sidebar-overlay${sidebarState === 'expanded' && window.innerWidth <= 768 ? ' visible' : ''}`}
        onClick={() => setState('hidden')}
        aria-hidden="true"
      />

      <aside className="sidebar transition-all duration-300" data-state={sidebarState} aria-label={t('common.mainNavigation')}>
        {/* Create + collapse */}
        <div className="sidebar-top">
          <div className="sidebar-new-wrap" ref={newMenuRef}>
            <button
              type="button"
              className="sidebar-new-btn"
              onClick={() => setNewMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={newMenuOpen}
              title={t('shell.createMenu')}
            >
              <Plus size={18} />
              {isExpanded && <span>{t('shell.new')}</span>}
            </button>
            {newMenuOpen && (
              <div className="sidebar-new-menu" role="menu">
                {QUICK_CREATE.map((item) => (
                  <button
                    key={item.to}
                    type="button"
                    role="menuitem"
                    className="sidebar-new-menu-item"
                    onClick={() => { setNewMenuOpen(false); closeMobile(); navigate(item.to) }}
                  >
                    <item.icon size={15} /> {t(item.labelKey)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={toggle}
            title={isExpanded ? t('nav.collapseSidebar') : t('nav.expandSidebar')}
            aria-label={isExpanded ? t('nav.collapseSidebar') : t('nav.expandSidebar')}
          >
            {isExpanded ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group) => {
            const isGroupCollapsed = isExpanded && collapsedGroups.includes(group.id)
            return (
              <div key={group.id} className="sidebar-group">
                {isExpanded && (
                  <button
                    type="button"
                    className="sidebar-group-header"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={!isGroupCollapsed}
                  >
                    <span className="sidebar-group-label">{t(group.labelKey)}</span>
                    <ChevronDown className="sidebar-group-chevron" size={13} />
                  </button>
                )}
                <div className={`sidebar-group-items-wrap${isGroupCollapsed ? ' is-collapsed' : ''}`}>
                  <div className="sidebar-group-items">
                    {group.items
                      .filter((item) => !item.adminOnly || user?.is_superuser)
                      .map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/catalog' || item.to === '/billing'}
                        className={({ isActive }) =>
                          `sidebar-nav-item${isActive ? ' active' : ''}`
                        }
                        onClick={closeMobile}
                        title={t(item.labelKey)}
                      >
                        <item.icon className="sidebar-nav-icon" size={16} />
                        {isExpanded && <span className="sidebar-nav-label">{t(item.labelKey)}</span>}
                        {item.to === '/tasks' && overdueTasks > 0 && (
                          <span
                            title={String(overdueTasks)}
                            style={{
                              marginLeft: isExpanded ? 'auto' : 0, background: '#dc2626', color: '#fff', borderRadius: 999,
                              fontSize: 10.5, fontWeight: 600, minWidth: 18, height: 18, padding: '0 5px',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >{overdueTasks > 99 ? '99+' : overdueTasks}</span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}

          <div className="sidebar-divider" />
          {user?.is_superuser && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
              onClick={closeMobile}
              title={t('nav.items.settings')}
            >
              <Settings className="sidebar-nav-icon" size={16} />
              {isExpanded && <span className="sidebar-nav-label">{t('nav.items.settings')}</span>}
            </NavLink>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-user"
            ref={userTriggerRef}
            onClick={toggleUserMenu}
            aria-haspopup="true"
            aria-expanded={isUserMenuOpen}
            title={displayName}
          >
            <div className={`sidebar-avatar${avatarUrl ? ' sidebar-avatar--image' : ''}`}>
              <SidebarAvatarContent avatarUrl={avatarUrl} avatarIcon={user?.avatar_icon} initials={initials} />
            </div>
            {isExpanded && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{displayName}</div>
                <div className="sidebar-user-role">{role}</div>
              </div>
            )}
          </button>

          {isUserMenuOpen && menuPos && createPortal(
            <div
              ref={userMenuRef}
              className="sidebar-user-menu"
              style={{ position: 'fixed', left: menuPos.left, bottom: menuPos.bottom }}
              role="menu"
            >
              <div className="sidebar-user-menu-header">
                <button
                  type="button"
                  className="sidebar-avatar-upload-trigger"
                  onClick={() => avatarFileInputRef.current?.click()}
                  title={t('header.changePhoto')}
                >
                  <div
                    className={`sidebar-avatar${avatarUrl ? ' sidebar-avatar--image' : ''}`}
                    style={{ width: 38, height: 38, fontSize: 13 }}
                  >
                    <SidebarAvatarContent avatarUrl={avatarUrl} avatarIcon={user?.avatar_icon} initials={initials} />
                  </div>
                  <span className="sidebar-avatar-upload-overlay" aria-hidden="true">
                    <Camera size={14} />
                  </span>
                </button>
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  className="sidebar-avatar-file-input"
                  onChange={handleAvatarFileChange}
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <div className="sidebar-user-menu-header-info">
                  <div className="sidebar-user-menu-name">{displayName}</div>
                  {user?.email && <div className="sidebar-user-menu-email">{user.email}</div>}
                  <div className="sidebar-user-menu-role">{role}</div>
                </div>
              </div>

              <div className="sidebar-user-menu-section">
                <div className="sidebar-user-menu-section-label">{t('header.appearance')}</div>
                <ThemeToggle />
              </div>

              <div className="sidebar-user-menu-divider" />

              <button
                type="button"
                className="sidebar-user-menu-item"
                role="menuitem"
                onClick={() => { setUserMenuOpen(false); closeMobile(); navigate('/settings') }}
              >
                <Settings size={14} /> {t('header.settings')}
              </button>

              <div className="sidebar-user-menu-divider" />

              <button
                type="button"
                className="sidebar-user-menu-item"
                role="menuitem"
                onClick={() => { setUserMenuOpen(false); closeMobile(); navigate('/profile') }}
              >
                <UserCircle size={14} /> {t('header.myProfile')}
              </button>
              <button
                type="button"
                className="sidebar-user-menu-item"
                role="menuitem"
                onClick={() => { setUserMenuOpen(false); closeMobile(); navigate('/change-password') }}
              >
                <KeyRound size={14} /> {t('header.changePassword')}
              </button>

              <div className="sidebar-user-menu-divider" />

              <button type="button" className="sidebar-user-menu-item danger" role="menuitem" onClick={handleLogout}>
                <LogOut size={14} /> {t('header.logout')}
              </button>
            </div>,
            document.body
          )}
        </div>
      </aside>
    </>
  )
}
