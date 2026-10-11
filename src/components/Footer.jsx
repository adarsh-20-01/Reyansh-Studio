import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const SocialIcon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
)

export default function Footer() {
  const { isAdmin } = useAuth()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="f-logo-wrap">
              <span className="f-logo">REYANSH</span>
              <span className="f-logo-sub">STUDIO</span>
            </Link>
            <p className="f-tagline">Design • Create • Inspire</p>
            <p>Crafting luxurious interiors and handcrafted sofas that transform spaces into works of art. Where comfort meets elegance.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><SocialIcon d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" /></a>
              <a href="#" aria-label="Facebook"><SocialIcon d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></a>
              <a href="#" aria-label="Twitter"><SocialIcon d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></a>
              <a href="#" aria-label="LinkedIn"><SocialIcon d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4" /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li>
                <Link to="/admin" style={{ opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Admin Portal
                  {isAdmin ? (
                    <span style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 600 }}>[Logged In]</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>[Private]</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">Home Interior</Link></li>
              <li><Link to="/services">Custom Sofa</Link></li>
              <li><Link to="/services">Kitchen Cabinet</Link></li>
              <li><Link to="/services">T. V. Units & Beds</Link></li>
              <li><Link to="/services">Wardrobes & Dining Table</Link></li>
              <li><Link to="/services">Curtains & Styling</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li><a href="tel:+917887556060" className="contact-line" style={{ color: 'inherit', textDecoration: 'none' }}><Phone size={16} /> +91 78875 56060</a></li>
              <li><a href="tel:+919404466587" className="contact-line" style={{ color: 'inherit', textDecoration: 'none' }}><Phone size={16} /> +91 94044 66587</a></li>
              <li>
                <a
                  href="https://www.google.com/maps/dir/18.4416735,73.8690576/REYANSH+STUDIO,+Yewalewadi,+TILAKER+NAGER,+Kondhwa+Budruk,+Pune,+Maharashtra+411048/@18.4458178,73.8651758,15z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3bc2ebee32ac5f73:0x271d6320ebfc173c!2m2!1d73.8864756!2d18.4404281?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-line"
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  title="Get directions to Reyansh Studio on Google Maps"
                >
                  <MapPin size={16} /> Reyansh Studio Tilekar Nagar, Pune, Maharashtra 411048
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Reyansh Studio. All rights reserved.</p>
          <p>Let Your Dream Come Alive &bull; Design &bull; Create &bull; Inspire</p>
        </div>
      </div>
    </footer>
  )
}
