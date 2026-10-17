import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { NAV_GROUPS, findGroupForPath } from './navConfig'

/** macOS-style dock: one tile per business module, opening that module's first page. */
export default function Dock() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isSuperuser = useAuthStore((s) => !!s.user?.is_superuser)
  const activeId = findGroupForPath(pathname)?.id

  const modules = NAV_GROUPS
    .map((group) => ({ group, first: group.items.find((item) => !item.adminOnly || isSuperuser) }))
    .filter((entry) => entry.first)

  return (
    <nav className="dock" aria-label={t('shell.modules')}>
      <div className="dock-items">
        {modules.map(({ group, first }, index) => {
          const Icon = first!.icon
          const active = group.id === activeId
          return (
            <Link
              key={group.id}
              to={first!.to}
              className={`dock-item${active ? ' active' : ''}`}
              title={t(group.labelKey)}
              aria-current={active ? 'page' : undefined}
            >
              <span className={`dock-tile dock-tile--${index % 4}`}><Icon size={22} /></span>
              <span className="dock-label">{t(group.labelKey)}</span>
            </Link>
          )
        })}
        {isSuperuser && (
          <>
            <span className="dock-sep" aria-hidden="true" />
            <Link
              to="/settings"
              className={`dock-item${pathname.startsWith('/settings') ? ' active' : ''}`}
              title={t('nav.items.settings')}
            >
              <span className="dock-tile dock-tile--dark"><Settings size={22} /></span>
              <span className="dock-label">{t('nav.items.settings')}</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
