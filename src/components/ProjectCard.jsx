import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowUpRight } from 'lucide-react'

export default function ProjectCard({ image, title, category, filename, index = 0, onEnquire }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      className="project-card"
      ref={ref}
      onClick={() => onEnquire && onEnquire({ image, title, category, filename })}
      style={{ cursor: onEnquire ? 'pointer' : 'default' }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <img src={image} alt={title} loading="lazy" />
      <div className="overlay">
        <span className="cat">{category}</span>
        <h3>{title}</h3>
        <span className="view-btn">Enquire Design <ArrowUpRight size={14} /></span>
      </div>
    </motion.div>
  )
}
