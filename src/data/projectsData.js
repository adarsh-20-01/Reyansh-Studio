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

/**
 * Shared portfolio data. Descriptions and highlights are based on
 * existing titles and visible design language — not unverified specs.
 */
export const allProjects = [
  {
    image: imgFlutedBlush,
    title: 'Curved Fluted Channel Sofa',
    category: 'Custom Sofa',
    description:
      'A contemporary curved sofa featuring elegant vertical channel detailing, a soft upholstered finish, and a rounded silhouette. Its modern design makes it suitable for stylish living rooms and premium interior spaces.',
    designStyle: 'Contemporary curved silhouette with vertical channel fluting',
    materials: 'Soft upholstered velvet with metallic brass ball feet',
    gallery: [imgFlutedBlush, imgTealRibbed, imgGreyTufted],
    highlights: [
      'Elegant curved silhouette',
      'Vertical fluted channel detailing',
      'Soft upholstered finish',
      'Modern rounded profile',
    ],
    customization:
      'Available as a bespoke commission. Fabric selection, scale, and finish can be tailored for your space.',
  },
  {
    image: imgSofaCumBed,
    title: 'Convertible Sofa-cum-Bed & Ottoman',
    category: 'Custom Sofa',
    description:
      'A versatile furniture design combining comfortable seating with a convertible sleeping arrangement and a matching ottoman. Ideal for spaces that need both functionality and style.',
    designStyle: 'Modern multi-functional convertible sofa-bed with matching ottoman',
    materials: 'High-density comfort foam with durable woven upholstery and sturdy internal framing',
    gallery: [imgSofaCumBed],
    highlights: [
      'Comfortable seating with pull-out bed conversion',
      'Matching fluted ottoman',
      'Dual-purpose space-saving design',
    ],
    customization:
      'Layout, dimensions, and upholstery can be tailored to fit your room requirements.',
  },
  {
    image: imgTealTub,
    title: 'Peacock Velvet Barrel Tub Chair',
    category: 'Custom Sofa',
    description:
      'A stylish barrel-shaped accent chair featuring rich teal velvet upholstery, a curved backrest, and a decorative cushion. Its elegant silhouette adds a sophisticated touch to living rooms and lounge areas.',
    designStyle: 'Curved barrel club silhouette with vertical channel quilting',
    materials: 'Rich teal velvet upholstery with metallic gold profile trim and tapered brass legs',
    gallery: [imgTealTub, imgMustardAccent],
    highlights: [
      'Barrel-shaped curved silhouette',
      'Rich teal velvet upholstery',
      'Curved backrest with decorative cushion',
      'Tapered gold brass legs',
    ],
    customization:
      'Upholstery color, cushion pairings, and leg finishes can be customized upon consultation.',
  },
  {
    image: imgLiving,
    title: 'The Royal Living Room',
    category: 'Residential',
    description:
      'A premium residential living room featuring coordinated seating, decorative wall panels, and contemporary interior detailing. The design creates a refined and comfortable atmosphere.',
    designStyle: 'Contemporary luxury turnkey residential living room',
    materials: 'Italian marble TV backdrop, custom brass fluted panelling, and ambient LED cove lighting',
    gallery: [imgLiving, imgSofa],
    highlights: [
      'Coordinated luxury seating arrangement',
      'Decorative wall panels with brass fluting',
      'Italian marble TV backdrop',
      'Contemporary interior detailing',
    ],
    customization:
      'Full-room compositions can be adapted to your layout, color palette, and bespoke finish requirements.',
  },
  {
    image: imgTealRibbed,
    title: 'Signature Teal Ribbed Sofa',
    category: 'Custom Sofa',
    description:
      'A bold statement sofa with rich teal upholstery and a distinctive ribbed texture. Its clean lines and generous proportions make it a centerpiece for any modern living space.',
    designStyle: 'Contemporary linear sofa with vertical ribbed quilting',
    materials: 'Deep peacock teal fabric with polished brass hairpin legs',
    gallery: [imgTealRibbed, imgFlutedBlush],
    highlights: [
      'Rich teal upholstery',
      'Distinctive ribbed texture',
      'Clean contemporary lines',
    ],
    customization:
      'Length, configuration, and fabric choices can be customized to your living space.',
  },
  {
    image: imgMustardAccent,
    title: 'Scandinavian Mustard Wingback',
    category: 'Custom Sofa',
    description:
      'A classic wingback silhouette reimagined in vibrant mustard fabric with Scandinavian-inspired wooden legs. Elegant, comfortable, and effortlessly stylish.',
    designStyle: 'Mid-century Scandinavian wingback armchair',
    materials: 'Rich ochre-yellow velvet with tapered natural wood legs',
    gallery: [imgMustardAccent],
    highlights: [
      'Classic wingback silhouette',
      'Vibrant mustard fabric',
      'Scandinavian-inspired wooden legs',
    ],
    customization:
      'Fabric tones and wood leg finishes can be customized to match your decor.',
  },
  {
    image: imgBedroomCove,
    title: 'Contemporary Bedroom & Cove Ceiling',
    category: 'Bedroom',
    description:
      'A serene master bedroom featuring an elegant cove ceiling with ambient LED lighting, bespoke joinery, and a restrained palette that promotes deep relaxation.',
    designStyle: 'Modern master bedroom suite with geometric cove ceiling',
    materials: 'Fluted acoustic panel headboard, integrated storage bed, and matching nightstands',
    gallery: [imgBedroomCove, imgSlidingWardrobe, imgBedroomStudy],
    highlights: [
      'Cove ceiling with ambient LED lighting',
      'Bespoke joinery',
      'Restrained, calming palette',
    ],
    customization:
      'Ceiling lighting schemes, storage configurations, and panel finishes are planned to your space.',
  },
  {
    image: imgSlidingWardrobe,
    title: 'Dual-Tone Sliding Wardrobe & Lofts',
    category: 'Bedroom',
    description:
      'A space-maximising wardrobe solution with dual-tone sliding panels, integrated loft storage, and precision-engineered fittings. Combines beauty with practical functionality.',
    designStyle: 'Dual-tone sliding modular wardrobe with ceiling-high lofts',
    materials: 'Matte laminate panels with vertical fluted accents and precision sliding hardware',
    gallery: [imgSlidingWardrobe, imgBedroomCove],
    highlights: [
      'Dual-tone sliding panels',
      'Integrated loft storage',
      'Precision-engineered fittings',
    ],
    customization:
      'Panel finishes, internal drawer layouts, and loft storage can be planned to your room dimensions.',
  },
  {
    image: imgBedroomStudy,
    title: 'Master Bedroom with Floating Study',
    category: 'Bedroom',
    description:
      'A sophisticated suite that seamlessly integrates a floating study desk, custom shelving, and a plush sleeping area — the perfect blend of productivity and comfort.',
    designStyle: 'Turnkey master bedroom with integrated floating study desk',
    materials: 'Engineered hardwood desk, illuminated shelving, and fluted headboard panelling',
    gallery: [imgBedroomStudy, imgBedroomCove],
    highlights: [
      'Integrated floating study desk',
      'Custom shelving',
      'Combined sleep and work suite',
    ],
    customization:
      'Desk placement, storage sizing, and finishes can be tailored to your room layout.',
  },
  {
    image: imgDiningWalnut6,
    title: 'Handcrafted Walnut 6-Seater Suite',
    category: 'Dining',
    description:
      'A statement dining suite crafted from premium walnut, featuring a hand-finished tabletop and six upholstered dining chairs. Timeless craftsmanship for refined entertaining.',
    designStyle: 'Natural walnut dining table with rounded edge profiling',
    materials: 'Solid natural walnut with stain-resistant cream upholstered dining chairs',
    gallery: [imgDiningWalnut6, imgDiningCapsule],
    highlights: [
      'Premium walnut craftsmanship',
      'Hand-finished tabletop',
      'Six upholstered dining chairs',
    ],
    customization:
      'Seating count (4, 6, 8-seater), table dimensions, and chair upholstery can be customized.',
  },
  {
    image: imgDiningCapsule,
    title: 'Minimalist Capsule Walnut Dining Set',
    category: 'Dining',
    description:
      'An oval capsule-form dining table in warm walnut, paired with sculptural chairs. A minimalist design with maximum visual impact for modern dining rooms.',
    designStyle: 'Minimalist oval capsule dining table with sculptured trestle base',
    materials: 'Warm American walnut with ergonomic curved upholstered dining chairs',
    gallery: [imgDiningCapsule, imgDiningWalnut6],
    highlights: [
      'Oval capsule table form',
      'Warm walnut finish',
      'Sculptural companion chairs',
    ],
    customization:
      'Table scale and chair upholstery fabrics can be tailored for your dining space.',
  },
  {
    image: imgSofa,
    title: 'Sapphire Sofa Collection',
    category: 'Custom Sofa',
    description:
      'A bespoke deep-sapphire sofa collection crafted with premium fabrics and hand-stitched detailing, bringing rich colour and luxurious comfort to any living space.',
    designStyle: 'Royal tailored custom sofa collection',
    materials: 'Stain-resistant sapphire velvet with heavy-duty solid hardwood structure',
    gallery: [imgSofa, imgGreyTufted],
    highlights: [
      'Deep-sapphire colour story',
      'Premium fabrics',
      'Hand-stitched detailing',
    ],
    customization:
      'Configuration, dimensions, and fabric directions can be customized.',
  },
  {
    image: imgBedroom,
    title: 'Emerald Master Suite',
    category: 'Bedroom',
    description:
      'A sumptuous master bedroom in emerald tones, featuring custom headboard joinery, integrated nightstands, and layered ambient lighting for a hotel-quality retreat.',
    designStyle: 'Luxury turnkey master suite with ambient layered lighting',
    materials: 'Acoustic velvet headboard, custom joinery, and matching side consoles',
    gallery: [imgBedroom, imgBedroomStudy],
    highlights: [
      'Emerald-toned palette',
      'Custom headboard joinery',
      'Integrated nightstands',
      'Layered ambient lighting',
    ],
    customization:
      'Joinery layout, lighting design, and headboard fabrics can be tailored.',
  },
  {
    image: imgKitchen,
    title: 'Modern Quartz & Fluted Glass Kitchen',
    category: 'Kitchen',
    description:
      'A contemporary modular kitchen featuring quartz countertops, fluted glass cabinet fronts, and premium appliances. Where culinary art meets architectural beauty.',
    designStyle: 'Dual-tone contemporary modular kitchen',
    materials: 'Quartz countertops, amber fluted glass showcase with cove lighting, and acrylic cabinets',
    gallery: [imgKitchen, imgOffice],
    highlights: [
      'Quartz countertops',
      'Fluted glass cabinet fronts',
      'Modular contemporary layout',
    ],
    customization:
      'Cabinet layout, finishes, and appliance integration can be customized.',
  },
  {
    image: imgOffice,
    title: 'Modern L-Shaped Modular Kitchen',
    category: 'Kitchen',
    description:
      'An L-shaped modular kitchen designed for efficiency and style, with handleless cabinets, integrated appliances, and durable premium-grade laminates.',
    designStyle: 'Contemporary L-shaped modular kitchen layout',
    materials: 'Glossy taupe acrylic shutters, quartz countertops, and stainless steel hardware',
    gallery: [imgOffice, imgKitchen],
    highlights: [
      'L-shaped modular plan',
      'Handleless cabinets',
      'Integrated appliances',
      'Premium-grade laminates',
    ],
    customization:
      'Cabinet layout, storage accessories, and laminate finishes can be tailored.',
  },
]

export const projectCategories = ['All', 'Custom Sofa', 'Bedroom', 'Dining', 'Kitchen', 'Residential', 'Commercial']

export const featuredProjectTitles = [
  'Curved Fluted Channel Sofa',
  'Convertible Sofa-cum-Bed & Ottoman',
  'Peacock Velvet Barrel Tub Chair',
  'The Royal Living Room',
]

export const featuredProjects = featuredProjectTitles
  .map((title) => allProjects.find((p) => p.title === title))
  .filter(Boolean)

export const projectTitles = allProjects.map((p) => p.title)
