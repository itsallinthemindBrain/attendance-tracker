import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthContext } from '../context/auth'

function renderWithAuth(authState) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthContext.Provider value={authState}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('renders a spinner while auth is loading', () => {
    renderWithAuth({ isAuthenticated: false, isLoading: true })
    expect(document.querySelector('.spinner')).toBeTruthy()
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('renders the outlet when user is authenticated', () => {
    renderWithAuth({ isAuthenticated: true, isLoading: false })
    expect(screen.getByText('Protected Content')).toBeTruthy()
    expect(screen.queryByText('Login Page')).toBeNull()
  })

  it('redirects to /login when user is not authenticated', () => {
    renderWithAuth({ isAuthenticated: false, isLoading: false })
    expect(screen.getByText('Login Page')).toBeTruthy()
    expect(screen.queryByText('Protected Content')).toBeNull()
  })
})
