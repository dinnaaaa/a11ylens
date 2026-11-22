import { NavLink } from 'react-router'

const navigationItems = [
  { path: '/', label: 'Dashboard Overview', icon: '◫', end: true },
  { path: '/audit', label: 'Accessibility Audit', icon: '◎' },
  { path: '/contrast-checker', label: 'Contrast Checker', icon: '◉' },
  { path: '/issues', label: 'Issue Management', icon: '▤' },
  { path: '/wcag-checklist', label: 'WCAG Checklist', icon: '☑' },
  { path: '/audit-history', label: 'Audit History & Reports', icon: '◷' },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      id="main-sidebar"
      className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      aria-label="Workspace sidebar"
    >
      <div className="sidebar-brand">
        <div className="brand-icon">A</div>

        <div>
          <h1>A11yLens</h1>
          <span>Accessibility Analyzer</span>
        </div>
      </div>

      <nav
        className="sidebar-navigation"
        aria-label="Main navigation"
      >
        <p className="sidebar-section-label">MAIN MENU</p>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            aria-label={item.label}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span
              className="sidebar-link-icon"
              aria-hidden="true"
            >
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span
          className="sidebar-footer-dot"
          aria-hidden="true"
        />

        <span>Accessibility matters</span>
      </div>
    </aside>
  )
}

export default Sidebar