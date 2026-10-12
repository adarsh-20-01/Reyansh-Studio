import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MessageSquare, Phone, Mail, CheckCircle, Camera, ArrowRight } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import ServiceDetailModal from '../components/ServiceDetailModal'
import ContactForm from '../components/ContactForm'
import CTASection from '../components/CTASection'
import { servicesData } from '../data/servicesData'

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)
  const [activePortalService, setActivePortalService] = useState(servicesData[1]) // Default: Custom Sofa

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Page Header */}
      <div className="page-header">
        <span className="label">Bespoke Craftsmanship & Turnkey Interiors</span>
        <h1>Our <span>Services</span></h1>
        <p>Explore custom sofas, modular kitchens, turnkey home interiors, and designer furniture</p>
      </div>

      {/* Services Grid Section */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} /> Click &quot;Learn More&quot; on any service to explore detailed specifications, real photos, and request a direct quote
            </span>
          </div>

          <div className="services-grid">
            {servicesData.map((s, i) => (
              <ServiceCard
                key={s.id}
                index={i}
                icon={s.icon}
                title={s.title}
                description={s.shortDescription}
                onClick={() => setSelectedService(s)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated On-Page Service Enquiry Portal Section */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(180deg, #0e0e11 0%, #13141a 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="label" style={{ color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 2 }}>
              Interactive Booking
            </span>
            <h2 style={{ fontSize: '2.2rem', margin: '8px 0 12px' }}>
              Service Consultation &amp; <span>Enquiry Portal</span>
            </h2>
            <p style={{ maxWidth: 650, margin: '0 auto', color: 'var(--text-muted-light)' }}>
              Select a service below to view completed project references and send a direct inquiry to Reyansh Studio.
            </p>
          </div>

          {/* Service Selector Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              justifyContent: 'center',
              marginBottom: 36,
            }}
          >
            {servicesData.map(s => {
              const isSelected = activePortalService.id === s.id
              const IconComp = s.icon
              return (
                <button
                  key={s.id}
                  onClick={() => setActivePortalService(s)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    borderRadius: '24px',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                    background: isSelected ? 'var(--gold)' : 'var(--bg-card)',
                    color: isSelected ? '#0a0a0a' : 'var(--text-light)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <IconComp size={16} />
                  {s.title}
                </button>
              )
            })}
          </div>

          {/* Two-Column Interactive Portal Grid */}
          <div className="service-portal-grid">
            {/* Left: Active Service Overview & Real Photos */}
            <div className="service-portal-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'rgba(201, 169, 110, 0.2)',
                    border: '1px solid var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                  }}
                >
                  <activePortalService.icon size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                    {activePortalService.title}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {activePortalService.category}
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted-light)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 20 }}>
                {activePortalService.shortDescription}
              </p>

              {/* Photo Showcase Carousel / Grid */}
              {activePortalService.photos && activePortalService.photos.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                      📸 Completed Project References
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {activePortalService.photos.length} photos
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                    {activePortalService.photos.slice(0, 4).map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: '#09090b',
                        }}
                      >
                        <div style={{ height: 85, overflow: 'hidden' }}>
                          <img
                            src={p.image}
                            alt={p.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '6px 8px', fontSize: '0.72rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action: Open Full Specs Modal */}
              <button
                type="button"
                onClick={() => setSelectedService(activePortalService)}
                className="btn-outline"
                style={{
                  width: '100%',
                  padding: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  borderColor: 'var(--gold)',
                  color: 'var(--gold)',
                }}
              >
                View Full {activePortalService.title} Specs &amp; Gallery <ArrowRight size={15} />
              </button>
            </div>

            {/* Right: Direct Enquiry Form */}
            <div>
              <div style={{ marginBottom: 16 }}>
                <span className="label" style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase' }}>
                  Fast Booking
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '4px 0 8px' }}>
                  Send Consultation Request
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Inquiring for <strong>{activePortalService.title}</strong>. Your message will be delivered directly to{' '}
                  <strong style={{ color: 'var(--gold)' }}>reyaneshstudio@gmail.com</strong>.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Service Detail & Interactive Enquiry Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
      />
    </motion.div>
  )
}
