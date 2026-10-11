import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const phone = '917887556060'
  const msg = encodeURIComponent('Hi Reyansh Studio! I would like to inquire about interior design & custom furniture.')
  return (
    <a href={`https://wa.me/${phone}?text=${msg}`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" aria-label="Chat on WhatsApp">
      <MessageCircle size={26} color="#fff" />
    </a>
  )
}
