import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { useContext } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { AuthContext } from '../context/auth'

vi.mock('../api/client', () => ({
  client: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import { client } from '../api/client'

function AuthConsumer() {
  const ctx = useContext(AuthContext)
  return (
    <div>
      <span data-testid="user">{ctx.user ? ctx.user.email : 'null'}</span>
      <span data-testid="isAuthenticated">{String(ctx.isAuthenticated)}</span>
      <span data-testid="isLoading">{String(ctx.isLoading)}</span>
      <button onClick={() => ctx.login('test@example.com', 'password123')}>Login</button>
      <button onClick={() => ctx.logout()}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts in loading state before /api/auth/me resolves', () => {
    client.get.mockReturnValue(new Promise(() => {}))
    const { getByTestId } = render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    )
    expect(getByTestId('isLoading').textContent).toBe('true')
  })

  it('sets user and marks not loading when /api/auth/me returns data', async () => {
    client.get.mockResolvedValue({ email: 'user@test.com', id: '1' })

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('user@test.com')
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true')
      expect(screen.getByTestId('isLoading').textContent).toBe('false')
    })
  })

  it('remains unauthenticated when /api/auth/me rejects', async () => {
    client.get.mockRejectedValue(new Error('401 Unauthorized'))

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null')
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false')
      expect(screen.getByTestId('isLoading').textContent).toBe('false')
    })
  })

  it('login() calls POST /api/auth/login with email and password', async () => {
    client.get.mockRejectedValue(new Error('Not authenticated'))
    client.post.mockResolvedValue({ email: 'test@example.com', id: '2' })

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('isLoading').textContent).toBe('false'))

    await act(async () => {
      screen.getByText('Login').click()
    })

    expect(client.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    })
    expect(screen.getByTestId('user').textContent).toBe('test@example.com')
  })

  it('logout() calls POST /api/auth/logout and clears user', async () => {
    client.get.mockResolvedValue({ email: 'user@test.com', id: '1' })
    client.post.mockResolvedValue(null)

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('isAuthenticated').textContent).toBe('true'))

    await act(async () => {
      screen.getByText('Logout').click()
    })

    expect(client.post).toHaveBeenCalledWith('/api/auth/logout')
    expect(screen.getByTestId('user').textContent).toBe('null')
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false')
  })
})
