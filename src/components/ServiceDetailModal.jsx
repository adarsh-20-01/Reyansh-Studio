import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Camera,
  Check,
  ChevronRight,
  ArrowRight,
  ZoomIn,
} from 'lucide-react'
import { apiUrl } from '../config/api'

export default function ServiceDetailModal({ service, isOpen, onClose }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [zoomPhoto, setZoomPhoto] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [emailNotice, setEmailNotice] = useState('')

  const openZoom = useCallback((p, e) => {
    if (e) e.stopPropagation()
    setZoomPhoto(p)
    setZoomLevel(1)
  }, [])
  const closeZoom = useCallback(() => {
    setZoomPhoto(null)
    setZoomLevel(1)
  }, [])
  const handleZoomWheel = useCallback((e) => {
    e.preventDefault()
    const d = e.deltaY < 0 ? 0.2 : -0.2
    setZoomLevel(z => Math.min(4, Math.max(0.5, +(z + d).toFixed(2))))
  }, [])

  useEffect(() => {
    if (service) {
      const defaultPhoto = service.photos && service.photos.length > 0 ? service.photos[0] : null
      setSelectedPhoto(defaultPhoto)
      setForm({
        name: '',
        email: '',
        phone: '',
        message: `Hi Reyansh Studio, I am interested in your ${service.title} services. Please share custom pricing, design options, and schedule a consultation.`,
      })
      setSent(false)
      setError('')
      setEmailNotice('')
    }
  }, [service])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomPhoto) { closeZoom() } else { onClose() }
      }
      if (zoomPhoto) {
        if (e.key === '+' || e.key === '=') setZoomLevel(z => Math.min(4, +(z + 0.25).toFixed(2)))
        if (e.key === '-') setZoomLevel(z => Math.max(0.5, +(z - 0.25).toFixed(2)))
        if (e.key === '0') setZoomLevel(1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, zoomPhoto, closeZoom])

  if (!isOpen || !service) return null

  const photoUrl = typeof window !== 'undefined' && selectedPhoto?.filename
    ? `${window.location.origin}/assets/${selectedPhoto.filename}`
    : ''

  const waText = `Hi Reyansh Studio! 🛋️

I'm inquiring about your *${service.title}* service.
📁 *Category:* ${service.category || 'Interior Design & Custom Furniture'}
${selectedPhoto ? `📸 *Reference Photo:* ${selectedPhoto.title} (${photoUrl})` : ''}

Please let me know pricing, custom options, and how we can get started.`

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    setEmailNotice('')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: service.title,
        message: form.message.trim(),
        product_title: selectedPhoto?.title ? `${service.title} - ${selectedPhoto.title}` : service.title,
        photo_filename: selectedPhoto?.filename || '',
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

      if (data && (data.success || data.saved)) {
        setSent(true)
        if (data.emailSent === false) {
          setEmailNotice(
            data.notice ||
              'Your enquiry has been safely saved in our studio database! Email notification may be slightly delayed, but our team can view your enquiry directly in our admin portal.'
          )
        } else {
          setEmailNotice('')
        }
      } else {
        throw new Error(
          (data && data.message) ||
            `Failed to send enquiry (${res.status}). Server might be starting up, please try again or connect via WhatsApp.`
        )
      }
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('Service enquiry failed:', err)
      if (err.name === 'AbortError') {
        setError('Server request timed out. Please try once more or connect via WhatsApp.')
      } else {
        setError(err.message || 'Unable to deliver enquiry. Please try WhatsApp.')
      }
    } finally {
      setLoading(false)
    }
  }

  const ServiceIcon = service.icon

  return (
    <AnimatePresence>
      <motion.div
        className="service-modal-overlay"
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
          padding: '12px',
        }}
      >
        <motion.div
          className="service-modal-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          initial={{ scale: 0.94, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '1060px',
            width: '100%',
            background: 'var(--bg-card, #121317)',
            border: '1px solid var(--border-gold, rgba(201, 169, 110, 0.35))',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
            maxHeight: '94vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Modal Top Header */}
          <div
            className="service-modal-header"
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.15) 0%, rgba(20, 20, 25, 0.7) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'rgba(201, 169, 110, 0.2)',
                  border: '1px solid var(--gold, #c9a96e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold, #c9a96e)',
                  flexShrink: 0,
                }}
              >
                {ServiceIcon && <ServiceIcon size={24} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h2 id="service-modal-title" style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                    {service.title}
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 10px',
                      background: 'rgba(201, 169, 110, 0.2)',
                      color: 'var(--gold, #c9a96e)',
                      borderRadius: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                    }}
                  >
                    {service.category || 'Service Detail'}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted, #9ca3af)' }}>
                  {service.tagline}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Modal"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                minWidth: 44,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e5e7eb',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="service-modal-body">
            {/* Left Column: Description, Highlights, Specs, and Real Photos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* Detailed Description */}
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--gold, #c9a96e)',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    fontWeight: 700,
                  }}
                >
                  Expertise & Craftsmanship
                </span>
                <div style={{ marginTop: 8, color: '#e5e7eb', fontSize: '0.92rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {service.fullDescription}
                </div>
              </div>

              {/* Key Highlights */}
              {service.highlights && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px 18px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Sparkles size={16} color="var(--gold, #c9a96e)" />
                    <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Key Features & Standards
                    </h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {service.highlights.map((h, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.85rem', color: '#d1d5db' }}>
                        <CheckCircle size={15} color="var(--gold, #c9a96e)" style={{ flexShrink: 0, marginTop: 3 }} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Pills */}
              {service.specs && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                  {service.specs.map((spec, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 12px',
                        background: '#0e0e11',
                        border: '1px solid rgba(201, 169, 110, 0.25)',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: 'var(--gold, #c9a96e)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {spec.label}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: 3, fontWeight: 500 }}>
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Showcase Photos for this Service */}
              {service.photos && service.photos.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--gold, #c9a96e)',
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Camera size={14} /> Completed {service.title} Projects ({service.photos.length})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9ca3af)' }}>
                      Click any photo to attach to enquiry
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                      gap: 10,
                    }}
                  >
                    {service.photos.map((p, idx) => {
                      const isSelected = selectedPhoto?.filename === p.filename
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedPhoto(p)}
                          className="svc-photo-thumb"
                          style={{
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: isSelected
                              ? '2px solid var(--gold, #c9a96e)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                            position: 'relative',
                            background: '#09090b',
                            boxShadow: isSelected
                              ? '0 0 12px rgba(201, 169, 110, 0.4)'
                              : 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div className="svc-photo-thumb-inner" style={{ height: 95, overflow: 'hidden', position: 'relative' }}>
                            <img
                              src={p.image}
                              alt={p.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s',
                              }}
                            />
                            {/* Zoom magnifier button */}
                            <button
                              type="button"
                              onClick={(e) => openZoom(p, e)}
                              aria-label={`Zoom into ${p.title}`}
                              title="Zoom In"
                              style={{
                                position: 'absolute',
                                bottom: 6,
                                right: 6,
                                background: 'rgba(10, 10, 10, 0.75)',
                                border: '1px solid rgba(201, 169, 110, 0.5)',
                                borderRadius: '50%',
                                width: 28,
                                height: 28,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--gold, #c9a96e)',
                                cursor: 'zoom-in',
                                zIndex: 2,
                                opacity: 0.7,
                                transition: 'opacity 0.2s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                            >
                              <ZoomIn size={14} />
                            </button>
                          </div>

                          <div style={{ padding: '6px 8px', background: '#0e0e11' }}>
                            <div
                              style={{
                                fontSize: '0.74rem',
                                color: '#fff',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {p.title}
                            </div>
                          </div>

                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                background: 'var(--gold, #c9a96e)',
                                color: '#0a0a0a',
                                borderRadius: '50%',
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                              }}
                            >
                              <Check size={13} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Integrated Service Enquiry Portal */}
            <div className="service-modal-form-col">
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 10px',
                    background: 'rgba(201, 169, 110, 0.2)',
                    color: 'var(--gold, #c9a96e)',
                    borderRadius: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Direct Studio Enquiry
                </span>
                <h3
                  style={{
                    margin: '8px 0 4px',
                    fontSize: '1.25rem',
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  Request {service.title} Quote
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #9ca3af)' }}>
                  Submit your space requirements. An email with your design reference is forwarded directly to{' '}
                  <strong style={{ color: '#fff' }}>reyaneshstudio@gmail.com</strong>.
                </p>
              </div>

              {/* Active Selected Photo Preview Banner */}
              {selectedPhoto && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: '#0e0e12',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    borderRadius: '8px',
                    marginBottom: 16,
                  }}
                >
                  <img
                    src={selectedPhoto.image}
                    alt={selectedPhoto.title}
                    style={{ width: 52, height: 52, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.68rem', color: '#25D366', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Camera size={11} /> Photo Reference Attached
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        color: '#fff',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {selectedPhoto.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #9ca3af)' }}>
                      Included with email notification
                    </div>
                  </div>
                </div>
              )}

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '24px 8px' }}
                >
                  <div style={{ color: 'var(--gold, #c9a96e)', marginBottom: 12 }}>
                    <CheckCircle size={48} style={{ margin: '0 auto' }} />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 6px', fontFamily: 'var(--font-heading)' }}>
                    Enquiry & Photo Received!
                  </h4>
                  <p style={{ color: '#d1d5db', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 auto 16px' }}>
                    Your request for <strong>{service.title}</strong> has been received by <strong>Reyansh Studio</strong>. Our lead consultant will reach out to you shortly.
                  </p>
                  {emailNotice && (
                    <div
                      style={{
                        background: 'rgba(201, 169, 110, 0.12)',
                        border: '1px solid rgba(201, 169, 110, 0.35)',
                        borderRadius: 6,
                        padding: '10px 14px',
                        maxWidth: 420,
                        margin: '0 auto 18px',
                        fontSize: '0.8rem',
                        color: '#e5e7eb',
                        lineHeight: 1.5,
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ color: 'var(--gold, #c9a96e)', fontWeight: 600 }}>Note: </span>
                      {emailNotice}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/917887556060?text=${encodeURIComponent(waText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '0.82rem',
                        padding: '9px 16px',
                        textDecoration: 'none',
                        background: '#25D366',
                        borderColor: '#25D366',
                        color: '#fff',
                        borderRadius: 6,
                      }}
                    >
                      <MessageSquare size={14} /> Also Chat on WhatsApp
                    </a>
                    <button
                      onClick={onClose}
                      className="btn-outline"
                      style={{ padding: '9px 18px', fontSize: '0.82rem', cursor: 'pointer', borderRadius: 6 }}
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {error && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 12px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: 8,
                        color: '#fca5a5',
                        fontSize: '0.82rem',
                      }}
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0, color: '#ef4444' }} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light, #f3f4f6)', marginBottom: 4, fontWeight: 500 }}>
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
                        padding: '9px 12px',
                        background: '#191a20',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light, #f3f4f6)', marginBottom: 4, fontWeight: 500 }}>
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
                          padding: '9px 12px',
                          background: '#191a20',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light, #f3f4f6)', marginBottom: 4, fontWeight: 500 }}>
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 90281 88787"
                        disabled={loading}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          background: '#191a20',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light, #f3f4f6)', marginBottom: 4, fontWeight: 500 }}>
                      Enquiry Requirements *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#191a20',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold"
                      style={{
                        flex: '1 1 180px',
                        padding: '11px 18px',
                        fontSize: '0.88rem',
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
                          <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                          Delivering Enquiry...
                        </>
                      ) : (
                        <>
                          <Send size={15} /> Submit Service Enquiry
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
                        padding: '11px 16px',
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
                      <MessageSquare size={15} /> WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Zoom Photo Overlay (inside modal) */}
          <AnimatePresence>
            {zoomPhoto && (
              <motion.div
                className="svc-lightbox-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeZoom}
                style={{ zIndex: 5000 }}
              >
                <button className="svc-lightbox-close" onClick={closeZoom} aria-label="Close zoom">
                  ×
                </button>

                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={e => e.stopPropagation()}
                  style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div
                    className="lb-zoom-wrapper svc-lightbox-img-wrap"
                    onWheel={handleZoomWheel}
                    style={{ cursor: zoomLevel > 1 ? 'grab' : 'zoom-in', overflow: zoomLevel > 1 ? 'auto' : 'hidden' }}
                  >
                    <img
                      src={zoomPhoto.image}
                      alt={zoomPhoto.title}
                      draggable={false}
                      style={{
                        maxWidth: zoomLevel <= 1 ? '100%' : 'none',
                        maxHeight: zoomLevel <= 1 ? '72vh' : 'none',
                        width: zoomLevel > 1 ? `${zoomLevel * 100}%` : undefined,
                        objectFit: 'contain',
                        display: 'block',
                        userSelect: 'none',
                        transition: 'width 0.2s ease',
                      }}
                    />
                    <div className="lb-zoom-controls" onClick={e => e.stopPropagation()}>
                      <button className="lb-zoom-btn" onClick={() => setZoomLevel(z => Math.min(4, +(z + 0.25).toFixed(2)))} aria-label="Zoom In" title="Zoom In">+</button>
                      <span className="lb-zoom-level">{Math.round(zoomLevel * 100)}%</span>
                      <button className="lb-zoom-btn" onClick={() => setZoomLevel(z => Math.max(0.5, +(z - 0.25).toFixed(2)))} aria-label="Zoom Out" title="Zoom Out">−</button>
                      {zoomLevel !== 1 && (
                        <button className="lb-zoom-btn lb-zoom-reset" onClick={() => setZoomLevel(1)} aria-label="Reset Zoom" title="Reset">↺</button>
                      )}
                    </div>
                  </div>
                  <p className="svc-lightbox-caption">{zoomPhoto.title}</p>
                  {zoomPhoto.caption && (
                    <p style={{ color: 'var(--text-muted, #9ca3af)', fontSize: '0.82rem', marginTop: 2, textAlign: 'center' }}>{zoomPhoto.caption}</p>
                  )}
                  <p style={{ color: 'var(--gold, #c9a96e)', fontSize: '0.72rem', marginTop: 6 }}>Scroll to zoom · +/− keys · Esc to close</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
