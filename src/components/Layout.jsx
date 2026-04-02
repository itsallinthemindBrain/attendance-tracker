import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

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
