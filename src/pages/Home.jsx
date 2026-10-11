import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import HeroSection from '../components/HeroSection'
import ServiceCard from '../components/ServiceCard'
import ServiceDetailModal from '../components/ServiceDetailModal'
import ProjectCard from '../components/ProjectCard'
import TestimonialSlider from '../components/TestimonialSlider'
import CTASection from '../components/CTASection'
import { servicesData } from '../data/servicesData'
import imgLiving from '../assets/project-living.png'
import imgFlutedBlush from '../assets/gallery-fluted-blush-sofa.jpg'
import imgSofaCumBed from '../assets/gallery-sofacumbed-rose.jpg'
import imgTealTub from '../assets/gallery-teal-tub-armchair.jpg'

const featured = [
  { image: imgFlutedBlush, title: 'Curved Fluted Channel Sofa', category: 'Custom Sofa' },
  { image: imgSofaCumBed, title: 'Convertible Sofa-cum-Bed & Ottoman', category: 'Custom Sofa' },
  { image: imgTealTub, title: 'Peacock Velvet Barrel Tub Chair', category: 'Custom Sofa' },
  { image: imgLiving, title: 'The Royal Living Room', category: 'Residential' },
]

const stats = [
  { value: 500, suffix: '+', label: 'Projects Completed' },
  { value: 12, suffix: '+', label: 'Years Experience' },
  { value: 1000, suffix: '+', label: 'Happy Clients' },
  { value: 50, suffix: '+', label: 'Design Awards' },
]

function Stats() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  return (
    <section className="section stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <h3>{inView ? <CountUp end={s.value} duration={2.5} /> : '0'}{s.suffix}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <HeroSection />

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="label">What We Do</span>
            <h2>Our <span>Services</span></h2>
            <p>From concept to creation, we bring your vision to life with unmatched craftsmanship</p>
          </div>
          <div className="services-grid">
            {servicesData.slice(0, 6).map((s, i) => (
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

      <Stats />

      <section className="section section-darker">
        <div className="container">
          <div className="section-header">
            <span className="label">Portfolio</span>
            <h2>Featured <span>Projects</span></h2>
            <p>A glimpse into our latest interior transformations and sofa creations</p>
          </div>
          <div className="projects-grid">
            {featured.map((p, i) => <ProjectCard key={i} index={i} {...p} />)}
          </div>
        </div>
      </section>

      <TestimonialSlider />
      <CTASection />

      {/* Service Detail & Enquiry Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
      />
    </motion.div>
  )
}
