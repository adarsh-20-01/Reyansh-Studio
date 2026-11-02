import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Eye } from 'lucide-react'

export default function ProjectCard({ image, title, category, description, index = 0, onClick }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const reduceMotion = useReducedMotion()

  const handleKeyDown = (e) => {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <motion.article
      className="project-card"
      ref={ref}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View project: ${title}` : title}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.08 }}
    >
      <img src={image} alt={title} loading="lazy" />
      <div className="overlay">
        <span className="cat">{category}</span>
        <h3>{title}</h3>
        {description && (
          <p className="project-card-desc">{description}</p>
        )}
        {onClick && (
          <span className="view-btn">
            <Eye size={14} />
            View Project
          </span>
        )}
      </div>
    </motion.article>
  )
}
