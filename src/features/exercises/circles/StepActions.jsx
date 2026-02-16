import { ChevronRight } from 'lucide-react'

export default function StepActions({ items, placements, actions, onAction, onNext }) {
  const actionableItems = items.filter(i =>
    placements[i.id] === 'controle' || placements[i.id] === 'influence'
  )

  const allFilled = actionableItems.every(i => actions[i.id]?.trim())

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Définis tes actions</h2>
        <p className="text-sm text-gray-400">
          Que peux-tu faire concrètement pour chaque élément ?
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
        {actionableItems.map(item => {
          const zone = placements[item.id]
          const isControl = zone === 'controle'
          return (
            <div
              key={item.id}
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: isControl ? '#f1f8f4' : '#fff9f0',
                borderColor: isControl ? '#b8dcc7' : '#ffe0b2',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isControl ? '#4a966820' : '#ffa72620',
                    color: isControl ? '#4a9668' : '#ffa726',
                  }}
                >
                  {isControl ? 'Je contrôle' : "J'influence"}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-3">{item.text}</p>
              <textarea
                value={actions[item.id] || ''}
                onChange={(e) => onAction(item.id, e.target.value)}
                placeholder="Ce que je peux faire concrètement..."
                rows={2}
                className="w-full bg-white/70 rounded-xl px-3 py-2.5 text-sm text-gray-600 placeholder:text-gray-300 outline-none resize-none border border-transparent focus:border-gray-200 transition-colors"
              />
            </div>
          )
        })}
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          onClick={onNext}
          disabled={!allFilled}
          className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
            allFilled
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
