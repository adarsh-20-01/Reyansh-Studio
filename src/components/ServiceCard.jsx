import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight } from 'lucide-react'

export default function ServiceCard({ icon: Icon, title, description, index = 0, onClick }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  return (
    <motion.div
      className="service-card"
      ref={ref}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="icon"><Icon size={24} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Learn More <ArrowRight size={14} />
      </span>
    </motion.div>
  )
}
