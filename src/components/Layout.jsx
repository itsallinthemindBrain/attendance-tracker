import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function closeSidebar() {
    setSidebarOpen(false)
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      {/* Mobile top bar */}
      <header className="mobile-header">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
        <span className="mobile-header-title">Attendance Tracker</span>
      </header>

      {/* Backdrop — closes sidebar when tapped */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
      )}

      <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">AT</span>
          <span className="sidebar-logo-text">Attendance Tracker</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" onClick={closeSidebar}>
            <span className="nav-icon">▦</span>
            Dashboard
          </NavLink>
          <NavLink to="/attendance" onClick={closeSidebar}>
            <span className="nav-icon">◷</span>
            Attendance
          </NavLink>
          <NavLink to="/training" onClick={closeSidebar}>
            <span className="nav-icon">✎</span>
            Training
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user-name">{user?.fullName}</div>
          <div className="sidebar-user-email">{user?.email}</div>
          <button className="btn-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  )
}
