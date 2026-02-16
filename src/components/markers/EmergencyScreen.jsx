import { useNavigate } from 'react-router-dom'
import { Phone, Heart, ArrowLeft, Shield } from 'lucide-react'

export default function EmergencyScreen({ onClose }) {
  const navigate = useNavigate()

  function handleClose() {
    if (onClose) {
      onClose()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-rose-500 via-rose-400 to-rose-300">
      {/* Back button */}
      <div className="px-6 pt-14">
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6">
          <Heart size={36} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Tu n'es pas seul·e
        </h1>
        <p className="text-white/80 text-base mb-10 leading-relaxed">
          Si tu traverses un moment difficile, n'hésite pas à contacter un professionnel. Tu mérites d'être écouté·e.
        </p>

        {/* Emergency numbers */}
        <div className="w-full space-y-4">
          <a
            href="tel:3114"
            className="flex items-center gap-4 bg-white rounded-2xl p-5 w-full text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <Phone size={22} className="text-rose-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">3114</div>
              <div className="text-sm text-gray-500">Numéro national de prévention du suicide</div>
              <div className="text-xs text-gray-400 mt-0.5">24h/24 — 7j/7 — Gratuit</div>
            </div>
          </a>

          <a
            href="tel:112"
            className="flex items-center gap-4 bg-white/90 rounded-2xl p-5 w-full text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <Shield size={22} className="text-rose-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">112</div>
              <div className="text-sm text-gray-500">Urgences européennes</div>
              <div className="text-xs text-gray-400 mt-0.5">24h/24 — 7j/7 — Gratuit</div>
            </div>
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-8 pb-12 text-center">
        <button
          onClick={handleClose}
          className="text-white/70 text-sm underline"
        >
          Revenir à mon journal
        </button>
      </div>
    </div>
  )
}
