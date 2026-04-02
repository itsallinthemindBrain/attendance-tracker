import { useState, useEffect, useCallback } from 'react'
import { client } from '../api/client'
import './Dashboard.css'

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatShortDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const [todayRecord, setTodayRecord] = useState(null)
  const [monthlyCount, setMonthlyCount] = useState(0)
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [clockBusy, setClockBusy] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setError(null)
      const [attendance, trainingList] = await Promise.all([
        client.get('/api/attendance'),
        client.get('/api/training'),
      ])

      const today = todayISO()
      const todayRec = attendance.find(r => r.date === today && !r.clockOut) ?? null
      setTodayRecord(todayRec)

      const thisMonth = new Date().toISOString().slice(0, 7)
      setMonthlyCount(attendance.filter(r => r.date.startsWith(thisMonth)).length)

      setTrainings(trainingList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function handleClockIn() {
    setClockBusy(true)
    try {
      const record = await client.post('/api/attendance/clock-in', { notes: null })
      setTodayRecord(record)
      setMonthlyCount(c => c + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setClockBusy(false)
    }
  }

  async function handleClockOut() {
    if (!todayRecord) return
    setClockBusy(true)
    try {
      const updated = await client.post(`/api/attendance/clock-out/${todayRecord.id}`)
      setTodayRecord(null)
      // update monthly list — replace in-place via reload is simpler
      await loadData()
      void updated
    } catch (err) {
      setError(err.message)
    } finally {
      setClockBusy(false)
    }
  }

  const pendingCount = trainings.filter(t => t.status === 'Pending').length
  const submittedCount = trainings.filter(t => t.status === 'Submitted').length
  const recent = [...trainings]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5)

  if (loading) return <p className="dashboard-loading">Loading…</p>

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-date">{formatDate(new Date())}</p>
        </div>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {/* ===== CLOCK PANEL ===== */}
      <div className="clock-panel">
        <div className="clock-status">
          <div className="clock-status-label">Today&apos;s Status</div>
          <div className={`clock-status-value ${todayRecord ? 'clocked-in' : ''}`}>
            {todayRecord
              ? `Clocked in at ${new Date(todayRecord.clockIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
              : 'Not clocked in'}
          </div>
        </div>
        <div className="clock-actions">
          <button
            className="btn-clock-in"
            onClick={handleClockIn}
            disabled={!!todayRecord || clockBusy}
          >
            Clock In
          </button>
          <button
            className="btn-clock-out"
            onClick={handleClockOut}
            disabled={!todayRecord || clockBusy}
          >
            Clock Out
          </button>
        </div>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="summary-cards">
        <div className="summary-card accent">
          <div className="summary-card-label">Attendance This Month</div>
          <div className="summary-card-value">{monthlyCount}</div>
        </div>
        <div className="summary-card warning">
          <div className="summary-card-label">Pending Trainings</div>
          <div className="summary-card-value">{pendingCount}</div>
        </div>
        <div className="summary-card success">
          <div className="summary-card-label">Submitted Trainings</div>
          <div className="summary-card-value">{submittedCount}</div>
        </div>
      </div>

      {/* ===== RECENT ACTIVITY ===== */}
      <div className="recent-activity">
        <div className="recent-activity-header">Recent Training Activity</div>
        {recent.length === 0 ? (
          <div className="empty-state">No training activities yet.</div>
        ) : (
          <ul className="activity-list">
            {recent.map(t => (
              <li key={t.id} className="activity-item">
                <span className="activity-title">{t.title}</span>
                <span className={`status-badge ${t.status.toLowerCase()}`}>{t.status}</span>
                <span className="activity-date">{formatShortDate(t.submittedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
