import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Star } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  { quote: "Reyansh transformed our home beyond our wildest dreams. Every detail was thoughtfully curated — from the custom sofa to the lighting. Truly a masterpiece.", author: "Priya Sharma", role: "Homeowner, Pune" },
  { quote: "The custom L-shaped sofa they crafted for our living room is absolutely stunning. Premium materials, impeccable finish, and unmatched comfort.", author: "Rahul Mehta", role: "Business Owner" },
  { quote: "Professional, creative, and incredibly detail-oriented. They understood our vision perfectly and delivered an interior that feels like a five-star hotel.", author: "Ananya Singh", role: "Interior Enthusiast" },
  { quote: "Our office interior received a complete overhaul by Reyansh. Clients now compliment us on the ambiance every single time they visit.", author: "Vikram Patel", role: "CEO, TechVista" },
  { quote: "The quality of craftsmanship in their sofas is unmatched. We ordered a full living room set and it exceeded all expectations.", author: "Deepika Nair", role: "Architect" },
]

export default function TestimonialSlider() {
  return (
    <section className="section testimonial-section">
      <div className="container">
        <div className="section-header">
          <span className="label">Testimonials</span>
          <h2>What Our <span>Clients</span> Say</h2>
          <p>Real stories from homeowners and businesses who trusted us with their spaces</p>
        </div>
        <Swiper modules={[Autoplay, Pagination]} pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }} loop spaceBetween={24} slidesPerView={1} breakpoints={{ 768: { slidesPerView: 2 } }} style={{ paddingBottom: '48px' }}>
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="testimonial-card">
                <div className="stars">{[...Array(5)].map((_, j) => <Star key={j} size={16} fill="var(--gold)" color="var(--gold)" />)}</div>
                <blockquote>"{t.quote}"</blockquote>
                <div className="author">{t.author}</div>
                <div className="role">{t.role}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
