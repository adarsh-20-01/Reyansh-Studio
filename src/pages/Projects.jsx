import { useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import ProjectDetailModal from '../components/ProjectDetailModal'
import CTASection from '../components/CTASection'

// ── Image imports ────────────────────────────────────────────────────────────
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
import imgGreyTufted from '../assets/project-grey-tufted-sofa.png'

// ── Project data ─────────────────────────────────────────────────────────────
const allProjects = [
  {
    image: imgFlutedBlush,
    title: 'Curved Fluted Channel Sofa',
    category: 'Custom Sofa',
    description:
      'A modern statement sofa featuring elegant curved edges, vertical fluted detailing, plush upholstery, and a soft blush-pink finish. Designed to bring comfort and sophistication to contemporary living spaces.',
    gallery: [imgFlutedBlush, imgTealRibbed, imgGreyTufted],
  },
  {
    image: imgSofaCumBed,
    title: 'Convertible Sofa-cum-Bed & Ottoman',
    category: 'Custom Sofa',
    description:
      'A versatile furniture solution combining a comfortable sofa, convertible bed functionality, and a matching ottoman. Ideal for maximising comfort and space in modern homes.',
    gallery: [imgSofaCumBed],
  },
  {
    image: imgTealTub,
    title: 'Peacock Velvet Barrel Tub Chair',
    category: 'Custom Sofa',
    description:
      'A luxurious barrel-style accent chair upholstered in rich peacock-blue velvet, featuring a curved backrest, plush seating, and elegant legs. Perfect for adding a bold, sophisticated touch to any room.',
    gallery: [imgTealTub, imgMustardAccent],
  },
  {
    image: imgLiving,
    title: 'The Royal Living Room',
    category: 'Residential',
    description:
      'A refined residential interior featuring contemporary wall panelling, warm accent lighting, premium finishes, and a coordinated seating arrangement. Designed to create a luxurious and welcoming atmosphere.',
    gallery: [imgLiving, imgSofa],
  },
  {
    image: imgTealRibbed,
    title: 'Signature Teal Ribbed Sofa',
    category: 'Custom Sofa',
    description:
      'A bold statement sofa with rich teal upholstery and a distinctive ribbed texture. Its clean lines and generous proportions make it a centrepiece for any modern living space.',
    gallery: [imgTealRibbed, imgFlutedBlush],
  },
  {
    image: imgMustardAccent,
    title: 'Scandinavian Mustard Wingback',
    category: 'Custom Sofa',
    description:
      'A classic wingback silhouette reimagined in vibrant mustard fabric with Scandinavian-inspired wooden legs. Elegant, comfortable, and effortlessly stylish.',
    gallery: [imgMustardAccent],
  },
  {
    image: imgBedroomCove,
    title: 'Contemporary Bedroom & Cove Ceiling',
    category: 'Bedroom',
    description:
      'A serene master bedroom featuring an elegant cove ceiling with ambient LED lighting, bespoke joinery, and a restrained palette that promotes deep relaxation.',
    gallery: [imgBedroomCove, imgSlidingWardrobe, imgBedroomStudy],
  },
  {
    image: imgSlidingWardrobe,
    title: 'Dual-Tone Sliding Wardrobe & Lofts',
    category: 'Bedroom',
    description:
      'A space-maximising wardrobe solution with dual-tone sliding panels, integrated loft storage, and precision-engineered fittings. Combines beauty with practical functionality.',
    gallery: [imgSlidingWardrobe, imgBedroomCove],
  },
  {
    image: imgBedroomStudy,
    title: 'Master Bedroom with Floating Study',
    category: 'Bedroom',
    description:
      'A sophisticated suite that seamlessly integrates a floating study desk, custom shelving, and a plush sleeping area — the perfect blend of productivity and comfort.',
    gallery: [imgBedroomStudy, imgBedroomCove],
  },
  {
    image: imgDiningWalnut6,
    title: 'Handcrafted Walnut 6-Seater Suite',
    category: 'Dining',
    description:
      'A statement dining suite crafted from premium walnut, featuring a hand-finished tabletop and six upholstered dining chairs. Timeless craftsmanship for refined entertaining.',
    gallery: [imgDiningWalnut6, imgDiningCapsule],
  },
  {
    image: imgDiningCapsule,
    title: 'Minimalist Capsule Walnut Dining Set',
    category: 'Dining',
    description:
      'An oval capsule-form dining table in warm walnut, paired with sculptural chairs. A minimalist design with maximum visual impact for modern dining rooms.',
    gallery: [imgDiningCapsule, imgDiningWalnut6],
  },
  {
    image: imgSofa,
    title: 'Sapphire Sofa Collection',
    category: 'Custom Sofa',
    description:
      'A bespoke deep-sapphire sofa collection crafted with premium fabrics and hand-stitched detailing, bringing rich colour and luxurious comfort to any living space.',
    gallery: [imgSofa, imgGreyTufted],
  },
  {
    image: imgBedroom,
    title: 'Emerald Master Suite',
    category: 'Bedroom',
    description:
      'A sumptuous master bedroom in emerald tones, featuring custom headboard joinery, integrated nightstands, and layered ambient lighting for a hotel-quality retreat.',
    gallery: [imgBedroom, imgBedroomStudy],
  },
  {
    image: imgKitchen,
    title: 'Modern Quartz & Fluted Glass Kitchen',
    category: 'Kitchen',
    description:
      'A contemporary modular kitchen featuring quartz countertops, fluted glass cabinet fronts, and premium appliances. Where culinary art meets architectural beauty.',
    gallery: [imgKitchen, imgOffice],
  },
  {
    image: imgOffice,
    title: 'Modern L-Shaped Modular Kitchen',
    category: 'Kitchen',
    description:
      'An L-shaped modular kitchen designed for efficiency and style, with handleless cabinets, integrated appliances, and durable premium-grade laminates.',
    gallery: [imgOffice, imgKitchen],
  },
]

const categories = ['All', 'Custom Sofa', 'Bedroom', 'Dining', 'Kitchen', 'Residential', 'Commercial']

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
      {/* Page Header */}
      <div className="page-header">
        <span className="label">Our Craft & Portfolio</span>
        <h1>Our <span>Projects</span></h1>
        <p>Explore our portfolio of handcrafted luxury sofas, custom armchairs, and turnkey interiors</p>
      </div>

      {/* Projects Grid */}
      <section className="section section-dark">
        <div className="container">
          {/* Category filters */}
          <div className="project-filters">
            {categories.map(c => (
              <button
                key={c}
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

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </motion.div>
  )
}
