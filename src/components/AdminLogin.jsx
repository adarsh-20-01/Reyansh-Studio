import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin({ onLoginSuccess }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your administrator email address.')
      return
    }
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      if (onLoginSuccess) onLoginSuccess()
    } catch (err) {
      setError(err.message || 'Invalid email address or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        position: 'relative',
        background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 10, 10, 0.98) 70%)',
      }}
    >
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(18, 18, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '20px',
          padding: '32px 24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(212, 175, 55, 0.1)',
          position: 'relative',
        }}
      >
        {/* Top Gold Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          }}
        />

        {/* Shield Icon & Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 58,
              height: 58,
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
              border: '1px solid var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(212,175,55,0.25)',
            }}
          >
            <Shield size={26} color="var(--gold)" />
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 600,
              display: 'block',
              marginBottom: 6,
            }}
          >
            Restricted Clearance
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.9rem',
              margin: '0 0 8px',
              color: 'var(--text-light)',
            }}
          >
            Admin <span style={{ color: 'var(--gold)' }}>Portal</span>
          </h2>

          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted-light)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Sign in with administrative credentials to manage consultations and gallery portfolio.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              color: '#fca5a5',
              fontSize: '0.86rem',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1, color: '#ef4444' }} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="admin-email"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-muted-light)',
                marginBottom: 8,
                letterSpacing: '0.5px',
              }}
            >
              Email Address
            </label>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  color: 'var(--gold)',
                  opacity: 0.8,
                  pointerEvents: 'none',
                }}
              />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="reyaneshstudio@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 14px 13px 44px',
                  background: 'rgba(10, 10, 12, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--gold)'
                  e.target.style.boxShadow = '0 0 12px rgba(212, 175, 55, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label
                htmlFor="admin-password"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-muted-light)',
                  letterSpacing: '0.5px',
                }}
              >
                Password
              </label>
            </div>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  color: 'var(--gold)',
                  opacity: 0.8,
                  pointerEvents: 'none',
                }}
              />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 46px 13px 44px',
                  background: 'rgba(10, 10, 12, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--gold)'
                  e.target.style.boxShadow = '0 0 12px rgba(212, 175, 55, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted-light)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-muted-light)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
              Remember me on this browser
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: 6,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--gold), #d4af37)',
              color: '#0a0a0a',
              fontWeight: 700,
              fontSize: '0.96rem',
              letterSpacing: '0.5px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.35)',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: loading ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.5)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.35)'
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Shield size={18} />
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Return to website */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            to="/"
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ArrowLeft size={16} /> Return to Public Website
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
