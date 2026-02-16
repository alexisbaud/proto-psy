import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const ZONES = [
  { id: 'controle', label: 'Je contrôle', color: '#4a9668', bgColor: '#f1f8f4', borderColor: '#b8dcc7' },
  { id: 'influence', label: "J'influence", color: '#ffa726', bgColor: '#fff9f0', borderColor: '#ffe0b2' },
  { id: 'hors', label: 'Hors de mon contrôle', color: '#ff6b6b', bgColor: '#fff5f5', borderColor: '#ffc2cc' },
]

export default function StepPlacement({ items, placements, onPlace, onNext }) {
  const [activeItem, setActiveItem] = useState(null)

  const unplaced = items.filter(i => !placements[i.id])
  const allPlaced = items.every(i => placements[i.id])

  function handleItemTap(item) {
    setActiveItem(activeItem?.id === item.id ? null : item)
  }

  function handleZoneTap(zoneId) {
    if (activeItem) {
      onPlace(activeItem.id, zoneId)
      setActiveItem(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Place chaque élément</h2>
        <p className="text-sm text-gray-400">
          {activeItem
            ? 'Choisis une zone pour cet élément'
            : 'Sélectionne un élément puis une zone'}
        </p>
      </div>

      {/* Unplaced items */}
      {unplaced.length > 0 && (
        <div className="px-6 pb-3">
          <div className="flex flex-wrap gap-2">
            {unplaced.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemTap(item)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeItem?.id === item.id
                    ? 'bg-primary-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.text.length > 30 ? item.text.slice(0, 30) + '…' : item.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zones */}
      <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-4">
        {ZONES.map(zone => {
          const zoneItems = items.filter(i => placements[i.id] === zone.id)
          return (
            <button
              key={zone.id}
              onClick={() => handleZoneTap(zone.id)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                activeItem ? 'hover:scale-[1.01] cursor-pointer' : 'cursor-default'
              }`}
              style={{
                backgroundColor: zone.bgColor,
                borderColor: activeItem ? zone.color : zone.borderColor,
              }}
            >
              <h3 className="font-semibold text-sm mb-2" style={{ color: zone.color }}>
                {zone.label}
              </h3>
              {zoneItems.length > 0 ? (
                <div className="space-y-1.5">
                  {zoneItems.map(item => (
                    <div
                      key={item.id}
                      className="bg-white/70 rounded-xl px-3 py-2 text-xs text-gray-600"
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs opacity-50" style={{ color: zone.color }}>
                  Dépose un élément ici
                </p>
              )}
            </button>
          )
        })}
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          onClick={onNext}
          disabled={!allPlaced}
          className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
            allPlaced
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
