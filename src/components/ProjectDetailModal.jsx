import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ArrowLeft, MessageSquare, Phone, Trash2, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ProjectDetailModal({ project, isOpen, onClose, onDeleteCustomPhoto, isAdmin = false }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const overlayRef = useRef(null)
  const closeBtnRef = useRef(null)
  const touchStartX = useRef(null)
  const activeIdxRef = useRef(0)
  const galleryLenRef = useRef(0)
  const zoomedRef = useRef(false)

  useEffect(() => { activeIdxRef.current = activeIdx }, [activeIdx])
  useEffect(() => { zoomedRef.current = zoomed }, [zoomed])
  useEffect(() => {
    if (project?.gallery?.length) galleryLenRef.current = project.gallery.length
    else galleryLenRef.current = project?.image ? 1 : 0
  }, [project])

  useEffect(() => {
    setActiveIdx(0)
    setZoomed(false)
    setImgLoaded(false)
    setImgFailed(false)
  }, [project])

  useEffect(() => {
    setImgLoaded(false)
    setImgFailed(false)
  }, [activeIdx])

  const goPrev = useCallback(() => {
    const len = galleryLenRef.current || 1
    setActiveIdx((i) => (i - 1 + len) % len)
    setZoomed(false)
  }, [])

  const goNext = useCallback(() => {
    const len = galleryLenRef.current || 1
    setActiveIdx((i) => (i + 1) % len)
    setZoomed(false)
  }, [])

  useEffect(() => {
    if (!isOpen || !project) return

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (zoomedRef.current) {
          setZoomed(false)
          return
        }
        onClose()
      }
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50)

    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, project, onClose, goPrev, goNext])

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 50) return
    if (dx > 0) goPrev()
    else goNext()
  }

  const handleContactClick = () => {
    if (!project) return
    try {
      sessionStorage.setItem('reyansh_enquiry_project', project.title)
    } catch {
      /* ignore */
    }
    onClose()
    navigate('/contact', { state: { projectName: project.title } })
  }

  const gallery = project?.gallery?.length ? project.gallery : project?.image ? [project.image] : []
  const totalImages = gallery.length
  const activeImg = gallery[activeIdx] || project?.image
  const duration = reduceMotion ? 0 : 0.25

  const descriptionText = project?.description || project?.desc || ''
  const designStyleText = project?.designStyle || project?.style || ''
  const materialsText = project?.materials || project?.upholstery || ''
  const customizationText = project?.customization || ''

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="pdm-overlay"
          key="pdm-overlay"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdm-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          onClick={onClose}
        >
          <motion.div
            className="pdm-container"
            key="pdm-container"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.97 }}
            transition={{ duration }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="pdm-header">
              <button type="button" className="pdm-back-btn" onClick={onClose} aria-label="Back to collection">
                <ArrowLeft size={15} />
                Back to Showcase
              </button>
              <button
                type="button"
                className="pdm-close-btn"
                ref={closeBtnRef}
                onClick={onClose}
                aria-label="Close project details"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Left Media Column + Right Info Column */}
            <div className="pdm-body">
              {/* Media Column: Main Image Viewer + Thumbnails Below */}
              <div className="pdm-media-column">
                <div
                  className="pdm-main-viewer"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className="pdm-img-wrap"
                    onClick={() => setZoomed((z) => !z)}
                    style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
                    title={zoomed ? 'Click to zoom out' : 'Click to zoom in'}
                  >
                    {!imgLoaded && !imgFailed && (
                      <div className="pdm-img-skeleton" aria-hidden="true">Loading image…</div>
                    )}
                    {imgFailed ? (
                      <div className="pdm-img-fallback" role="img" aria-label={`${project.title} image unavailable`}>
                        Image unavailable
                      </div>
                    ) : (
                      <img
                        key={activeImg}
                        src={activeImg}
                        alt={`${project.title} — view ${activeIdx + 1} of ${totalImages}`}
                        className="pdm-main-img"
                        draggable={false}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => { setImgFailed(true); setImgLoaded(true) }}
                        style={{
                          opacity: imgLoaded ? 1 : 0,
                          transform: zoomed ? 'scale(1.8)' : 'scale(1)',
                          transition: reduceMotion ? 'none' : 'transform 0.3s ease, opacity 0.25s ease',
                        }}
                      />
                    )}
                  </div>

                  {totalImages > 1 && (
                    <>
                      <button
                        type="button"
                        className="pdm-nav pdm-nav-prev"
                        onClick={(e) => { e.stopPropagation(); goPrev() }}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        className="pdm-nav pdm-nav-next"
                        onClick={(e) => { e.stopPropagation(); goNext() }}
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="pdm-img-counter" aria-live="polite">
                        {activeIdx + 1} / {totalImages}
                      </div>
                    </>
                  )}
                  <div className="pdm-zoom-hint">
                    {zoomed ? 'Click to zoom out' : 'Click to zoom in'}
                  </div>
                </div>

                {/* Additional project images thumbnails displayed below main image (Only when totalImages > 1) */}
                {totalImages > 1 && (
                  <div className="pdm-thumbs-container">
                    <span className="pdm-thumbs-label">Additional Project Views ({totalImages} photos)</span>
                    <div className="pdm-thumbs" role="list">
                      {gallery.map((img, i) => (
                        <button
                          type="button"
                          key={i}
                          className={`pdm-thumb${i === activeIdx ? ' active' : ''}`}
                          onClick={() => { setActiveIdx(i); setZoomed(false) }}
                          aria-label={`View photo ${i + 1} of ${totalImages}`}
                          aria-current={i === activeIdx ? 'true' : undefined}
                        >
                          <img src={img} alt="" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Furniture Information Column */}
              <div className="pdm-info">
                {project.category && (
                  <span className="pdm-category">{project.category}</span>
                )}
                <h2 id="pdm-title" className="pdm-title">{project.title}</h2>
                
                {descriptionText && (
                  <p className="pdm-description">{descriptionText}</p>
                )}

                {/* Furniture Design and Style (only when known) */}
                {designStyleText && (
                  <div className="pdm-details">
                    <h3 className="pdm-details-heading">Furniture Design &amp; Style</h3>
                    <p className="pdm-detail-text">{designStyleText}</p>
                  </div>
                )}

                {/* Materials and Upholstery (only when known) */}
                {materialsText && (
                  <div className="pdm-details">
                    <h3 className="pdm-details-heading">Materials &amp; Upholstery</h3>
                    <p className="pdm-detail-text">{materialsText}</p>
                  </div>
                )}

                {/* Design Highlights (if available) */}
                {project.highlights?.length > 0 && (
                  <div className="pdm-details">
                    <h3 className="pdm-details-heading">Design Highlights</h3>
                    <ul className="pdm-highlights">
                      {project.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Customization Options (if applicable) */}
                {customizationText && (
                  <div className="pdm-details">
                    <h3 className="pdm-details-heading">Customization Options</h3>
                    <p className="pdm-detail-text">{customizationText}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pdm-actions">
                  <button
                    type="button"
                    className="pdm-contact-btn"
                    onClick={handleContactClick}
                  >
                    <MessageSquare size={16} />
                    Contact Us About This Project
                  </button>

                  <a
                    href={`https://wa.me/917887556060?text=${encodeURIComponent(
                      `Hi Reyansh Studio! I would like to enquire about "${project.title}" (${project.category || 'Custom Furniture'}). Please share pricing, fabric choices, and custom dimensions.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdm-whatsapp-btn"
                  >
                    <Phone size={15} />
                    Enquire on WhatsApp
                  </a>

                  {project.isCustom && isAdmin && onDeleteCustomPhoto && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustomPhoto(project)}
                      className="pdm-delete-btn"
                      title="Delete this custom photo from the gallery"
                    >
                      <Trash2 size={14} />
                      Remove from Gallery (Admin)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
