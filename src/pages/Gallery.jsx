import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, MessageSquare, Sparkles, Filter, Mail, Camera, Plus, Trash2, Upload, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import PhotoEnquiryModal from '../components/PhotoEnquiryModal'
import AddPhotoModal from '../components/AddPhotoModal'
import { useAuth } from '../context/AuthContext'

// Core assets
import imgLiving from '../assets/project-living.png'
import imgSofa from '../assets/project-sofa.png'
import imgBedroom from '../assets/project-bedroom.png'
import imgKitchen from '../assets/project-kitchen.png'
import imgOffice from '../assets/project-office.png'
import imgHero from '../assets/hero-bg.png'
import imgAbout from '../assets/about-showroom.png'

// New client workshop & custom sofa showcase photos
import imgSofaCumBed from '../assets/gallery-sofacumbed-rose.jpg'
import imgFlutedBlush from '../assets/gallery-fluted-blush-sofa.jpg'
import imgTealRibbed from '../assets/gallery-teal-ribbed-sofa.jpg'
import imgTealTub from '../assets/gallery-teal-tub-armchair.jpg'
import imgMustardAccent from '../assets/gallery-mustard-accent-chair.jpg'

// Master bedroom, modular wardrobe & solid walnut dining suite showcase photos
import imgBedroomCove from '../assets/gallery-bedroom-cove-ceiling.jpg'
import imgSlidingWardrobe from '../assets/gallery-sliding-wardrobe-lofts.jpg'
import imgBedroomStudy from '../assets/gallery-bedroom-study-suite.jpg'
import imgDiningWalnut6 from '../assets/gallery-dining-walnut-6seater.jpg'
import imgDiningCapsule from '../assets/gallery-dining-oval-capsule.jpg'

