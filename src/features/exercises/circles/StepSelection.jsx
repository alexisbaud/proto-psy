import { Check, ChevronRight } from 'lucide-react'

export default function StepSelection({ items, selected, onToggle, onNext }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Choisis tes préoccupations</h2>
        <p className="text-sm text-gray-400">Sélectionne jusqu'à 5 éléments qui te parlent</p>
        <p className="text-xs text-primary-500 font-medium mt-1">{selected.length} / 5 sélectionnés</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="space-y-2">
          {items.map(item => {
            const isSelected = selected.includes(item.id)
            return (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-primary-500' : 'bg-gray-100'
                }`}>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <span className={`text-[14px] leading-snug ${
                  isSelected ? 'text-primary-700 font-medium' : 'text-gray-600'
                }`}>
                  {item.text}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
            selected.length > 0
              ? 'bg-primary-600 text-white active:scale-[0.98]'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          Continuer
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
