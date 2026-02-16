import { Check } from 'lucide-react'

export default function StepRecap({ items, placements, actions, onFinish }) {
  const controlItems = items.filter(i => placements[i.id] === 'controle')
  const influenceItems = items.filter(i => placements[i.id] === 'influence')

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-2">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-bold text-gray-900">Bravo !</h2>
          <p className="text-sm text-gray-400 mt-1">Voici le récap de ton exercice</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
        {controlItems.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-sage-500 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sage-400" />
              Je contrôle
            </h3>
            <div className="space-y-2">
              {controlItems.map(item => (
                <div key={item.id} className="bg-sage-50 rounded-2xl p-4 border border-sage-200">
                  <p className="text-sm font-medium text-gray-700">{item.text}</p>
                  {actions[item.id] && (
                    <p className="text-xs text-sage-500 mt-2 flex items-start gap-1.5">
                      <Check size={12} className="mt-0.5 flex-shrink-0" />
                      {actions[item.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {influenceItems.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-warm-500 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warm-400" />
              J'influence
            </h3>
            <div className="space-y-2">
              {influenceItems.map(item => (
                <div key={item.id} className="bg-warm-50 rounded-2xl p-4 border border-warm-200">
                  <p className="text-sm font-medium text-gray-700">{item.text}</p>
                  {actions[item.id] && (
                    <p className="text-xs text-warm-500 mt-2 flex items-start gap-1.5">
                      <Check size={12} className="mt-0.5 flex-shrink-0" />
                      {actions[item.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          onClick={onFinish}
          className="w-full py-4 rounded-2xl bg-primary-600 text-white font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          Terminer l'exercice
          <Check size={18} />
        </button>
      </div>
    </div>
  )
}
