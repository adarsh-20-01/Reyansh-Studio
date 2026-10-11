import { useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import CTASection from '../components/CTASection'

// Images
import imgLiving from '../assets/project-living.png'
import imgSofa from '../assets/project-sofa.png'
import imgBedroom from '../assets/project-bedroom.png'
import imgKitchen from '../assets/project-kitchen.png'
import imgOffice from '../assets/project-office.png'
import imgSofaCumBed from '../assets/gallery-sofacumbed-rose.jpg'
import imgFlutedBlush from '../assets/gallery-fluted-blush-sofa.jpg'
import imgTealRibbed from '../assets/gallery-teal-ribbed-sofa.jpg'
import imgTealTub from '../assets/gallery-teal-tub-armchair.jpg'
import imgMustardAccent from '../assets/gallery-mustard-accent-chair.jpg'
import imgBedroomCove from '../assets/gallery-bedroom-cove-ceiling.jpg'
import imgSlidingWardrobe from '../assets/gallery-sliding-wardrobe-lofts.jpg'
import imgBedroomStudy from '../assets/gallery-bedroom-study-suite.jpg'
import imgDiningWalnut6 from '../assets/gallery-dining-walnut-6seater.jpg'
import imgDiningCapsule from '../assets/gallery-dining-oval-capsule.jpg'
import PhotoEnquiryModal from '../components/PhotoEnquiryModal'

const allProjects = [
  { image: imgSofaCumBed, filename: 'gallery-sofacumbed-rose.jpg', title: 'Convertible Sofa-cum-Bed & Ottoman', category: 'Custom Sofa' },
  { image: imgFlutedBlush, filename: 'gallery-fluted-blush-sofa.jpg', title: 'Curved Fluted Channel Sofa', category: 'Custom Sofa' },
  { image: imgTealRibbed, filename: 'gallery-teal-ribbed-sofa.jpg', title: 'Signature Teal Ribbed Sofa', category: 'Custom Sofa' },
  { image: imgTealTub, filename: 'gallery-teal-tub-armchair.jpg', title: 'Peacock Velvet Barrel Tub Chair', category: 'Custom Sofa' },
  { image: imgMustardAccent, filename: 'gallery-mustard-accent-chair.jpg', title: 'Scandinavian Mustard Wingback', category: 'Custom Sofa' },
  { image: imgBedroomCove, filename: 'gallery-bedroom-cove-ceiling.jpg', title: 'Contemporary Bedroom & Cove Ceiling', category: 'Bedroom' },
  { image: imgSlidingWardrobe, filename: 'gallery-sliding-wardrobe-lofts.jpg', title: 'Dual-Tone Sliding Wardrobe & Lofts', category: 'Bedroom' },
  { image: imgBedroomStudy, filename: 'gallery-bedroom-study-suite.jpg', title: 'Master Bedroom with Floating Study', category: 'Bedroom' },
  { image: imgDiningWalnut6, filename: 'gallery-dining-walnut-6seater.jpg', title: 'Handcrafted Walnut 6-Seater Suite', category: 'Dining' },
  { image: imgDiningCapsule, filename: 'gallery-dining-oval-capsule.jpg', title: 'Minimalist Capsule Walnut Dining Set', category: 'Dining' },
  { image: imgLiving, filename: 'project-living.png', title: 'The Royal Living Room', category: 'Residential' },
  { image: imgSofa, filename: 'project-sofa.png', title: 'Sapphire Sofa Collection', category: 'Custom Sofa' },
  { image: imgBedroom, filename: 'project-bedroom.png', title: 'Emerald Master Suite', category: 'Bedroom' },
  { image: imgKitchen, filename: 'project-kitchen.png', title: 'Modern Quartz & Fluted Glass Kitchen', category: 'Kitchen' },
  { image: imgOffice, filename: 'project-office.png', title: 'Modern L-Shaped Modular Kitchen', category: 'Kitchen' },
]

const categories = ['All', 'Custom Sofa', 'Bedroom', 'Dining', 'Kitchen', 'Residential', 'Commercial']

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [enquiryItem, setEnquiryItem] = useState(null)
  const filtered = filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <div className="page-header">
        <span className="label">Our Craft & Portfolio</span>
        <h1>Our <span>Projects</span></h1>
        <p>Explore our portfolio of handcrafted luxury sofas, custom armchairs, and turnkey interiors</p>
      </div>
      <section className="section section-dark">
        <div className="container">
          <div className="project-filters">
            {categories.map(c => (
              <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <motion.div className="projects-grid" layout>
            {filtered.map((p, i) => (
              <ProjectCard
                key={p.title + i}
                index={i}
                {...p}
                onEnquire={item => setEnquiryItem(item)}
              />
            ))}
          </motion.div>
        </div>
      </section>
      <CTASection />

      {/* Photo Enquiry Modal for Projects */}
      <PhotoEnquiryModal
        item={enquiryItem}
        isOpen={Boolean(enquiryItem)}
        onClose={() => setEnquiryItem(null)}
      />
    </motion.div>
  )
}
