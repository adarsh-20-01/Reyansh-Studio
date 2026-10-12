import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, AlertCircle, Loader2, MessageSquare, Mail, Camera } from 'lucide-react'
import { apiUrl } from '../config/api'

export default function PhotoEnquiryModal({ item, isOpen, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (item) {
      setForm({
        name: '',
        email: '',
        phone: '',
        message: `Hi Reyansh Studio, I am interested in "${item.title}". Please share pricing, custom dimension options, and fabric swatches.`,
      })
      setSent(false)
      setError('')
    }
  }, [item])

  if (!isOpen || !item) return null

  const photoUrl = typeof window !== 'undefined' && item.filename 
    ? `${window.location.origin}/assets/${item.filename}` 
    : ''

  const waText = `Hi Reyansh Studio! 🛋️

I'm inquiring about this furniture design from your gallery:
📌 *Product:* ${item.title}
📁 *Category:* ${item.category}
📝 *Details:* ${item.desc || 'Custom handcrafted furniture'}
📸 *Photo Reference:* ${photoUrl}

Please let me know pricing, dimensions, and fabric options.`

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: item.category || 'Custom Furniture',
        message: form.message.trim(),
        product_title: item.title,
        photo_filename: item.filename || '',
        photo_url: photoUrl,
      }

      const endpoint = apiUrl('/api/contact')
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const data = await res.json().catch(() => null)

      if (!res.ok || !data || !data.success) {
        throw new Error(
          (data && data.message) ||
            `Failed to send enquiry (${res.status}). Server might be starting up, please try again or connect directly via WhatsApp.`
        )
      }

      setSent(true)
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('Enquiry failed:', err)
      if (err.name === 'AbortError') {
        setError('Server request timed out. If the server was sleeping, please try once more or reach us on WhatsApp.')
      } else {
        setError(err.message || 'Unable to deliver enquiry. Please check your network or try WhatsApp.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="photo-enquiry-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 4000,
          background: 'rgba(5, 5, 8, 0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          className="photo-enquiry-modal"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '560px',
            width: '100%',
            background: 'var(--bg-card, #121317)',
            border: '1px solid var(--border-gold, rgba(201, 169, 110, 0.35))',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.12) 0%, rgba(20, 20, 25, 0.6) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(201, 169, 110, 0.2)',
                  border: '1px solid var(--gold, #c9a96e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold, #c9a96e)',
                }}
              >
                <Mail size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  Enquire About This Design
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9ca3af)' }}>
                  Your message will be sent with this high-res photo attached
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e5e7eb',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
            {/* Attached Photo Snapshot Preview Card */}
            <div
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                padding: '12px 14px',
                background: '#0d0e12',
                borderRadius: '10px',
                border: '1px solid var(--border-gold, rgba(201, 169, 110, 0.3))',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 70,
                  borderRadius: 8,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#000',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      background: 'rgba(201, 169, 110, 0.2)',
                      color: 'var(--gold, #c9a96e)',
                      borderRadius: 4,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      background: 'rgba(37, 211, 102, 0.15)',
                      color: '#25D366',
                      borderRadius: 4,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Camera size={11} /> Photo Attached
                  </span>
                </div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.98rem',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted, #9ca3af)' }}>
                  Sends photo directly to <strong>reyaneshstudio@gmail.com</strong>
                </p>
              </div>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '24px 8px' }}
              >
                <div style={{ color: 'var(--gold, #c9a96e)', marginBottom: 14 }}>
                  <CheckCircle size={52} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 8px', fontFamily: 'var(--font-heading)' }}>
                  Enquiry & Photo Delivered!
                </h3>
                <p style={{ color: 'var(--text-muted-light, #d1d5db)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: 420, margin: '0 auto 20px' }}>
                  Thank you! Your enquiry for <strong>{item.title}</strong> has been emailed with the design photo to{' '}
                  <span style={{ color: 'var(--gold, #c9a96e)' }}>Reyansh Studio</span>. Our team will review your specifications and get back to you shortly.
                </p>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/917887556060?text=${encodeURIComponent(waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.88rem',
                      padding: '10px 20px',
                      textDecoration: 'none',
                      background: '#25D366',
                      borderColor: '#25D366',
                      color: '#fff',
                    }}
                  >
                    <MessageSquare size={16} /> Also Chat on WhatsApp
                  </a>
                  <button
                    onClick={onClose}
                    className="btn-outline"
                    style={{ padding: '10px 22px', fontSize: '0.88rem', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: 8,
                      color: '#fca5a5',
                      fontSize: '0.85rem',
                    }}
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0, color: '#ef4444' }} />
                    <span>{error}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light, #f3f4f6)', marginBottom: 5, fontWeight: 500 }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#191a20',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light, #f3f4f6)', marginBottom: 5, fontWeight: 500 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#191a20',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light, #f3f4f6)', marginBottom: 5, fontWeight: 500 }}>
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 78875 56060"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#191a20',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light, #f3f4f6)', marginBottom: 5, fontWeight: 500 }}>
                    Your Enquiry Message *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#191a20',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold"
                    style={{
                      flex: '1 1 200px',
                      padding: '12px 20px',
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      background: 'var(--gold, #c9a96e)',
                      color: '#0a0a0a',
                      fontWeight: 600,
                      borderRadius: 8,
                      border: 'none',
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                        Sending Photo & Message...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Send Enquiry with Photo
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/917887556060?text=${encodeURIComponent(waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{
                      flex: '0 0 auto',
                      padding: '12px 18px',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      textDecoration: 'none',
                      background: 'rgba(37, 211, 102, 0.15)',
                      borderColor: '#25D366',
                      color: '#25D366',
                      borderRadius: 8,
                    }}
                  >
                    <MessageSquare size={16} /> WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
