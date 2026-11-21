
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Topbar />

        <main className="main-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
