import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '../pages/Dashboard'

vi.mock('../api/client', () => ({
  client: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import { client } from '../api/client'

const today = new Date().toISOString().split('T')[0]
const thisMonth = new Date().toISOString().slice(0, 7)

function mockEmpty() {
  client.get.mockImplementation(path => {
    if (path === '/api/attendance') return Promise.resolve([])
    if (path === '/api/training') return Promise.resolve([])
    return Promise.resolve([])
  })
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading indicator on mount', () => {
    client.get.mockReturnValue(new Promise(() => {}))
    render(<Dashboard />)
    expect(screen.getByText(/loading/i)).toBeTruthy()
  })

  it('shows "Not clocked in" when there is no open record for today', async () => {
    mockEmpty()
    render(<Dashboard />)
    await waitFor(() => expect(screen.getByText('Not clocked in')).toBeTruthy())
  })

  it('Clock In is enabled and Clock Out is disabled when not clocked in', async () => {
    mockEmpty()
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Clock In' })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: 'Clock Out' })).toBeDisabled()
    })
  })

  it('Clock In posts to /api/attendance/clock-in', async () => {
    const user = userEvent.setup()
    mockEmpty()
    const record = { id: 1, date: today, clockIn: new Date().toISOString(), clockOut: null, userId: 'u1' }
    client.post.mockResolvedValue(record)

    render(<Dashboard />)
    await waitFor(() => screen.getByRole('button', { name: 'Clock In' }))
    await user.click(screen.getByRole('button', { name: 'Clock In' }))

    expect(client.post).toHaveBeenCalledWith('/api/attendance/clock-in', { notes: null })
  })

  it('shows correct monthly attendance count', async () => {
    const records = [
      { id: 1, date: `${thisMonth}-01`, clockIn: new Date().toISOString(), clockOut: new Date().toISOString(), userId: 'u1' },
      { id: 2, date: `${thisMonth}-02`, clockIn: new Date().toISOString(), clockOut: new Date().toISOString(), userId: 'u1' },
      { id: 3, date: `${thisMonth}-03`, clockIn: new Date().toISOString(), clockOut: new Date().toISOString(), userId: 'u1' },
    ]
    client.get.mockImplementation(path => {
      if (path === '/api/attendance') return Promise.resolve(records)
      if (path === '/api/training') return Promise.resolve([])
      return Promise.resolve([])
    })

    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('3')).toBeTruthy()
    })
  })

  it('shows pending and submitted training counts', async () => {
    const trainings = [
      { id: 1, title: 'Safety', status: 'Pending', submittedAt: new Date().toISOString() },
      { id: 2, title: 'Excel', status: 'Pending', submittedAt: new Date().toISOString() },
      { id: 3, title: 'First Aid', status: 'Submitted', submittedAt: new Date().toISOString() },
    ]
    client.get.mockImplementation(path => {
      if (path === '/api/attendance') return Promise.resolve([])
      if (path === '/api/training') return Promise.resolve(trainings)
      return Promise.resolve([])
    })

    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('2')).toBeTruthy() // pending count
      expect(screen.getByText('1')).toBeTruthy() // submitted count
    })
  })

  it('shows recent training activity list', async () => {
    const trainings = [
      { id: 1, title: 'Safety Training', status: 'Pending', submittedAt: new Date().toISOString() },
    ]
    client.get.mockImplementation(path => {
      if (path === '/api/attendance') return Promise.resolve([])
      if (path === '/api/training') return Promise.resolve(trainings)
      return Promise.resolve([])
    })

    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Safety Training')).toBeTruthy()
    })
  })

  it('shows empty state when no training activity exists', async () => {
    mockEmpty()
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('No training activities yet.')).toBeTruthy()
    })
  })
})
