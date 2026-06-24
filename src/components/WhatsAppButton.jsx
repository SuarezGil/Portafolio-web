import { FiMessageCircle } from 'react-icons/fi'

const PHONE = '50253170347'
const MSG = 'Hola%20Iosef%2C%20vi%20tu%20portafolio%20y%20quiero%20contactarte'

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-400 hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp"
    >
      <FiMessageCircle size={28} />
    </a>
  )
}
