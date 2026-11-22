function Topbar({ onMenuClick, isMenuOpen }) {
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="main-sidebar"
        >
          <span />
          <span />
          <span />
        </button>

        <span className="topbar-label">WORKSPACE</span>
        <span className="topbar-divider">/</span>
        <span className="topbar-current">
          Accessibility Dashboard
        </span>
      </div>

      <div className="topbar-right">
        <span className="topbar-status">
          <span className="status-dot" aria-hidden="true" />
          Local Workspace
        </span>

        <div
          className="topbar-avatar"
          aria-label="User profile"
        >
          U
        </div>
      </div>
    </header>
  )
}

export default Topbar