// Core assets
import imgLiving from '../assets/project-living.png'
import imgSofa from '../assets/project-sofa.png'
import imgBedroom from '../assets/project-bedroom.png'
import imgKitchen from '../assets/project-kitchen.png'
import imgOffice from '../assets/project-office.png'
import imgHero from '../assets/hero-bg.png'
import imgAbout from '../assets/about-showroom.png'
import imgGreySofa from '../assets/project-grey-tufted-sofa.png'

// Custom sofa showcase photos
import imgSofaCumBed from '../assets/gallery-sofacumbed-rose.jpg'
import imgFlutedBlush from '../assets/gallery-fluted-blush-sofa.jpg'
import imgTealRibbed from '../assets/gallery-teal-ribbed-sofa.jpg'
import imgTealTub from '../assets/gallery-teal-tub-armchair.jpg'
import imgMustardAccent from '../assets/gallery-mustard-accent-chair.jpg'

// Master bedroom, modular wardrobe & solid walnut dining suite photos
import imgBedroomCove from '../assets/gallery-bedroom-cove-ceiling.jpg'
import imgSlidingWardrobe from '../assets/gallery-sliding-wardrobe-lofts.jpg'
import imgBedroomStudy from '../assets/gallery-bedroom-study-suite.jpg'
import imgDiningWalnut6 from '../assets/gallery-dining-walnut-6seater.jpg'
import imgDiningCapsule from '../assets/gallery-dining-oval-capsule.jpg'

// Icons
import {
  Home as HomeIcon,
  Sofa,
  CookingPot,
  Building2,
  BedDouble,
  Armchair,
  Palette,
  Wrench,
} from 'lucide-react'

