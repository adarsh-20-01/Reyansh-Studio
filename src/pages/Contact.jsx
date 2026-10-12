import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Globe, MessageSquare, QrCode, ExternalLink } from 'lucide-react'
import ContactForm from '../components/ContactForm'
import cardFront from '../assets/visiting-card-front.png'
import cardBack from '../assets/visiting-card-back.png'

const GOOGLE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/18.4416735,73.8690576/REYANSH+STUDIO,+Yewalewadi,+TILAKER+NAGER,+Kondhwa+Budruk,+Pune,+Maharashtra+411048/@18.4458178,73.8651758,15z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3bc2ebee32ac5f73:0x271d6320ebfc173c!2m2!1d73.8864756!2d18.4404281?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D'

const contactDetails = [
  {
    icon: Phone,
    title: 'Call Us (Mobile)',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <a href="tel:+917887556060" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 500 }}>
          +91 78875 56060
        </a>
        <a href="tel:+919404466587" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 500 }}>
          +91 94044 66587
        </a>
      </div>
    ),
  },
  {
    icon: Mail,
    title: 'Email Address',
    content: (
      <a href="mailto:reyaneshstudio@gmail.com" style={{ color: 'var(--text-light)', textDecoration: 'none', wordBreak: 'break-all' }}>
        reyaneshstudio@gmail.com
      </a>
    ),
  },
  {
    icon: Globe,
    title: 'Official Website',
    content: (
      <a href="https://www.reyanshstudio.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
        www.reyanshstudio.com
      </a>
    ),
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Connect',
    content: (
      <a
        href="https://wa.me/917887556060?text=Hi%20Reyansh%20Studio!%20I%20would%20like%20to%20book%20a%20consultation."
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        Chat on +91 7887556060
      </a>
    ),
  },
  {
    icon: MapPin,
    title: 'Studio Location',
    content: (
      <div>
        <a
          href={GOOGLE_MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--text-light)',
            textDecoration: 'none',
            display: 'block',
            lineHeight: 1.5,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-light)')}
          title="Open in Google Maps"
        >
          Reyansh Studio Tilekar Nagar, Pune, Maharashtra, India 411048
        </a>
        <a
          href={GOOGLE_MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            marginTop: 6,
            fontSize: '0.8rem',
            color: 'var(--gold)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <span>Get Directions</span>
          <ExternalLink size={13} />
        </a>
      </div>
    ),
  },
  {
    icon: Clock,
    title: 'Working Hours',
    content: <p style={{ margin: 0, color: 'var(--text-muted-light)' }}>Mon – Sat : 10:00 AM – 7:00 PM</p>,
  },
]

export default function Contact() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <div className="page-header">
        <span className="label">Let Your Dream Come Alive</span>
        <h1>Reyansh <span>Studio</span></h1>
        <p>Design &bull; Create &bull; Inspire &bull; Book your consultation today</p>
      </div>

      <section className="section section-dark">
        <div className="container">
          <div className="contact-grid">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="label" style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: 2, textTransform: 'uppercase' }}>
                Direct Reach
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', margin: '8px 0 12px' }}>
                Let Your Dream Come Alive
              </h3>
              <p style={{ color: 'var(--text-muted-light)', marginBottom: 28, lineHeight: 1.6 }}>
                From custom handcrafted sofas to complete home interiors, kitchen cabinets, and luxury wardrobes, we are here to craft your vision into reality.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
                {contactDetails.map((item, i) => (
                  <div className="contact-info-item" key={i} style={{ margin: 0 }}>
                    <div className="ci-icon">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: 4 }}>{item.title}</h4>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Digital Visiting Card Showcase */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 12,
                  padding: 20,
                  marginTop: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <QrCode size={20} color="var(--gold)" />
                  <h4 style={{ margin: 0, color: 'var(--gold)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Official Studio Business Card
                  </h4>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
                  Scan the WhatsApp QR code with your phone camera or click the card to start an instant conversation:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 16 }}>
                  <div
                    style={{
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid rgba(212,175,55,0.35)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                      background: '#fff',
                    }}
                  >
                    <img
                      src={cardFront}
                      alt="Reyansh Studio Business Card Front"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                  <a
                    href="https://wa.me/917887556060?text=Hi%20Reyansh%20Studio!%20I%20scanned%20your%20business%20card%20and%20would%20like%20to%20connect."
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Click to Chat on WhatsApp (+91 7887556060)"
                    style={{
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid rgba(212,175,55,0.35)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                      background: '#fff',
                      display: 'block',
                      cursor: 'pointer',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)'
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,211,102,0.3)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
                    }}
                  >
                    <img
                      src={cardBack}
                      alt="Reyansh Studio Business Card Back with WhatsApp Scanner"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div style={{ marginBottom: 16 }}>
                <span className="label" style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase' }}>
                  Online Booking
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '4px 0 8px' }}>
                  Send Consultation Request
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Fill in your details below. Your inquiry is directly forwarded to <strong>reyaneshstudio@gmail.com</strong> so our team can immediately get back to you.
                </p>
              </div>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
