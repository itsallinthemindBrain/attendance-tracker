import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/Login'
import { AuthContext } from '../context/auth'

function renderLogin(authOverrides = {}) {
  const auth = {
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    ...authOverrides,
  }
  render(
    <MemoryRouter>
      <AuthContext.Provider value={auth}>
        <LoginPage />
      </AuthContext.Provider>
    </MemoryRouter>
  )
  return { auth }
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email and password fields with sign-in button', () => {
    renderLogin()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy()
  })

  it('calls login() with entered credentials on submit', async () => {
    const user = userEvent.setup()
    const loginMock = vi.fn().mockResolvedValue({ email: 'test@example.com' })
    renderLogin({ login: loginMock })

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'SecurePass123!')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(loginMock).toHaveBeenCalledWith('test@example.com', 'SecurePass123!')
  })

  it('shows error message when login fails', async () => {
    const user = userEvent.setup()
    const loginMock = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
    renderLogin({ login: loginMock })

    await user.type(screen.getByLabelText('Email'), 'bad@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeTruthy()
    })
  })

  it('disables submit button and shows "Signing in…" while request is in-flight', async () => {
    const user = userEvent.setup()
    let resolveLogin
    const loginMock = vi.fn().mockReturnValue(new Promise(r => { resolveLogin = r }))
    renderLogin({ login: loginMock })

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'SecurePass123!')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()

    resolveLogin({ email: 'test@example.com' })
  })
})
