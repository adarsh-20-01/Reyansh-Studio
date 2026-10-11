import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader2, MessageSquare, Check, Server, Camera, X } from 'lucide-react'

const SERVICES = [
  'Home Interior',
  'Sofa',
  'Kitchen Cabinet',
  'T. V. Units',
  'Beds',
  'Wardrobes',
  'Dining Table',
  'Curtains',
  'Other / Complete Renovation',
]

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [attachedPhoto, setAttachedPhoto] = useState(null) // { name, dataUrl }
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [serverOnline, setServerOnline] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => setServerOnline(true))
      .catch(() => setServerOnline(false))
  }, [])

  const handle = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errorMessage) setErrorMessage('')
  }

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Photo size should be less than 8MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      setAttachedPhoto({
        name: file.name,
        dataUrl: ev.target.result,
      })
    }
    reader.readAsDataURL(file)
  }

  const submit = async e => {
    e.preventDefault()
    if (loading) return // Prevent duplicate submissions

    setLoading(true)
    setErrorMessage('')

    try {
      const payload = {
        ...form,
        photo_data: attachedPhoto?.dataUrl || '',
        photo_filename: attachedPhoto?.name || '',
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data || !data.success) {
        const errorText = (data && data.message) 
          ? data.message 
          : `Server returned error (${response.status}). Please try again or reach us directly on WhatsApp.`
        throw new Error(errorText)
      }

      setSubmittedName(form.name)
      setSent(true)
      setForm({ name: '', email: '', phone: '', service: '', message: '' })
      setAttachedPhoto(null)
    } catch (err) {
      console.error('Submission failed:', err)
      setErrorMessage(
        err.message || 'Unable to connect to the email server. Please check your network or contact us directly on WhatsApp.'
      )
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSent(false)
    setErrorMessage('')
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          className="form-success"
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'var(--gold)', marginBottom: 16 }}>
            <CheckCircle size={56} style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', marginBottom: 12 }}>
            Thank You{submittedName ? `, ${submittedName}` : ''}!
          </h3>
          <p style={{ color: 'var(--text-muted-light)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 24px' }}>
            Your consultation request has been sent successfully to <strong>Reyansh Studio</strong>. Our lead designer will review your details and reach out to you shortly.
          </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
              <a
                href="https://wa.me/917887556060?text=Hi%20Reyansh%20Studio!%20I%20just%20submitted%20a%20consultation%20request%20on%20your%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  textDecoration: 'none',
                  background: '#25D366',
                  color: '#fff',
                  borderColor: '#25D366',
                }}
              >
                <MessageSquare size={18} /> Quick Chat on WhatsApp (+91 7887556060)
              </a>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '9px 20px', cursor: 'pointer' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
        </motion.div>
      ) : (
        <motion.form
          className="contact-form"
          key="form"
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 16px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2, color: '#ef4444' }} />
              <div>
                <strong>Submission Error:</strong> {errorMessage}
              </div>
            </motion.div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cf-name">Full Name *</label>
              <input
                id="cf-name"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="e.g. Rahul Sharma"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="cf-email">Email Address *</label>
              <input
                id="cf-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cf-phone">Phone / WhatsApp *</label>
              <input
                id="cf-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handle}
                placeholder="+91 78875 56060"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="cf-service">Service Interested</label>
              <select
                id="cf-service"
                name="service"
                value={form.service}
                onChange={handle}
                disabled={loading}
              >
                <option value="">Select a service</option>
                {SERVICES.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cf-msg">Project Details / Message *</label>
            <textarea
              id="cf-msg"
              name="message"
              value={form.message}
              onChange={handle}
              placeholder="Tell us about your space, dimensions, preferred style, or requirements..."
              rows={5}
              required
              disabled={loading}
            />
          </div>

          {/* Reference Photo Attachment */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Attach Design / Reference Photo <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </label>
              {attachedPhoto && (
                <button
                  type="button"
                  onClick={() => setAttachedPhoto(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <X size={13} /> Remove Photo
                </button>
              )}
            </div>

            {attachedPhoto ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 8,
                }}
              >
                <img
                  src={attachedPhoto.dataUrl}
                  alt="Preview"
                  style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {attachedPhoto.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Check size={12} /> Photo will be sent with your email enquiry
                  </div>
                </div>
              </div>
            ) : (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <Camera size={18} color="var(--gold)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-light)' }}>
                  Attach a photo of your sofa, kitchen, or living room (JPG, PNG, WEBP)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  disabled={loading}
                />
              </label>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Sending Request...
                </>
              ) : (
                <>
                  Send Consultation Request <Send size={16} />
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: '0.82rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: serverOnline ? '#22c55e' : 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: serverOnline ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                {serverOnline ? 'Backend Online' : 'Connecting to Server...'}
              </span>
            </div>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
