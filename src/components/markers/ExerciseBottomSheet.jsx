import { X, Clock, ArrowRight } from 'lucide-react'

export default function ExerciseBottomSheet({ exercise, onStart, onClose }) {
  if (!exercise) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full bg-white rounded-t-3xl p-6 pb-10 animate-slide-up">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <X size={16} className="text-gray-400" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
          <span className="text-2xl">{exercise.icon || '🎯'}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{exercise.title}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{exercise.description}</p>

        <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
          <Clock size={14} />
          <span>{exercise.duration}</span>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-primary-600 text-white font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          Commencer l'exercice
          <ArrowRight size={18} />
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
