import { useLocation } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import { findGroupForPath } from './navConfig'

/** The title strip of the content window: decorative window dots, the module icon and the breadcrumb. */
export default function WindowTitleBar() {
  const { pathname } = useLocation()
  const Icon = findGroupForPath(pathname)?.items[0]?.icon

  return (
    <div className="window-titlebar">
      <div className="window-dots" aria-hidden="true">
        <span className="window-dot window-dot--red" />
        <span className="window-dot window-dot--amber" />
        <span className="window-dot window-dot--green" />
      </div>
      <div className="window-title">
        {Icon && <span className="window-title-icon"><Icon size={15} /></span>}
        <Breadcrumb />
      </div>
      <div className="window-titlebar-spacer" aria-hidden="true" />
    </div>
  )
}