export const servicesData = [
  {
    id: 'home-interior',
    title: 'Home Interior',
    category: 'Turnkey Residential',
    tagline: 'Comprehensive Turnkey Residential Transformations',
    icon: HomeIcon,
    shortDescription:
      'Comprehensive interior solutions for flats, villas, and modern apartments. Thoughtful layouts, lighting, and finishes that bring your dream alive.',
    fullDescription:
      'At Reyansh Studio, we transform bare apartments and villas into breathtaking, luxurious living sanctuaries. From initial 2D space planning and photorealistic 3D rendering to civil alterations, bespoke carpentry, acoustic wall treatments, false ceiling design, and Italian marble installations, our turnkey interior service handles every single facet with master-grade precision.\n\nWe coordinate all electrical planning, concealed ambient LED cove lighting, designer wall fluting, and tailored furnishings so your home reflects your signature personality with effortless elegance.',
    highlights: [
      'Comprehensive 3D Architectural Visualizations & Precise CAD Space Planning',
      'Italian Statuario Marble Backdrops, PVD Brass Fluting & Designer Wall Paneling',
      'Architectural Cove False Ceilings with Dimmable Warm Indirect LED Systems',
      'Complete Civil, Electrical, Plumbing & Carpentry Turnkey Management',
      'Guaranteed 45-Day Handover with Dedicated On-Site Project Supervisors',
      'Transparent Material Specifications & Zero Hidden Execution Costs',
    ],
    specs: [
      { label: 'Scope', value: '2BHK, 3BHK, 4BHK, Penthouses & Luxury Villas' },
      { label: 'Execution', value: '100% Factory Pre-Fabricated & On-Site Turnkey Assembly' },
      { label: 'Warranty', value: '10-Year Structural & Hardware Warranty' },
      { label: 'Timeline', value: '35 – 50 Working Days Handover' },
    ],
    photos: [
      {
        image: imgLiving,
        filename: 'project-living.png',
        title: 'The Royal Living Room Suite',
        caption: 'Italian marble TV backdrop, custom brass fluting, and cove lighting.',
      },
      {
        image: imgHero,
        filename: 'hero-bg.png',
        title: 'Contemporary Open-Concept Residence',
        caption: 'Seamless architectural integration of living, dining, and media zones.',
      },
      {
        image: imgBedroom,
        filename: 'project-bedroom.png',
        title: 'Emerald Suite Master Bedroom',
        caption: 'Integrated velvet headboard, matching consoles, and ambient illumination.',
      },
      {
        image: imgAbout,
        filename: 'about-showroom.png',
        title: 'Reyansh Precision Atelier & Workshop',
        caption: 'Factory-tested modular cabinetry and bespoke woodwork crafting.',
      },
    ],
  },

  {
    id: 'custom-sofa',
    title: 'Custom Sofa',
    category: 'Bespoke Seating',
    tagline: 'Handcrafted Luxury Comfort Tailored to Your Proportions',
    icon: Sofa,
    shortDescription:
      'Bespoke luxury sofas crafted to your exact dimension, style, and fabric preferences. Maximum comfort and enduring craftsmanship.',
    fullDescription:
      'A sofa is the beating heart of your living room. At Reyansh Studio, we do not believe in one-size-fits-all factory seating. We handcraft bespoke luxury sofas tailored down to the exact millimeter to fit your living room dimensions, posture preferences, and interior design theme.\n\nFrom curved fluted channel sofas in blush velvet and regal Chesterfield sectionals with deep button tufting, to multifunctional convertible sofa-cum-beds with matching ottomans, every piece is built upon kiln-dried termite-treated hardwood framing and upholstered with your choice from over 350+ designer fabrics.',
    highlights: [
      'Termite-Treated, Kiln-Dried Solid Hardwood & Marine-Grade Core Framing',
      'High-Resilience 32-40 Density Foam with Feather-Touch Microfiber Cushioning',
      'Over 350+ Upholstery Options: Belgian Velvet, Bouclé, Chenille, Textured Linen & Leatherette',
      'Custom Millimeter Sizing: 2-Seater, 3-Seater, L-Shape Sectional & Curved Silhouettes',
      'Reinforced Serpentine Spring Suspensions & Heavy-Duty Elastic Webbing (10+ Years Life)',
      'Designer Leg Finishes: PVD Gold Brass, Polished Teak, Champagne & Matte Black Hairpin',
    ],
    specs: [
      { label: 'Structure', value: 'Termite-Treated Seasoned Hardwood Frame' },
      { label: 'Cushioning', value: '32-40 Density Dual-Layer High Resilience Foam' },
      { label: 'Fabrics', value: 'Stain-Resistant Imported Velvet, Linen & Bouclé' },
      { label: 'Warranty', value: '5-Year Frame & 3-Year Foam Resilience Guarantee' },
    ],
    photos: [
      {
        image: imgFlutedBlush,
        filename: 'gallery-fluted-blush-sofa.jpg',
        title: 'Curved Fluted Channel Sofa',
        caption: 'Luxury blush pink velvet with vertical tufting and gold brass ball feet.',
      },
      {
        image: imgSofaCumBed,
        filename: 'gallery-sofacumbed-rose.jpg',
        title: 'Convertible Sofa-cum-Bed & Ottoman',
        caption: 'Handcrafted pull-out daybed with matching fluted glass-top ottoman.',
      },
      {
        image: imgTealRibbed,
        filename: 'gallery-teal-ribbed-sofa.jpg',
        title: 'Signature Teal Ribbed Sofa',
        caption: 'Vertical channel quilting, deep seat comfort, and brass hairpin legs.',
      },
      {
        image: imgGreySofa,
        filename: 'project-grey-tufted-sofa.png',
        title: 'Chesterfield Velvet Suite',
        caption: 'Diamond button tufted sectional sofa set in opulent smoke grey velvet.',
      },
      {
        image: imgTealTub,
        filename: 'gallery-teal-tub-armchair.jpg',
        title: 'Peacock Velvet Barrel Tub Chair',
        caption: 'Curved accent club armchair with gold profile trim and brass legs.',
      },
      {
        image: imgMustardAccent,
        filename: 'gallery-mustard-accent-chair.jpg',
        title: 'Scandinavian Mustard Wingback',
        caption: 'Mid-century modern accent chair in rich ochre yellow velvet.',
      },
    ],
  },

  {
    id: 'kitchen-cabinet',
    title: 'Kitchen Cabinet',
    category: 'Modular Kitchens',
    tagline: 'Modern, Space-Efficient & Moisture-Proof Modular Kitchens',
    icon: CookingPot,
    shortDescription:
      'Modern, space-efficient modular kitchen cabinets engineered with premium hardware, moisture-resistant materials, and ergonomic storage.',
    fullDescription:
      'A great kitchen balances culinary ergonomics with showroom aesthetics. Reyansh Studio engineers modular kitchens specifically optimized for Indian cooking environments — fully moisture-resistant, termite-proof, and heat-resilient.\n\nFeaturing boiling waterproof (BWP) marine ply, anti-scratch acrylic and matte PU finishes, soft-close Blum/Hettich tandem drawers, amber fluted glass display cabinets with integrated LED strip lighting, and seamless quartz stone countertops, we design kitchens where cooking becomes an everyday pleasure.',
    highlights: [
      '100% Boiling Waterproof Marine Ply (BWP Grade) & Moisture-Sealed Edge-Banding',
      'German Soft-Close Hinges, Tandem Cutlery Trays & Lift-Up Hydraulic Bi-Fold Shutters',
      'Fluted Amber & Tinted Glass Display Cabinets with Integrated Warm LED Lighting',
      'Quartz & Nano-Granite Countertops with Seamless Undermount Sink Integration',
      'Ergonomic Work Triangle (Prep, Cook, Clean) Custom-Tailored for Maximum Flow',
      'Dedicated Tall Pantries, Corner Carousels & Concealed Waste Segregation Bins',
    ],
    specs: [
      { label: 'Core Material', value: 'IS 710 Boiling Waterproof Marine Plywood' },
      { label: 'Finishes', value: 'High-Gloss Acrylic, Anti-Fingerprint Matte PU, Fluted Glass' },
      { label: 'Hardware', value: 'Blum, Hettich & Hafele Soft-Close Systems' },
      { label: 'Warranty', value: '10-Year Hardware & Waterproof Board Warranty' },
    ],
    photos: [
      {
        image: imgKitchen,
        filename: 'project-kitchen.png',
        title: 'Modern Quartz & Fluted Glass Kitchen',
        caption: 'Dual-tone cabinetry, illuminated amber fluted glass shutters, and marble backsplash.',
      },
      {
        image: imgOffice,
        filename: 'project-office.png',
        title: 'Contemporary L-Shaped Modular Kitchen',
        caption: 'Glossy taupe acrylic cabinets, integrated chimney, and quartz countertop.',
      },
    ],
  },

  {
    id: 'tv-units',
    title: 'T. V. Units',
    category: 'Media Consoles',
    tagline: 'Statement Entertainment Consoles with Concealed Wiring',
    icon: Building2,
    shortDescription:
      'Sleek, contemporary entertainment consoles and wall-mounted TV units with integrated LED accents and concealed wiring.',
    fullDescription:
      'Transform your entertainment zone into the luxury centerpiece of your home. Reyansh Studio creates bespoke TV wall units and media consoles that blend seamless functionality with architectural beauty.\n\nWe combine book-matched Italian marble backdrops, CNC-milled wooden fluting, champagne metallic borders, and floating console cabinets with complete concealed wire-management channels so set-top boxes, soundbars, and gaming consoles stay impeccably organized without unsightly cables.',
    highlights: [
      'Full Concealed Wire Management Channels & Smart Power Outlet Routing',
      'Italian Statuario & Armani Brown Marble Backdrops with Gold Profile Inlays',
      'CNC Fluted Louvers, Acoustic Charcoal Slats & Dimmable LED Backlighting',
      'Floating Media Drawers with Soft-Close Touch-to-Open Hardware',
      'Soundbar & Subwoofer Acoustic Shelving Optimized for Dolby Atmos Performance',
      'Custom Engineered to Frame 55-inch to 85-inch+ Curved and Flat Screen Displays',
    ],
    specs: [
      { label: 'Backdrop Options', value: 'Italian Marble, Quartz, Veneer, Fluted Acoustic Panels' },
      { label: 'Storage', value: 'Floating Concealed Drawers with Push-to-Open Slides' },
      { label: 'Lighting', value: 'Integrated COB Warm LED Profile Channels (3000K Warm)' },
      { label: 'Warranty', value: '5-Year Structural Integrity Warranty' },
    ],
    photos: [
      {
        image: imgLiving,
        filename: 'project-living.png',
        title: 'The Royal Italian Marble TV Console',
        caption: 'Bookmatched marble TV backdrop with PVD gold fluting and floating media shelf.',
      },
      {
        image: imgHero,
        filename: 'hero-bg.png',
        title: 'Architectural Media Wall Partition',
        caption: 'Seamless open-concept entertainment console dividing living and dining.',
      },
    ],
  },

  {
    id: 'designer-beds',
    title: 'Designer Beds',
    category: 'Luxury Bedrooms',
    tagline: 'Hydraulic Storage Beds with Floor-to-Ceiling Upholstered Headboards',
    icon: BedDouble,
    shortDescription:
      'Custom-built upholstered and solid wood beds crafted for peaceful rest and luxurious master bedroom aesthetics.',
    fullDescription:
      'Your bedroom should be a sanctuary of restorative calm. Reyansh Studio designs bespoke master beds that unite ergonomic posture support, whisper-quiet hydraulic storage, and show-stopping headboard architecture.\n\nFrom floor-to-ceiling acoustic velvet headboards with integrated reading sconces to upholstered platform daybeds and solid teak frames with zero-creak engineering, every bed is handcrafted to ensure decades of supreme comfort and peaceful slumber.',
    highlights: [
      'Heavy-Duty German Hydraulic Lift Cylinders for Effortless Under-Bed Storage',
      'Floor-to-Ceiling Tailored Acoustic Headboards with Geometric & Channel Tufting',
      'Zero-Creak Reinforced Teak & Marine Plywood Structural Box Framework',
      'Integrated Floating Side Consoles, USB-C Fast Charging & Ambient Backlighting',
      'Premium Stain-Guarded & Hypoallergenic Upholstery in Velvet, Linen & Suede',
      'Custom Sizing Available: King, Queen, California King & Customized Daybeds',
    ],
    specs: [
      { label: 'Structure', value: 'Termite-Treated Marine Core with Teak Reinforcements' },
      { label: 'Storage Mechanism', value: 'Dual 1200N Heavy-Duty Hydraulic Lift Cylinders' },
      { label: 'Headboard', value: 'Custom Acoustic Foam Upholstered Panels (Height up to 10 ft)' },
      { label: 'Warranty', value: '7-Year Framework & Lift Mechanism Warranty' },
    ],
    photos: [
      {
        image: imgBedroomCove,
        filename: 'gallery-bedroom-cove-ceiling.jpg',
        title: 'Contemporary Bedroom Suite & Geometric Cove Ceiling',
        caption: 'Master bedroom suite with fluted acoustic headboard, integrated storage bed, and warm LED cove ceiling.',
      },
      {
        image: imgBedroomStudy,
        filename: 'gallery-bedroom-study-suite.jpg',
        title: 'Master Bedroom with Integrated Floating Study',
        caption: 'Platform bed with cushioned fluted headboard, overhead warm LED shelves, and floating study console.',
      },
      {
        image: imgBedroom,
        filename: 'project-bedroom.png',
        title: 'Emerald Suite Master Bedroom',
        caption: 'Bespoke bedroom interior with integrated acoustic headboard and side consoles.',
      },
      {
        image: imgSofaCumBed,
        filename: 'gallery-sofacumbed-rose.jpg',
        title: 'Convertible Pull-out Daybed Suite',
        caption: 'Ergonomic dual-purpose sleeper sofa engineered for high-density comfort.',
      },
    ],
  },

  {
    id: 'wardrobes',
    title: 'Wardrobes',
    category: 'Storage & Closets',
    tagline: 'Floor-to-Ceiling Modular Wardrobes & Walk-In Dressing Suites',
    icon: Armchair,
    shortDescription:
      'Custom sliding and hinged modular wardrobes optimized for spacious storage, luxury laminates, and mirror finishes.',
    fullDescription:
      'Effortless organization begins with intelligent wardrobe design. Reyansh Studio crafts floor-to-ceiling modular wardrobes and walk-in closets custom-configured to accommodate your wardrobe essentials with dedicated precision.\n\nFeaturing whisper-quiet soft-close sliding tracks, bronze tinted glass shutters with automatic sensor illumination, pull-out jewelry organizers, velvet-lined watch drawers, integrated trouser racks, and full-length dressing mirrors, our wardrobes combine maximum utility with boutique luxury.',
    highlights: [
      'Floor-to-Ceiling Design Utilizing 100% Vertical Height with Top Loft Storage',
      'Smooth Top-Hung Silent Sliding Systems & 165-Degree Wide-Angle Hinges',
      'Tinted Fluted Glass Shutters with Automatic Smart Sensor LED Strips',
      'Velvet-Lined Accessory Drawers, Pull-Out Trouser Racks & Internal Shoe Pullouts',
      'BWP Grade Core with 1mm Anti-Bacterial Luxury Laminate & PU Finishes',
      'Built-In Dressing Vanity Mirror with Touch-Controlled Tri-Color Illumination',
    ],
    specs: [
      { label: 'Type', value: 'Sliding Doors, Hinged Openable & Walk-In Closets' },
      { label: 'Internal Fittings', value: 'Ebco / Hettich Soft-Close Drawers & Organizers' },
      { label: 'Door Finishes', value: 'Tinted Glass, Fluted Louvers, Mirror, Acrylic & Matte PU' },
      { label: 'Warranty', value: '10-Year Track & Hardware Replacement Warranty' },
    ],
    photos: [
      {
        image: imgSlidingWardrobe,
        filename: 'gallery-sliding-wardrobe-lofts.jpg',
        title: 'Dual-Tone Sliding Modular Wardrobe & Lofts',
        caption: 'Floor-to-ceiling dual-tone sliding wardrobe with vertical fluted panel accents and en-suite entryway.',
      },
      {
        image: imgBedroom,
        filename: 'project-bedroom.png',
        title: 'Master Bedroom Integrated Wardrobes',
        caption: 'Custom wardrobes with seamless profile handles and loft storage.',
      },
      {
        image: imgAbout,
        filename: 'about-showroom.png',
        title: 'Precision Factory Carpentry',
        caption: 'Modular wardrobe carcass assembly with edge-banding and precision hardware.',
      },
    ],
  },

  {
    id: 'dining-table',
    title: 'Dining Table',
    category: 'Dining Suites',
    tagline: 'Bespoke Centerpieces for Intimate Meals & Family Feasts',
    icon: Palette,
    shortDescription:
      'Stunning 4, 6, and 8-seater dining tables handcrafted in marble, quartz, and premium seasoned wood with ergonomic chairs.',
    fullDescription:
      'The dining table is where family stories are shared and culinary memories are made. Reyansh Studio creates statement dining tables handcrafted with imported Italian marble tops, stain-resistant quartz, and seasoned natural solid wood.\n\nPaired with custom upholstered dining chairs engineered for hours of comfortable seating, our dining suites are tailored to complement your open-concept living and dining architecture.',
    highlights: [
      'Stain-Resistant Nano-Coated Italian Marble & Quartz Countertop Surfaces',
      'Solid Teakwood & PVD Coated Heavy-Duty Metal Base Sculptures',
      'Ergonomically Contoured Dining Chairs with Stain-Guarded Velvet Upholstery',
      'Custom Geometric Shapes: Round, Oval, Capsule & Classic Rectangles',
      'Heat-Resilient & Anti-Scratch Finish Designed for Active Daily Family Dining',
      'Seating Configurations Available: 4-Seater, 6-Seater, 8-Seater & 10-Seater Banquet',
    ],
    specs: [
      { label: 'Table Top', value: 'Italian Statuario, Onyx, Quartz or Solid Teak' },
      { label: 'Base Frame', value: 'PVD Coated Gold Steel, Matte Black Metal or Carved Wood' },
      { label: 'Seating Options', value: '4, 6, 8, 10 or 12 Seater Customized Layouts' },
      { label: 'Warranty', value: '5-Year Structural Frame & Tabletop Stability Warranty' },
    ],
    photos: [
      {
        image: imgDiningWalnut6,
        filename: 'gallery-dining-walnut-6seater.jpg',
        title: 'Handcrafted Solid Walnut 6-Seater Dining Suite',
        caption: 'Solid natural walnut dining table with rounded profiling and curved armchairs with cream cushions.',
      },
      {
        image: imgDiningCapsule,
        filename: 'gallery-dining-oval-capsule.jpg',
        title: 'Minimalist Capsule Walnut Dining Set',
        caption: 'Capsule-shaped oval walnut dining table with sculptured trestle base and ergonomic chairs.',
      },
      {
        image: imgHero,
        filename: 'hero-bg.png',
        title: 'Integrated Open-Concept Dining Suite',
        caption: 'Luxury dining table harmoniously styled with the main living area.',
      },
      {
        image: imgSofaCumBed,
        filename: 'gallery-sofacumbed-rose.jpg',
        title: 'Fluted Glass-Top Center & Dining Ottoman',
        caption: 'Handcrafted fluted base with polished glass surface and matching seating.',
      },
    ],
  },

  {
    id: 'curtains-drapes',
    title: 'Curtains & Drapes',
    category: 'Soft Furnishings',
    tagline: 'Tailor-Made Designer Drapery to Transform Lighting & Mood',
    icon: Wrench,
    shortDescription:
      'Custom-tailored luxury curtains, sheer fabrics, blackout drapes, and blinds designed to match your interior ambiance perfectly.',
    fullDescription:
      'Drapery is the final touch of luxury that frames your windows and softens the acoustic ambiance of your home. Reyansh Studio delivers bespoke window styling using double-layered drapery solutions.\n\nFrom 100% thermal blackout drapes that guarantee restful darkness to ethereal daytime sheer curtains that diffuse natural sunlight into a soft golden glow, our curtains are tailored with ripple-fold headers, motorized smart tracks, and ceiling-recessed cove hanging systems.',
    highlights: [
      'Dual Layer Setup: 100% Thermal Blackout Drapes + Airy Daylight Sheer Fabrics',
      'Ceiling-Recessed Concealed Cove Hanging for Dramatic Floor-to-Ceiling Drops',
      'Motorized Smart Curtain Tracks Compatible with Remote & Smart Home Automation',
      'Over 500+ Luxury Fabrics: Belgian Linen, Crushed Velvet, Raw Silk & Jacquards',
      'Acoustic Sound-Dampening & Room Thermal Insulation Properties',
      'Complimentary In-Home Fabric Swatch Presentation & Laser Window Measurement',
    ],
    specs: [
      { label: 'Styles', value: 'Ripple Fold, Pinch Pleat, Eyelet & Motorized Concealed Cove' },
      { label: 'Fabric Catalog', value: '500+ Imported Blackouts, Sheers, Velvets & Linens' },
      { label: 'Tracks', value: 'Heavy-Duty Silent Glide Aluminum & Motorized Smart Tracks' },
      { label: 'Warranty', value: '3-Year Track & Motorized Hardware Warranty' },
    ],
    photos: [
      {
        image: imgGreySofa,
        filename: 'project-grey-tufted-sofa.png',
        title: 'Floor-to-Ceiling Luxury Drapes',
        caption: 'Custom double-layered sheer and blackout drapes with cove ceiling heading.',
      },
      {
        image: imgLiving,
        filename: 'project-living.png',
        title: 'Royal Living Room Ambient Drapes',
        caption: 'Recessed curtain track integrated into architectural false ceiling cove.',
      },
      {
        image: imgBedroom,
        filename: 'project-bedroom.png',
        title: 'Master Bedroom Blackout Window Treatments',
        caption: 'Complete light-blocking thermal curtains tailored for uninterrupted sleep.',
      },
    ],
  },
]
