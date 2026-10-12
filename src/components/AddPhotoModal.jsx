import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiUrl } from '../config/api'

const DEFAULT_CATEGORIES = [
  'Custom Sofas',
  'Accent Chairs',
  'Living Room',
  'Bedrooms',
  'Dining',
  'Kitchens',
]

export default function AddPhotoModal({ isOpen, onClose, onPhotoAdded }) {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('upload') // 'upload' | 'url'
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Custom Sofas')
  const [customCategory, setCustomCategory] = useState('')
  const [tag, setTag] = useState('')
  const [desc, setDesc] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fileInputRef = useRef(null)

  if (!isOpen || !isAdmin) return null

  const handleFileChange = file => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP).')
      return
    }
    setError('')
    setPhotoFile(file)

    const reader = new FileReader()
    reader.onload = e => {
      setPhotoPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = e => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = e => {
    e.preventDefault()
    setIsDragging(false)
  }

  const resetForm = () => {
    setPhotoFile(null)
    setPhotoPreview('')
    setPhotoUrl('')
    setTitle('')
    setCategory('Custom Sofas')
    setCustomCategory('')
    setTag('')
    setDesc('')
    setError('')
    setSuccess(false)
    setLoading(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return
    if (!isAdmin) {
      setError('Admin privileges required to upload photos.')
      return
    }
    setError('')

    const imageSource = activeTab === 'upload' ? photoPreview : photoUrl
    if (!imageSource) {
      setError('Please select an image file or provide a valid image URL.')
      return
    }

    if (!title.trim()) {
      setError('Please provide a title for the furniture design.')
      return
    }

    const finalCategory =
      category === '__custom__'
        ? customCategory.trim() || 'Custom Designs'
        : category

    const finalTag = tag.trim() || finalCategory || 'New Design'
    const finalDesc =
      desc.trim() ||
      `Handcrafted ${title.trim()} custom designed and executed by Reyansh Studio.`

    setLoading(true)

    try {
      let createdItem = null

      // Attempt backend API call
      try {
        if (activeTab === 'upload' && photoFile) {
          const formData = new FormData()
          formData.append('photo', photoFile)
          formData.append('title', title.trim())
          formData.append('category', finalCategory)
          formData.append('tag', finalTag)
          formData.append('desc', finalDesc)

          const res = await fetch(apiUrl('/api/gallery'), {
            method: 'POST',
            body: formData,
          })

          if (res.ok) {
            const data = await res.json()
            if (data.success && data.item) {
              createdItem = data.item
            }
          }
        } else {
          // JSON with Base64 / URL
          const res = await fetch(apiUrl('/api/gallery'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: title.trim(),
              category: finalCategory,
              tag: finalTag,
              desc: finalDesc,
              photo_data: photoPreview,
              photo_url: photoUrl.trim(),
            }),
          })

          if (res.ok) {
            const data = await res.json()
            if (data.success && data.item) {
              createdItem = data.item
            }
          }
        }
      } catch (backendErr) {
        console.warn('Backend upload fell back to local storage:', backendErr)
      }

      // If backend was not reached or returned error, fallback to rich local item
      if (!createdItem) {
        const fallbackId = `custom_${Date.now()}`
        createdItem = {
          id: fallbackId,
          image: imageSource,
          filename: photoFile ? photoFile.name : `custom_${Date.now()}.jpg`,
          title: title.trim(),
          category: finalCategory,
          tag: finalTag,
          desc: finalDesc,
          isCustom: true,
          createdAt: new Date().toISOString(),
        }
      }

      // Persist in localStorage for instant offline/dev synchronization
      try {
        const stored = JSON.parse(localStorage.getItem('reyansh_custom_gallery') || '[]')
        const updated = [createdItem, ...stored.filter(i => i.id !== createdItem.id)]
        localStorage.setItem('reyansh_custom_gallery', JSON.stringify(updated))
      } catch (err) {
        console.warn('Could not save to localStorage:', err)
      }

      setSuccess(true)
      if (onPhotoAdded) {
        onPhotoAdded(createdItem)
      }

      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch (err) {
      console.error(err)
      setError('Something went wrong while adding the photo. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div
        className="photo-modal-backdrop"
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: 16,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'linear-gradient(145deg, #161616 0%, #0d0d0d 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 16,
            width: '100%',
            maxWidth: 620,
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.1)',
            padding: '28px 26px',
            color: '#fff',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#bbb',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#bbb'
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            }}
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div style={{ marginBottom: 22, paddingRight: 32 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                color: 'var(--gold)',
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              <Sparkles size={14} /> Gallery Management
            </div>
            <h2 style={{ fontSize: '1.45rem', margin: 0, fontWeight: 600, color: '#fff' }}>
              Add Photo to <span style={{ color: 'var(--gold)' }}>Gallery</span>
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Upload your client workshop photos, newly crafted sofas, or project designs.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 16,
                fontSize: '0.85rem',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={16} flexShrink={0} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 16,
                fontSize: '0.9rem',
                color: '#86efac',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <CheckCircle size={20} />
              <span>Photo added to gallery successfully! Updating view...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Upload Method Tabs */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 16,
                background: 'rgba(255,255,255,0.04)',
                padding: 4,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload')
                  setError('')
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'upload' ? 'var(--gold)' : 'transparent',
                  color: activeTab === 'upload' ? '#0a0a0a' : 'var(--text-light)',
                  transition: 'all 0.2s',
                }}
              >
                <Upload size={15} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('url')
                  setError('')
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'url' ? 'var(--gold)' : 'transparent',
                  color: activeTab === 'url' ? '#0a0a0a' : 'var(--text-light)',
                  transition: 'all 0.2s',
                }}
              >
                <LinkIcon size={15} /> Photo URL
              </button>
            </div>

            {/* Image Selection Area */}
            {activeTab === 'upload' ? (
              <div style={{ marginBottom: 18 }}>
                {photoPreview ? (
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid rgba(212,175,55,0.4)',
                      background: '#000',
                      maxHeight: 240,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: 240,
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 8,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: 6,
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoFile(null)
                          setPhotoPreview('')
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.85)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Remove photo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: isDragging
                        ? '2px dashed var(--gold)'
                        : '2px dashed rgba(255,255,255,0.18)',
                      borderRadius: 12,
                      padding: '30px 20px',
                      textAlign: 'center',
                      background: isDragging
                        ? 'rgba(212,175,55,0.06)'
                        : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: 'rgba(212,175,55,0.1)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gold)',
                        marginBottom: 10,
                      }}
                    >
                      <Upload size={24} />
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#fff', marginBottom: 4 }}>
                      Click to choose photo or drag & drop here
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Supports JPG, PNG, WEBP (Recommended: landscape or portrait high-res)
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleFileChange(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  Direct Image URL
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="url"
                    placeholder="https://example.com/furniture-design.jpg"
                    value={photoUrl}
                    onChange={e => {
                      setPhotoUrl(e.target.value)
                      setError('')
                    }}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
                {photoUrl && (
                  <div
                    style={{
                      marginTop: 10,
                      borderRadius: 8,
                      overflow: 'hidden',
                      maxHeight: 180,
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={photoUrl}
                      alt="URL Preview"
                      style={{ maxHeight: 180, width: '100%', objectFit: 'contain' }}
                      onError={() => setError('Could not load image from this URL. Please verify the link.')}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Design Title */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Design / Product Title <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Emerald 3-Seater Velvet Sofa"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category Dropdown & Custom Category Input */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: category === '__custom__' ? '1fr 1fr' : '1fr',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {DEFAULT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Add Custom Category...</option>
                </select>
              </div>

              {category === '__custom__' && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginBottom: 6,
                      fontWeight: 500,
                    }}
                  >
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wardrobes, Balcony"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Badge / Tag */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Tag / Badge <span style={{ fontSize: '0.75rem', color: '#888' }}>(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Signature Collection, Handcrafted Teak, New Arrival"
                value={tag}
                onChange={e => setTag(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Description <span style={{ fontSize: '0.75rem', color: '#888' }}>(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe material specifications, dimensions, comfort foam, and custom fabric choices..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 18,
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '10px 20px',
                  color: 'var(--text-light)',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, var(--gold), #d4af37)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 24px',
                  color: '#0a0a0a',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: loading || success ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(212,175,55,0.35)',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin" /> Adding Photo...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Add to Gallery
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
