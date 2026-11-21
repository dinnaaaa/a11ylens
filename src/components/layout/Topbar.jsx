
function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <span className="topbar-label">WORKSPACE</span>
        <span className="topbar-divider">/</span>
        <span className="topbar-current">Accessibility Dashboard</span>
      </div>

      <div className="topbar-right">
        <span className="topbar-status">
          <span className="status-dot" aria-hidden="true" />
          Local Workspace
        </span>
        <div className="topbar-avatar" aria-label="User profile">
          U
        </div>
      </div>
    </header>
  )
}

export default Topbar
