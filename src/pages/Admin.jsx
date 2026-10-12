import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Server,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
  PlusCircle,
  Check,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Layers,
  Search,
  LogOut,
  Shield,
  Image as ImageIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../config/api'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../components/AdminLogin'

export default function Admin() {
  const { isAdmin, adminUser, logout } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendHealth, setBackendHealth] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  const fetchHealth = async () => {
    try {
      const res = await fetch(apiUrl('/api/health'))
      if (res.ok) {
        const data = await res.json()
        setBackendHealth(data)
      } else {
        setBackendHealth(null)
      }
    } catch {
      setBackendHealth(null)
    }
  }

  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(apiUrl('/api/consultations'))
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load leads`)
      const data = await res.json()
      setLeads(data.consultations || [])
    } catch (err) {
      setError(err.message || 'Unable to connect to backend server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchHealth()
      fetchLeads()
    }
  }, [isAdmin])

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(apiUrl(`/api/consultations/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLeads(leads.map(l => (l.id === id ? { ...l, status: newStatus } : l)))
        showNotification(`Lead status updated to "${newStatus}"`)
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const deleteLead = async (id, name) => {
    if (!window.confirm(`Delete consultation inquiry from ${name}?`)) return
    try {
      const res = await fetch(apiUrl(`/api/consultations/${id}`), {
        method: 'DELETE',
      })
      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id))
        showNotification(`Lead from ${name} deleted`)
      }
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const sendTestLead = async () => {
    const testNames = ['Rajesh Patel', 'Ananya Deshmukh', 'Aditya Verma', 'Sneha Kulkarni']
    const testServices = ['Home Interior', 'Custom Sofa', 'Kitchen Cabinet', 'Wardrobes']
    const randomName = testNames[Math.floor(Math.random() * testNames.length)]
    const randomService = testServices[Math.floor(Math.random() * testServices.length)]

    try {
      const res = await fetch(apiUrl('/api/consultation'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${randomName} (Test Lead)`,
          email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
          service: randomService,
          message: `Inquiring about premium ${randomService.toLowerCase()} consultation and custom 3D design quote.`,
        }),
      })

      if (res.ok) {
        showNotification(`✨ Test lead submitted and stored successfully!`)
        fetchLeads()
        fetchHealth()
      }
    } catch (err) {
      alert('Failed to create test lead: ' + err.message)
    }
  }

  const showNotification = msg => {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 3500)
  }

  const filteredLeads = leads
    .filter(l => (filter === 'all' ? true : l.status === filter))
    .filter(l => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        l.name?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.service?.toLowerCase().includes(q)
      )
    })

  const stats = {
    total: leads.length,
    newCount: leads.filter(l => l.status === 'new').length,
    contactedCount: leads.filter(l => l.status === 'contacted').length,
    completedCount: leads.filter(l => l.status === 'completed').length,
  }

  // If not logged in as Admin, show private Admin Login screen
  if (!isAdmin) {
    return <AdminLogin onLoginSuccess={() => { fetchHealth(); fetchLeads(); }} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '85vh', paddingTop: '100px', paddingBottom: '60px' }}
    >
      <div className="container">
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--gold)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                marginBottom: 8,
              }}
            >
              <ArrowLeft size={16} /> Back to Contact Page
            </Link>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: 'var(--text-light)' }}>
              Consultation <span style={{ color: 'var(--gold)' }}>Leads Portal</span>
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted-light)', fontSize: '0.95rem' }}>
              Real-time backend consultation engine & client management
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Admin identity badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: '20px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--border-gold)',
                color: 'var(--gold)',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <Shield size={14} />
              <span>Admin: {adminUser?.email || 'reyaneshstudio@gmail.com'}</span>
            </div>

            <Link
              to="/gallery"
              className="btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                fontSize: '0.85rem',
                textDecoration: 'none',
                color: 'var(--text-light)',
              }}
            >
              <ImageIcon size={15} color="var(--gold)" /> Manage Gallery
            </Link>

            <button
              onClick={() => {
                fetchHealth()
                fetchLeads()
              }}
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              onClick={sendTestLead}
              className="btn-gold"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', fontSize: '0.85rem' }}
            >
              <PlusCircle size={15} /> Test Pipeline
            </button>
            <button
              onClick={logout}
              className="btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                fontSize: '0.85rem',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                cursor: 'pointer',
              }}
              title="Sign out of Admin Portal"
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </div>

        {/* Backend Connectivity Status Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            padding: '18px 24px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: backendHealth ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: backendHealth ? '#22c55e' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Server size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: backendHealth ? '#22c55e' : '#ef4444',
                    boxShadow: backendHealth ? '0 0 8px #22c55e' : 'none',
                  }}
                />
                <strong style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
                  {backendHealth ? 'Backend Server Online (Express)' : 'Backend Server Offline'}
                </strong>
              </div>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted-light)', fontSize: '0.85rem', wordBreak: 'break-word' }}>
                {backendHealth
                  ? `Active on http://localhost:5000 • Leads stored in data/consultations.json • Email: ${backendHealth.receiver}`
                  : 'Cannot reach backend at /api. Make sure "npm run dev" or "node server.js" is active.'}
              </p>
            </div>
          </div>

          {backendHealth && (
            <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'var(--text-muted-light)' }}>
              <div>
                Uptime: <strong style={{ color: 'var(--text-light)' }}>{backendHealth.uptime}s</strong>
              </div>
              <div>
                Storage: <strong style={{ color: 'var(--gold)' }}>JSON Database</strong>
              </div>
            </div>
          )}
        </div>

        {/* Action toast notification */}
        {actionMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 20px',
              background: 'rgba(201, 169, 110, 0.2)',
              border: '1px solid var(--gold)',
              borderRadius: '8px',
              color: 'var(--gold)',
              marginBottom: 20,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Check size={16} /> {actionMsg}
          </motion.div>
        )}

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: 10, border: '1px solid #282828' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Inquiries</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-light)', marginTop: 4 }}>{stats.total}</div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: 10, border: '1px solid #282828' }}>
            <span style={{ fontSize: '0.8rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 1 }}>New Leads</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#60a5fa', marginTop: 4 }}>{stats.newCount}</div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: 10, border: '1px solid #282828' }}>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1 }}>Contacted</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginTop: 4 }}>{stats.contactedCount}</div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: 10, border: '1px solid #282828' }}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: 1 }}>Completed</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34d399', marginTop: 4 }}>{stats.completedCount}</div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All (${stats.total})` },
              { id: 'new', label: `New (${stats.newCount})` },
              { id: 'contacted', label: `Contacted (${stats.contactedCount})` },
              { id: 'completed', label: `Completed (${stats.completedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: filter === tab.id ? '1px solid var(--gold)' : '1px solid #333',
                  background: filter === tab.id ? 'var(--gold)' : 'var(--bg-card)',
                  color: filter === tab.id ? '#0a0a0a' : 'var(--text-light)',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '9px 12px 9px 36px',
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'var(--text-light)',
                fontSize: '0.85rem',
              }}
            />
          </div>
        </div>

        {/* Leads Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <p>Loading consultation inquiries from backend...</p>
          </div>
        ) : error ? (
          <div
            style={{
              padding: '28px',
              textAlign: 'center',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 12,
              color: '#fca5a5',
            }}
          >
            <AlertTriangle size={32} style={{ margin: '0 auto 12px', color: '#ef4444' }} />
            <h3>Failed to load consultation leads</h3>
            <p style={{ margin: '8px 0 16px', fontSize: '0.9rem' }}>{error}</p>
            <button onClick={fetchLeads} className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Retry Connection
            </button>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              background: 'var(--bg-card)',
              borderRadius: 12,
              border: '1px dashed #333',
            }}
          >
            <Layers size={40} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
            <h3 style={{ color: 'var(--text-light)', marginBottom: 8 }}>No Consultations Found</h3>
            <p style={{ color: 'var(--text-muted-light)', fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 20px' }}>
              {search ? 'No inquiries matched your search criteria.' : 'No consultation requests in this category yet.'}
            </p>
            <button onClick={sendTestLead} className="btn-gold" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
              Create a Test Lead
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredLeads.map(lead => (
              <motion.div
                key={lead.id}
                layout
                style={{
                  background: 'var(--bg-card)',
                  border: lead.status === 'new' ? '1px solid rgba(96, 165, 250, 0.5)' : '1px solid #2a2a2a',
                  borderRadius: 12,
                  padding: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-light)' }}>{lead.name}</h3>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background:
                            lead.status === 'new'
                              ? 'rgba(96, 165, 250, 0.15)'
                              : lead.status === 'contacted'
                              ? 'rgba(251, 191, 36, 0.15)'
                              : 'rgba(52, 211, 153, 0.15)',
                          color:
                            lead.status === 'new'
                              ? '#60a5fa'
                              : lead.status === 'contacted'
                              ? '#fbbf24'
                              : '#34d399',
                          border:
                            lead.status === 'new'
                              ? '1px solid rgba(96, 165, 250, 0.4)'
                              : lead.status === 'contacted'
                              ? '1px solid rgba(251, 191, 36, 0.4)'
                              : '1px solid rgba(52, 211, 153, 0.4)',
                        }}
                      >
                        {lead.status}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: 'rgba(201, 169, 110, 0.15)',
                          color: 'var(--gold)',
                          border: '1px solid rgba(201, 169, 110, 0.3)',
                        }}
                      >
                        {lead.service || 'Home Interior'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, color: 'var(--text-muted-light)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Calendar size={14} /> {lead.formattedDate || new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#93c5fd', textDecoration: 'none' }}
                        >
                          <Phone size={14} /> {lead.phone}
                        </a>
                      )}
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#93c5fd', textDecoration: 'none' }}
                        >
                          <Mail size={14} /> {lead.email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {lead.phone && (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hi ${lead.name}, thank you for contacting Reyansh Studio regarding ${lead.service || 'Interior Services'}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.8rem',
                          padding: '8px 14px',
                          color: '#25D366',
                          borderColor: '#25D366',
                          textDecoration: 'none',
                          minHeight: 38,
                          borderRadius: 6,
                        }}
                      >
                        <MessageSquare size={14} /> WhatsApp
                      </a>
                    )}

                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      style={{
                        padding: '8px 12px',
                        background: '#1c1c1f',
                        border: '1px solid #444',
                        borderRadius: 6,
                        color: 'var(--text-light)',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        minHeight: 38,
                      }}
                    >
                      <option value="new">Mark New</option>
                      <option value="contacted">Mark Contacted</option>
                      <option value="completed">Mark Completed</option>
                    </select>

                    <button
                      onClick={() => deleteLead(lead.id, lead.name)}
                      aria-label="Delete Lead"
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 38,
                        minHeight: 38,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Attached Photo Preview if available */}
                {(lead.photo_filename || lead.product_title) && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      background: 'rgba(201, 169, 110, 0.08)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  >
                    {lead.photo_filename && (
                      <img
                        src={`/assets/${lead.photo_filename}`}
                        alt={lead.product_title || 'Design reference'}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 6,
                          objectFit: 'cover',
                          border: '1px solid var(--border-gold)',
                        }}
                      />
                    )}
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1 }}>
                        Attached Design Reference
                      </span>
                      <h4 style={{ margin: '2px 0 0', fontSize: '0.95rem', color: '#fff' }}>
                        {lead.product_title || lead.photo_filename}
                      </h4>
                    </div>
                  </div>
                )}

                {/* Message Body */}
                <div
                  style={{
                    background: '#121214',
                    border: '1px solid #242428',
                    borderRadius: 8,
                    padding: '12px 16px',
                    fontSize: '0.9rem',
                    color: 'var(--text-light)',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: 'var(--gold)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
                    Client Inquiry:
                  </strong>
                  {lead.message}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
