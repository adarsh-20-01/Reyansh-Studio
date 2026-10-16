import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ArrowLeft, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ProjectDetailModal({ project, isOpen, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const navigate = useNavigate()

  // Reset state on project change
  useEffect(() => {
    setActiveIdx(0)
    setZoomed(false)
  }, [project])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !project) return
    const handleKey = (e) => {
      if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose() }
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, project, zoomed, activeIdx])

  const prev = useCallback(() => {
    if (!project) return
    setActiveIdx(i => (i - 1 + project.gallery.length) % project.gallery.length)
    setZoomed(false)
  }, [project])

  const next = useCallback(() => {
    if (!project) return
    setActiveIdx(i => (i + 1) % project.gallery.length)
    setZoomed(false)
  }, [project])

  if (!isOpen || !project) return null

  const activeImg = project.gallery[activeIdx]

  return (
    <AnimatePresence>
      <motion.div
        className="pdm-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <motion.div
          className="pdm-container"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header bar */}
          <div className="pdm-header">
            <button className="pdm-back-btn" onClick={onClose} aria-label="Back to Projects">
              <ArrowLeft size={16} />
              Back to Projects
            </button>
            <button className="pdm-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="pdm-body">
            {/* Main image viewer */}
            <div className="pdm-main-viewer">
              <div
                className="pdm-img-wrap"
                onClick={() => setZoomed(z => !z)}
                style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
              >
                <img
                  src={activeImg}
                  alt={project.title}
                  className="pdm-main-img"
                  draggable={false}
                  style={{
                    transform: zoomed ? 'scale(2)' : 'scale(1)',
                    transition: 'transform 0.35s ease',
                  }}
                />
              </div>

              {/* Prev / Next arrows */}
              {project.gallery.length > 1 && (
                <>
                  <button className="pdm-nav pdm-nav-prev" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Previous image">
                    <ChevronLeft size={22} />
                  </button>
                  <button className="pdm-nav pdm-nav-next" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Next image">
                    <ChevronRight size={22} />
                  </button>
                  <div className="pdm-img-counter">{activeIdx + 1} / {project.gallery.length}</div>
                </>
              )}
              <div className="pdm-zoom-hint">Click image to {zoomed ? 'zoom out' : 'zoom in'}</div>
            </div>

            {/* Info + thumbnail strip */}
            <div className="pdm-info">
              <span className="pdm-category">{project.category}</span>
              <h2 className="pdm-title">{project.title}</h2>
              <p className="pdm-description">{project.description}</p>

              {/* Thumbnail gallery */}
              {project.gallery.length > 1 && (
                <div className="pdm-thumbs">
                  {project.gallery.map((img, i) => (
                    <button
                      key={i}
                      className={`pdm-thumb ${i === activeIdx ? 'active' : ''}`}
                      onClick={() => { setActiveIdx(i); setZoomed(false) }}
                      aria-label={`View photo ${i + 1}`}
                    >
                      <img src={img} alt={`${project.title} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="pdm-actions">
                <button
                  className="pdm-contact-btn"
                  onClick={() => { onClose(); navigate('/contact') }}
                >
                  <MessageSquare size={16} />
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
