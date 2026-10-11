import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroBg from '../assets/hero-bg.png'

export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img src={heroBg} alt="Luxury Interior" />
      </div>
      <div className="hero-overlay" />
      <motion.div className="hero-content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <motion.span className="hero-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Let Your Dream Come Alive
        </motion.span>
        <h1>Crafting Spaces<br />That <span>Inspire</span></h1>
        <p>Reyansh Studio &bull; Design &bull; Create &bull; Inspire. Handcrafted sofas, modular kitchen cabinets, designer TV units, and complete home interiors.</p>
        <div className="hero-btns">
          <Link to="/projects" className="btn-gold">Explore Our Work</Link>
          <Link to="/contact" className="btn-outline">Book Consultation</Link>
        </div>
      </motion.div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}
