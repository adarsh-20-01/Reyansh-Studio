import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { Award, Heart, Users, Target } from 'lucide-react'
import aboutImg from '../assets/about-showroom.png'
import CTASection from '../components/CTASection'

const values = [
  { icon: Award, title: 'Excellence', desc: 'We pursue perfection in every detail, from material selection to final finishing touches.' },
  { icon: Heart, title: 'Passion', desc: 'Design is our passion. We pour creativity and love into every project we undertake.' },
  { icon: Users, title: 'Client Focus', desc: 'Your vision drives our work. We listen, understand, and deliver beyond expectations.' },
  { icon: Target, title: 'Innovation', desc: 'We stay ahead of trends, blending timeless elegance with contemporary innovation.' },
]

const stats = [
  { value: 500, suffix: '+', label: 'Projects' },
  { value: 12, suffix: '+', label: 'Years' },
  { value: 1000, suffix: '+', label: 'Clients' },
  { value: 50, suffix: '+', label: 'Awards' },
]

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <div className="page-header">
        <span className="label">Let Your Dream Come Alive</span>
        <h1>About <span>Reyansh Studio</span></h1>
        <p>Design &bull; Create &bull; Inspire &bull; Transforming homes and crafting bespoke furniture</p>
      </div>

      <section className="section section-dark">
        <div className="container">
          <div className="about-intro">
            <motion.div className="img-wrap" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img src={aboutImg} alt="Reyansh Studio Showroom" />
            </motion.div>
            <motion.div className="about-text" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h3>Where Comfort Meets Elegance</h3>
              <p>Founded with a passion for bringing dreams alive, <strong>Reyansh Studio</strong> is dedicated to complete interior solutions and handcrafted furniture excellence.</p>
              <p>Specializing in custom luxury sofas, modular kitchen cabinets, designer TV units, beds, wardrobes, elegant dining tables, and premium curtains, our artisans and designers ensure every inch of your space reflects sophistication and comfort.</p>
              <p>Whether you need a single custom-designed sofa or a full-scale residential overhaul, we collaborate closely with you to deliver timeless, functional luxury.</p>
            </motion.div>
          </div>
        </div>
      </section>

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

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="label">Our Values</span>
            <h2>What <span>Drives</span> Us</h2>
          </div>
          <div className="about-values">
            {values.map((v, i) => (
              <motion.div className="value-card" key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="v-icon"><v.icon size={32} /></div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </motion.div>
  )
}
