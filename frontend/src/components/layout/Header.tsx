import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, Moon, Sun, PanelRight, TrendingUp, CheckSquare } from 'lucide-react'
import { useSidebarStore } from '@/store/sidebarStore'
import { usePanelStore } from '@/store/panelStore'
import { useThemeStore } from '@/store/themeStore'
import { useCompanyStore } from '@/store/companyStore'
import { resolveMediaUrl } from '@/utils/media'
import { useNow, formatClock, formatShortDate } from '@/hooks/useNow'
import { useShellStats } from '@/hooks/useShellStats'
import { getPageTitleKey } from '@/config/routes'
import SearchBar from '@/components/ui/SearchBar'
import NotificationCenter from '@/components/ui/NotificationCenter'
import UserProfileDropdown from '@/components/ui/UserProfileDropdown'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { findGroupForPath } from './navConfig'
import './Header.css'

const FALLBACK_LOGO = '/images/company/dk-lao-logo-oval.png'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const toggleSidebar = useSidebarStore((s) => s.toggle)
  const sidebarState = useSidebarStore((s) => s.state)
  const panelOpen = usePanelStore((s) => s.open)
  const togglePanel = usePanelStore((s) => s.toggle)
  const resolvedTheme = useThemeStore((s) => s.resolved)
  const setThemeMode = useThemeStore((s) => s.setMode)
  const profile = useCompanyStore((s) => s.profile)
  const fetchProfile = useCompanyStore((s) => s.fetch)
  const now = useNow()
  const { overdueTasks, newLeads } = useShellStats()

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const logo = resolveMediaUrl(profile?.logo_url) || FALLBACK_LOGO
  const brandName = profile?.company_name || t('common.brandName')
  const group = findGroupForPath(pathname)
  const ModuleIcon = group?.items[0]?.icon
  const moduleLabel = group ? t(group.labelKey) : t(getPageTitleKey(pathname))
  const isDark = resolvedTheme === 'dark'

  return (
    <header className="header" role="banner">
      <div className="header-left">
        <button
          className="header-icon-btn header-menu-btn"
          onClick={toggleSidebar}
          aria-label={t('header.toggleSidebar')}
          aria-expanded={sidebarState === 'expanded'}
        >
          <Menu size={19} />
        </button>

        <Link to="/dashboard" className="header-brand" title={brandName}>
          <img src={logo} alt="" className="header-brand-logo" />
          <span className="header-brand-name">{brandName}</span>
        </Link>

        <span className="header-module">
          {ModuleIcon && <span className="header-module-icon"><ModuleIcon size={16} /></span>}
          <span className="header-module-label">{moduleLabel}</span>
        </span>
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <nav className="header-right" aria-label={t('header.userActions')}>
        <div className="header-chips">
          <Link to="/leads" className="header-chip" title={t('shell.newLeads')}>
            <span className="header-chip-icon"><TrendingUp size={15} /></span>
            <span className="header-chip-text">
              <span className="header-chip-label">{t('shell.newLeads')}</span>
              <span className="header-chip-value">{newLeads > 99 ? '99+' : newLeads}</span>
            </span>
          </Link>
          <Link to="/tasks" className={`header-chip${overdueTasks > 0 ? ' header-chip--alert' : ''}`} title={t('shell.overdueTasks')}>
            <span className="header-chip-icon"><CheckSquare size={15} /></span>
            <span className="header-chip-text">
              <span className="header-chip-label">{t('shell.overdueTasks')}</span>
              <span className="header-chip-value">{overdueTasks > 99 ? '99+' : overdueTasks}</span>
            </span>
          </Link>
        </div>

        <LanguageToggle />
        <NotificationCenter />

        <button
          className="header-icon-btn"
          onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
          aria-label={isDark ? t('common.themeLight') : t('common.themeDark')}
          title={isDark ? t('common.themeLight') : t('common.themeDark')}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className={`header-icon-btn header-panel-btn${panelOpen ? ' is-on' : ''}`}
          onClick={togglePanel}
          aria-label={t('shell.togglePanel')}
          aria-pressed={panelOpen}
          title={t('shell.togglePanel')}
        >
          <PanelRight size={18} />
        </button>

        <div className="header-clock">
          <span className="header-clock-time">{formatClock(now)}</span>
          <span className="header-clock-date">{formatShortDate(now, i18n.language)}</span>
        </div>

        <UserProfileDropdown />
      </nav>
    </header>
  )
}
