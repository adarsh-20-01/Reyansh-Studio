import { useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import ProjectDetailModal from '../components/ProjectDetailModal'
import CTASection from '../components/CTASection'
import { allProjects, projectCategories } from '../data/projectsData'

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)

  const filtered = filter === 'All'
    ? allProjects
    : allProjects.filter(p => p.category === filter)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <span className="label">Our Craft & Portfolio</span>
        <h1>Our <span>Projects</span></h1>
        <p>Explore our portfolio of handcrafted luxury sofas, custom armchairs, and turnkey interiors</p>
      </div>

      <section className="section section-dark">
        <div className="container">
          <div className="project-filters">
            {projectCategories.map(c => (
              <button
                key={c}
                type="button"
                className={`filter-btn ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div className="projects-grid" layout>
            {filtered.map((p, i) => (
              <ProjectCard
                key={p.title + i}
                index={i}
                image={p.image}
                title={p.title}
                category={p.category}
                description={p.description}
                onClick={() => setSelectedProject(p)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </motion.div>
  )
}
