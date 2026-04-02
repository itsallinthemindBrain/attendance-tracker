import { useState, useEffect, useRef, useCallback } from 'react'
import { client, BASE_URL } from '../api/client'
import './Training.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Training() {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Create form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  // Per-item submit proof
  const [submittingId, setSubmittingId] = useState(null)
  const proofInputRef = useRef(null)
  const submitTargetId = useRef(null)

  const loadTrainings = useCallback(() =>
    client.get('/api/training')
      .then(data => setTrainings([...data].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  , [])

  useEffect(() => { loadTrainings() }, [loadTrainings])

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim()) { setFormError('Title is required.'); return }
    setFormError(null)
    setCreateLoading(true)
    try {
      let proofImagePath = null
      if (imageFile) {
        const { path } = await client.upload(imageFile)
        proofImagePath = path
      }
      const created = await client.post('/api/training', {
        title: title.trim(),
        description: description.trim() || null,
      })
      if (proofImagePath) {
        await client.patch(`/api/training/${created.id}/submit`, { proofImagePath })
      }
      setTitle('')
      setDescription('')
      setImageFile(null)
      await loadTrainings()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setCreateLoading(false)
    }
  }

  function triggerProofUpload(id) {
    submitTargetId.current = id
    proofInputRef.current.value = ''
    proofInputRef.current.click()
  }

  async function handleProofFileSelected(e) {
    const file = e.target.files?.[0]
    if (!file || !submitTargetId.current) return
    const id = submitTargetId.current
    setSubmittingId(id)
    setError(null)
    try {
      const { path } = await client.upload(file)
      await client.patch(`/api/training/${id}/submit`, { proofImagePath: path })
      await loadTrainings()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmittingId(null)
      submitTargetId.current = null
    }
  }

  if (loading) return <p className="training-loading">Loading…</p>

  return (
    <div>
      <div className="training-header">
        <h1>Training Activities</h1>
        <p>Log and track your training activities</p>
      </div>

      {error && <div className="training-error">{error}</div>}

      {/* Hidden file input for submit-proof flow */}
      <input
        ref={proofInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleProofFileSelected}
      />

      {/* ===== CREATE FORM ===== */}
      <div className="training-form-card">
        <h2>New Training Activity</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. First Aid Seminar"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              placeholder="Brief description of the training…"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="proof">Proof Image (optional)</label>
            <input
              id="proof"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={e => setImageFile(e.target.files?.[0] ?? null)}
            />
            <span className="form-file-hint">JPG or PNG, max 5 MB</span>
          </div>
          {formError && <div className="form-error">{formError}</div>}
          <button type="submit" className="btn-primary" disabled={createLoading}>
            {createLoading ? 'Saving…' : '+ Add Activity'}
          </button>
        </form>
      </div>

      {/* ===== TRAINING LIST ===== */}
      <div className="training-list-card">
        <div className="training-list-header">All Activities ({trainings.length})</div>
        {trainings.length === 0 ? (
          <div className="training-empty">No training activities yet. Add one above.</div>
        ) : (
          trainings.map(t => (
            <div key={t.id} className="training-item">
              {t.proofImagePath
                ? <img
                    src={`${BASE_URL}${t.proofImagePath}`}
                    alt="proof"
                    className="training-thumb"
                  />
                : <div className="training-thumb-placeholder" />
              }
              <div className="training-info">
                <div className="training-title">{t.title}</div>
                {t.description && <div className="training-desc">{t.description}</div>}
                <div className="training-meta">
                  <span className={`status-badge ${t.status.toLowerCase()}`}>{t.status}</span>
                  <span className="training-date">{formatDate(t.submittedAt)}</span>
                </div>
              </div>
              <div className="training-actions">
                {t.status === 'Pending' && (
                  <button
                    className="btn-submit-proof"
                    onClick={() => triggerProofUpload(t.id)}
                    disabled={submittingId === t.id}
                  >
                    {submittingId === t.id ? 'Uploading…' : 'Submit Proof'}
                  </button>
                )}
                {t.reviewerNotes && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 160, textAlign: 'right' }}>
                    {t.reviewerNotes}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
