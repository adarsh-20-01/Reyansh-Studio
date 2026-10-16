import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Eye } from 'lucide-react'

export default function ProjectCard({ image, title, category, description, index = 0, onClick }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      className="project-card"
      ref={ref}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <img src={image} alt={title} loading="lazy" />
      <div className="overlay">
        <span className="cat">{category}</span>
        <h3>{title}</h3>
        {description && (
          <p className="project-card-desc">{description}</p>
        )}
        <span className="view-btn">
          <Eye size={14} />
          View Project
        </span>
      </div>
    </motion.div>
  )
}
