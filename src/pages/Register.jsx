import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { client } from '../api/client'
import './auth.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    employeeCode: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState([])
  const [busy, setBusy] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors([])

    if (form.password !== form.confirmPassword) {
      setErrors(['Passwords do not match.'])
      return
    }

    setBusy(true)
    try {
      await client.post('/api/auth/register', {
        fullName: form.fullName,
        employeeCode: form.employeeCode,
        email: form.email,
        department: form.department,
        password: form.password,
      })
      navigate('/login')
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message)
        if (parsed?.errors) {
          setErrors(parsed.errors)
          return
        }
      } catch {
        // not JSON — fall through to raw message
      }
      setErrors([err.message])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo-mark">AT</span>
          <h1>Create account</h1>
          <p>Register to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="form-field">
              <label htmlFor="employeeCode">Employee code</label>
              <input
                id="employeeCode"
                name="employeeCode"
                type="text"
                value={form.employeeCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              name="department"
              type="text"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {errors.length > 0 && (
            <div className="auth-error">
              {errors.length === 1 ? (
                <span>{errors[0]}</span>
              ) : (
                <ul>
                  {errors.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
              )}
            </div>
          )}

          <button type="submit" className="btn-auth" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
