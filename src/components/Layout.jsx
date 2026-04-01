import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">AT</span>
          <span className="sidebar-logo-text">Attendance Tracker</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">
            <span className="nav-icon">▦</span>
            Dashboard
          </NavLink>
          <NavLink to="/attendance">
            <span className="nav-icon">◷</span>
            Attendance
          </NavLink>
          <NavLink to="/training">
            <span className="nav-icon">✎</span>
            Training
          </NavLink>
        </nav>
      </aside>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  )
}