const galleryData = [
  {
    id: 1,
    image: imgSofaCumBed,
    filename: 'gallery-sofacumbed-rose.jpg',
    title: 'Convertible Sofa-cum-Bed & Ottoman',
    category: 'Custom Sofas',
    tag: 'Workshop & Living Suite',
    desc: 'Handcrafted dusty rose 3-seater pull-out sofa bed with high-density comfort foam, workshop-tested framing, and matching glass-top fluted ottoman.',
  },
  {
    id: 2,
    image: imgFlutedBlush,
    filename: 'gallery-fluted-blush-sofa.jpg',
    title: 'Curved Fluted Channel Sofa',
    category: 'Custom Sofas',
    tag: 'Signature Living',
    desc: 'Luxury blush pink velvet curved sofa with vertical channel tufting and gold brass ball feet. Designed for modern luxury interiors.',
  },
  {
    id: 3,
    image: imgTealRibbed,
    filename: 'gallery-teal-ribbed-sofa.jpg',
    title: 'Signature Teal Ribbed Luxury Sofa',
    category: 'Custom Sofas',
    tag: 'Luxury Collection',
    desc: 'Deep peacock teal sofa with vertical channel quilting, plush cushion filling, and polished brass hairpin legs.',
  },
  {
    id: 4,
    image: imgTealTub,
    filename: 'gallery-teal-tub-armchair.jpg',
    title: 'Peacock Velvet Barrel Tub Armchair',
    category: 'Accent Chairs',
    tag: 'Bespoke Seating',
    desc: 'Channel-tufted curved barrel club chair upholstered in vibrant teal velvet with metallic gold profile trim and tapered gold brass legs.',
  },
  {
    id: 5,
    image: imgMustardAccent,
    filename: 'gallery-mustard-accent-chair.jpg',
    title: 'Scandinavian Mustard Wingback Chair',
    category: 'Accent Chairs',
    tag: 'Accent Piece',
    desc: 'Mid-century modern accent armchair upholstered in rich ochre yellow velvet with tapered natural wood legs and designer graphic pillow.',
  },
  {
    id: 6,
    image: imgLiving,
    filename: 'project-living.png',
    title: 'The Royal Living Room',
    category: 'Living Room',
    tag: 'Turnkey Residential',
    desc: 'Complete living room interior with custom brass fluting, LED cove ceiling lighting, and Italian marble TV backdrop.',
  },
  {
    id: 7,
    image: imgSofa,
    filename: 'project-sofa.png',
    title: 'Sapphire Living Room Suite',
    category: 'Custom Sofas',
    tag: 'Deep Comfort',
    desc: 'Deep royal blue custom sofa collection engineered with heavy-duty hardwood structure and stain-resistant velvet fabric.',
  },
  {
    id: 8,
    image: imgBedroom,
    filename: 'project-bedroom.png',
    title: 'Emerald Suite Master Bedroom',
    category: 'Bedrooms',
    tag: 'Luxury Bedroom',
    desc: 'Bespoke bedroom interior featuring an integrated acoustic velvet headboard, matching side consoles, and ambient illumination.',
  },
  {
    id: 9,
    image: imgKitchen,
    filename: 'project-kitchen.png',
    title: 'Modern Quartz & Fluted Glass Kitchen',
    category: 'Kitchens',
    tag: 'Modular Kitchen',
    desc: 'Premium dual-tone modular kitchen featuring glossy overhead cabinetry, amber fluted glass showcase with warm cove lighting, quartz countertops, and marble backsplash.',
  },
  {
    id: 10,
    image: imgOffice,
    filename: 'project-office.png',
    title: 'Modern L-Shaped Modular Kitchen',
    category: 'Kitchens',
    tag: 'Modular Kitchen',
    desc: 'Contemporary L-shaped kitchen layout featuring glossy taupe acrylic cabinets, integrated chimney, stainless sink, and quartz countertop.',
  },
  {
    id: 11,
    image: imgHero,
    filename: 'hero-bg.png',
    title: 'Contemporary Open-Concept Residence',
    category: 'Living Room',
    tag: 'Architectural Design',
    desc: 'Harmonious open living and dining area blending warm natural oak, metallic accents, and tailored soft furnishings.',
  },
  {
    id: 12,
    image: imgAbout,
    filename: 'about-showroom.png',
    title: 'Reyansh Furniture Workshop & Atelier',
    category: 'Custom Sofas',
    tag: 'Craftsmanship',
    desc: 'A peek into our Pune manufacturing atelier — where precision woodworking, high-resilience foam cutting, and custom tailoring come to life.',
  },
  {
    id: 13,
    image: imgBedroomCove,
    filename: 'gallery-bedroom-cove-ceiling.jpg',
    title: 'Contemporary Bedroom Suite & Geometric Cove Ceiling',
    category: 'Bedrooms',
    tag: 'Master Bedroom Suite',
    desc: 'Master bedroom suite featuring a fluted panel headboard, ambient warm LED cove false ceiling, integrated storage bed, and matching bedside console.',
  },
  {
    id: 14,
    image: imgSlidingWardrobe,
    filename: 'gallery-sliding-wardrobe-lofts.jpg',
    title: 'Dual-Tone Sliding Modular Wardrobe & Lofts',
    category: 'Bedrooms',
    tag: 'Modular Storage',
    desc: 'Sleek dual-tone white and slate grey sliding modular wardrobe with vertical fluted panel accents, ceiling-high storage lofts, and en-suite entryway framing.',
  },
  {
    id: 15,
    image: imgBedroomStudy,
    filename: 'gallery-bedroom-study-suite.jpg',
    title: 'Master Bedroom Suite with Integrated Floating Study',
    category: 'Bedrooms',
    tag: 'Turnkey Bedroom',
    desc: 'Complete master bedroom suite featuring a floating study desk with dual drawers, warm LED illuminated display shelving, fluted headboard, and ambient cove lighting.',
  },
  {
    id: 16,
    image: imgDiningWalnut6,
    filename: 'gallery-dining-walnut-6seater.jpg',
    title: 'Handcrafted Solid Walnut 6-Seater Dining Suite',
    category: 'Dining',
    tag: 'Dining Suite',
    desc: 'Solid natural walnut dining table featuring rounded edge profiling, tapered curved hardwood armchairs, and premium stain-resistant cream upholstered cushions.',
  },
  {
    id: 17,
    image: imgDiningCapsule,
    filename: 'gallery-dining-oval-capsule.jpg',
    title: 'Minimalist Capsule Walnut Dining Set',
    category: 'Dining',
    tag: 'Bespoke Dining',
    desc: 'Modern capsule-shaped oval dining table crafted in rich American walnut with sculptured trestle base and ergonomic curved dining chairs with padded seating.',
  },
]

const BASE_CATEGORIES = ['All', 'Custom Sofas', 'Accent Chairs', 'Living Room', 'Bedrooms', 'Dining', 'Kitchens']

