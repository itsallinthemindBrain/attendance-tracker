import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './ProtectedRoute.css'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
