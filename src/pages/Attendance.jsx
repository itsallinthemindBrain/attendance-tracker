import { useState, useEffect } from 'react'
import { client } from '../api/client'
import './Attendance.css'

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

function formatTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function Attendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client.get('/api/attendance')
      .then(data => setRecords([...data].sort((a, b) => b.date.localeCompare(a.date))))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="attendance-loading">Loading…</p>

  return (
    <div>
      <div className="attendance-header">
        <h1>Attendance History</h1>
        <p>All clock-in and clock-out records</p>
      </div>

      {error && <div className="attendance-error">{error}</div>}

      <div className="attendance-table-wrap">
        {records.length === 0 ? (
          <div className="attendance-empty">No attendance records yet.</div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td className="td-date">{formatDate(r.date)}</td>
                  <td className="td-time">{formatTime(r.clockIn)}</td>
                  <td className="td-time">
                    {r.clockOut
                      ? formatTime(r.clockOut)
                      : <span className="td-clocked-in">Still clocked in</span>}
                  </td>
                  <td className="td-notes">{r.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
