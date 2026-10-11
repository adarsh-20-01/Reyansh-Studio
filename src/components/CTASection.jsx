import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

export default function CTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  return (
    <motion.section className="cta-section" ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}>
      <div className="container">
        <h2>Ready to Transform<br />Your <span>Space</span>?</h2>
        <p>Let's create something extraordinary together. Book a free design consultation today.</p>
        <Link to="/contact" className="btn-gold">Start Your Project</Link>
      </div>
    </motion.section>
  )
}