export default function Gallery() {
  const { isAdmin } = useAuth()
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const [enquiryModalItem, setEnquiryModalItem] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [customPhotos, setCustomPhotos] = useState([])
  const [toastMessage, setToastMessage] = useState('')

  // Load custom uploaded photos from localStorage and backend API
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('reyansh_custom_gallery') || '[]')
      if (Array.isArray(saved) && saved.length > 0) {
        setCustomPhotos(saved)
      }
    } catch (e) {
      console.warn('Error reading custom gallery from localStorage:', e)
    }

    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.items)) {
          setCustomPhotos(data.items)
          localStorage.setItem('reyansh_custom_gallery', JSON.stringify(data.items))
        }
      })
      .catch(err => {
        console.warn('Backend gallery endpoint not reachable, running in offline mode:', err)
      })
  }, [])

  // Combine custom uploaded photos first, then default curated photos
  const allPhotos = [...customPhotos, ...galleryData]

  // Compute dynamic categories (base categories + any new custom category created by user)
  const extraCategories = [
    ...new Set(
      customPhotos
        .map(p => p.category)
        .filter(c => c && !BASE_CATEGORIES.includes(c))
    ),
  ]
  const categories = [...BASE_CATEGORIES, ...extraCategories]

  const filteredImages = filter === 'All' ? allPhotos : allPhotos.filter(item => item.category === filter)

  // Handle new photo added from modal
  const handlePhotoAdded = newItem => {
    setCustomPhotos(prev => [newItem, ...prev.filter(p => p.id !== newItem.id)])
    setFilter(newItem.category || 'All')
    setToastMessage(`✨ "${newItem.title}" added to gallery!`)
    setTimeout(() => setToastMessage(''), 4000)
  }

  // Handle deletion of custom uploaded photo
  const handleDeleteCustomPhoto = async (item, e) => {
    if (e) e.stopPropagation()
    if (!window.confirm(`Are you sure you want to remove "${item.title}" from the gallery?`)) {
      return
    }

    const updated = customPhotos.filter(p => p.id !== item.id)
    setCustomPhotos(updated)
    try {
      localStorage.setItem('reyansh_custom_gallery', JSON.stringify(updated))
    } catch (err) {}

    setLightbox(null)

    try {
      await fetch(`/api/gallery/${item.id}`, { method: 'DELETE' })
    } catch (err) {
      console.warn('Backend delete request failed:', err)
    }

    setToastMessage(`"${item.title}" removed from gallery.`)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = e => {
      if (lightbox === null) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') {
        setLightbox(curr => (curr - 1 + filteredImages.length) % filteredImages.length)
      }
      if (e.key === 'ArrowRight') {
        setLightbox(curr => (curr + 1) % filteredImages.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox, filteredImages.length])

  const currentItem = lightbox !== null ? filteredImages[lightbox] : null

  const prev = () => setLightbox(i => (i - 1 + filteredImages.length) % filteredImages.length)
  const next = () => setLightbox(i => (i + 1) % filteredImages.length)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Page Header with Add Photo CTA */}
      <div className="page-header">
        <span className="label">Visual Showcase & Portfolio</span>
        <h1>Our <span>Gallery</span></h1>
        <p>Explore handcrafted custom sofas, luxury armchairs, and bespoke turnkey interior creations</p>

        {/* Add Photo Button in Header - Admin Only */}
        {isAdmin && (
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: '20px',
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid var(--border-gold)',
                color: 'var(--gold)',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <Shield size={14} /> Admin Mode Active &bull; Photo Upload Authorized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '11px 26px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, var(--gold), #d4af37)',
                  color: '#0a0a0a',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(212,175,55,0.5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,175,55,0.35)'
                }}
              >
                <Plus size={18} strokeWidth={2.6} /> Add Photo to Gallery
              </button>
              <Link
                to="/admin"
                className="btn-outline"
                style={{
                  fontSize: '0.82rem',
                  padding: '9px 18px',
                  textDecoration: 'none',
                  color: 'var(--text-light)',
                  borderRadius: 30,
                }}
              >
                Go to Admin Portal &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>

      <section className="section section-dark">
        <div className="container">
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 40,
            }}
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat)
                  setLightbox(null)
                }}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                style={{
                  padding: '9px 20px',
                  borderRadius: '24px',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: filter === cat ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                  background: filter === cat ? 'var(--gold)' : 'var(--bg-card)',
                  color: filter === cat ? '#0a0a0a' : 'var(--text-light)',
                  transition: 'all 0.25s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count label & Add Photo quick button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredImages.length}</strong> photo{filteredImages.length === 1 ? '' : 's'} in <strong>{filter}</strong>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={14} /> Click any photo for details & high-res view
              </span>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 15px',
                    borderRadius: '20px',
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid var(--gold)',
                    color: 'var(--gold)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--gold)'
                    e.currentTarget.style.color = '#0a0a0a'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.12)'
                    e.currentTarget.style.color = 'var(--gold)'
                  }}
                >
                  <Plus size={14} strokeWidth={2.5} /> Add Photo
                </button>
              )}
            </div>
          </div>

          {/* Gallery Grid */}
          <motion.div className="gallery-grid" layout>
            {filteredImages.map((item, i) => (
              <motion.div
                className="gallery-item"
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.06 }}
                onClick={() => setLightbox(i)}
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />

                {/* Custom upload indicator badge */}
                {item.isCustom && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'var(--gold)',
                      color: '#0a0a0a',
                      borderRadius: 4,
                      padding: '3px 8px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      zIndex: 3,
                    }}
                  >
                    ADDED DESIGN
                  </div>
                )}

                {/* Always visible bottom badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                    padding: '24px 16px 12px',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>
                    {item.tag}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: 0, fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    {item.title}
                  </h4>
                </div>

                {/* Hover overlay with zoom icon, quick enquiry and delete button */}
                <div className="g-overlay">
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div
                      style={{
                        background: 'rgba(10, 10, 10, 0.75)',
                        borderRadius: '50%',
                        padding: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--gold)',
                      }}
                      title="View High-Res Photo"
                    >
                      <ZoomIn size={20} color="var(--gold)" />
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        setEnquiryModalItem(item)
                      }}
                      style={{
                        background: 'var(--gold)',
                        color: '#0a0a0a',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '7px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                      }}
                      title="Send enquiry with this photo"
                    >
                      <Mail size={13} /> Enquire
                    </button>

                    {item.isCustom && isAdmin && (
                      <button
                        type="button"
                        onClick={e => handleDeleteCustomPhoto(item, e)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '7px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        }}
                        title="Delete photo from gallery"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Lightbox Modal */}
      <AnimatePresence>
        {currentItem !== null && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 3000,
              background: 'rgba(5, 5, 5, 0.94)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            {/* Top Bar with Counter and Close Button */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 24,
                right: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 3010,
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: 1 }}>
                {lightbox + 1} / {filteredImages.length}
              </div>

              <button
                className="close-btn"
                onClick={() => setLightbox(null)}
                aria-label="Close Lightbox"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Prev / Next Navigation Buttons */}
            <button
              className="nav-btn prev"
              onClick={e => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Previous Image"
              style={{
                position: 'absolute',
                left: 24,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 3010,
              }}
            >
              <ChevronLeft size={26} />
            </button>

            <button
              className="nav-btn next"
              onClick={e => {
                e.stopPropagation()
                next()
              }}
              aria-label="Next Image"
              style={{
                position: 'absolute',
                right: 24,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 3010,
              }}
            >
              <ChevronRight size={26} />
            </button>

            {/* Main Image Container */}
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '900px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxHeight: '90vh',
              }}
            >
              <div
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--border-gold)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                  background: '#0e0e11',
                  maxHeight: '68vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '68vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              {/* Caption and Inquire Button */}
              <div
                style={{
                  marginTop: 16,
                  background: 'rgba(18, 19, 22, 0.95)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14,
                }}
              >
                <div style={{ maxWidth: 560 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        background: 'rgba(201, 169, 110, 0.15)',
                        color: 'var(--gold)',
                        borderRadius: 6,
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {currentItem.category}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                      {currentItem.title}
                    </h3>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted-light)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {currentItem.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setEnquiryModalItem(currentItem)}
                    className="btn-gold"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.85rem',
                      padding: '9px 18px',
                      background: 'var(--gold)',
                      borderColor: 'var(--gold)',
                      color: '#0a0a0a',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: 6,
                      boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
                    }}
                  >
                    <Mail size={16} /> Send Enquiry with Photo
                  </button>

                  <a
                    href={`https://wa.me/917887556060?text=${encodeURIComponent(
                      `Hi Reyansh Studio! 🛋️\n\nI'm inquiring about this design from your gallery:\n📌 *Product:* ${currentItem.title}\n📁 *Category:* ${currentItem.category}\n📝 *Details:* ${currentItem.desc}\n📸 *Photo:* ${typeof window !== 'undefined' ? `${window.location.origin}/assets/${currentItem.filename}` : ''}\n\nPlease share pricing, fabric options, and custom dimensions.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.85rem',
                      padding: '9px 18px',
                      textDecoration: 'none',
                      background: '#25D366',
                      borderColor: '#25D366',
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: 6,
                    }}
                  >
                    <MessageSquare size={16} /> Inquire on WhatsApp
                  </a>

                  {currentItem.isCustom && isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomPhoto(currentItem)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '0.85rem',
                        padding: '9px 16px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fca5a5',
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderRadius: 6,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'
                        e.currentTarget.style.color = '#fca5a5'
                      }}
                      title="Remove this photo from gallery"
                    >
                      <Trash2 size={15} /> Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated Enquiry with Photo Modal */}
      <PhotoEnquiryModal
        item={enquiryModalItem}
        isOpen={Boolean(enquiryModalItem)}
        onClose={() => setEnquiryModalItem(null)}
      />

      {/* Add Photo to Gallery Modal (Admin Only) */}
      {isAdmin && (
        <AddPhotoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onPhotoAdded={handlePhotoAdded}
        />
      )}

      {/* Luxury Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: 28,
              right: 28,
              zIndex: 9999,
              background: 'rgba(18, 19, 22, 0.96)',
              border: '1px solid var(--gold)',
              color: '#fff',
              borderRadius: 12,
              padding: '14px 22px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.65), 0 0 20px rgba(212,175,55,0.2)',
              fontSize: '0.92rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Sparkles size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
