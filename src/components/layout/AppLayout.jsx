import { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function handleToggleSidebar() {
    setIsSidebarOpen((previous) => !previous)
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false)
  }

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={handleCloseSidebar}
          aria-label="Close navigation menu"
        />
      )}

      <div className="app-main">
        <Topbar
          onMenuClick={handleToggleSidebar}
          isMenuOpen={isSidebarOpen}
        />

        <main className="main-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout