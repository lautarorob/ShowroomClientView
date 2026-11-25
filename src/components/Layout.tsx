import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useProject } from './projectContextBase'
import {
  IconBuilding,
  IconCalculator,
  IconClose,
  IconFloors,
  IconHome,
  IconImages,
  IconList,
  IconMapPin,
  IconMenu,
  IconPhone,
  IconQuote,
  IconRotate360,
  IconStar,
  IconVideo,
} from './Icons'

interface MenuEntry {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

const MENU: MenuEntry[] = [
  { to: '/', label: 'Intro', icon: <IconHome className="menu-item__icon" />, end: true },
  { to: '/masterplan', label: 'El edificio', icon: <IconBuilding className="menu-item__icon" /> },
  { to: '/topview', label: 'Plantas', icon: <IconFloors className="menu-item__icon" /> },
  {
    to: '/availability',
    label: 'Disponibilidad',
    icon: <IconList className="menu-item__icon" />,
  },
  { to: '/gallery', label: 'Galería', icon: <IconImages className="menu-item__icon" /> },
  { to: '/amenities', label: 'Amenities', icon: <IconStar className="menu-item__icon" /> },
  { to: '/tour360', label: 'Recorridos', icon: <IconRotate360 className="menu-item__icon" /> },
  { to: '/video', label: 'Video', icon: <IconVideo className="menu-item__icon" /> },
  { to: '/location', label: 'Ubicación', icon: <IconMapPin className="menu-item__icon" /> },
  { to: '/contact', label: 'Contacto', icon: <IconPhone className="menu-item__icon" /> },
  { to: '/quote', label: 'Cotizar', icon: <IconCalculator className="menu-item__icon" /> },
]

interface LayoutProps {
  children?: ReactNode
  /** Extra controls rendered on the left side of the top bar. */
  topbarLeft?: ReactNode
  /** Extra controls rendered on the right side of the top bar. */
  topbarRight?: ReactNode
  title?: string
}

export function Layout({ children, topbarLeft, topbarRight, title }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { project } = useProject()
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-shell">
      <button
        type="button"
        className="sidebar-tab"
        aria-label="Menú principal"
        onClick={() => setMenuOpen(true)}
      >
        <IconMenu width={16} height={16} />
      </button>

      {menuOpen && (
        <>
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="sidebar" aria-label="Menú principal">
            <div className="sidebar__header">
              <img className="sidebar__logo" src="/logo.svg" alt="Terrazy" />
              <button
                type="button"
                className="sidebar__close"
                aria-label="Cerrar menú"
                onClick={() => setMenuOpen(false)}
              >
                <IconClose width={20} height={20} />
              </button>
            </div>

            <nav className="sidebar__nav">
              {MENU.map((entry) => (
                <NavLink
                  key={entry.to}
                  to={entry.to}
                  end={entry.end}
                  onClick={closeMenu}
                  className={({ isActive }) => `menu-item${isActive ? ' is-active' : ''}`}
                >
                  {entry.icon}
                  <span className="menu-item__label">{entry.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="sidebar__footer">
              {project.project.projectBrochureUrl && (
                <div className="sidebar__links">
                  <a
                    href={`https://www.phbalcony.com${project.project.projectBrochureUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Descargar Brochure
                  </a>
                  {project.project.phoneNumber && (
                    <a href={project.project.phoneUrl ?? `tel:${project.project.phoneNumber}`}>
                      {project.project.phoneNumber}
                    </a>
                  )}
                  {project.project.whatsAppUrl && (
                    <a href={project.project.whatsAppUrl} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  )}
                  {project.project.email && (
                    <a href={project.project.emailUrl ?? `mailto:${project.project.email}`}>
                      {project.project.email}
                    </a>
                  )}
                </div>
              )}

              <div className="sidebar__languages">
                <a
                  href={`https://${project.languages?.find((l) => l.current)?.url ?? 'www.phbalcony.com'}`}
                  className="is-current"
                >
                  Español
                </a>
                {project.languages
                  ?.filter((l) => !l.current)
                  .map((l) => (
                    <a key={l.url} href={`https://${l.url}`}>
                      {l.name}
                    </a>
                  ))}
              </div>

              <span className="sidebar__credit">Sitio creado con Web3D</span>
            </div>
          </aside>
        </>
      )}

      <div className="app-main">
        {children}

        <header className="topbar">
          <div className="topbar__group">{topbarLeft}</div>
          {title && <span className="topbar__title">{title}</span>}
          <div className="topbar__group">{topbarRight}</div>
        </header>
      </div>
    </div>
  )
}

/** Small round icon button used across top bars. */
export function TopBarButton({
  label,
  onClick,
  children,
  dark = true,
}: {
  label: string
  onClick?: () => void
  children: ReactNode
  dark?: boolean
}) {
  return (
    <button
      type="button"
      className={`icon-btn${dark ? ' icon-btn--dark' : ''}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export { IconQuote }
