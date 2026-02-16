import { useState, useRef, useEffect } from 'react'

export default function StepLetGo({ items, onComplete }) {
  const [remaining, setRemaining] = useState(items.map(i => i.id))
  const [swiping, setSwiping] = useState(null)
  const startPos = useRef(null)

  useEffect(() => {
    if (remaining.length === 0) {
      setTimeout(onComplete, 600)
    }
  }, [remaining, onComplete])

  function handleTouchStart(id, e) {
    const touch = e.touches?.[0] || e
    startPos.current = { x: touch.clientX, y: touch.clientY, id }
  }

  function handleTouchMove(e) {
    if (!startPos.current) return
    const touch = e.touches?.[0] || e
    const dx = touch.clientX - startPos.current.x
    const dy = touch.clientY - startPos.current.y
    const dist = Math.hypot(dx, dy)
    if (dist > 20) {
      setSwiping({ id: startPos.current.id, dx, dy, dist })
    }
  }

  function handleTouchEnd() {
    if (swiping && swiping.dist > 80) {
      setRemaining(prev => prev.filter(id => id !== swiping.id))
    }
    setSwiping(null)
    startPos.current = null
  }

  if (items.length === 0) {
    // No "hors de contrôle" items, skip this step
    useEffect(() => { onComplete() }, [])
    return null
  }

  return (
    <div
      className="flex flex-col h-full"
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="px-6 pt-4 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Lâche prise</h2>
        <p className="text-sm text-gray-400">
          Balaye chaque élément dans n'importe quelle direction pour le laisser partir
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        {remaining.length === 0 ? (
          <div className="text-center">
            <div className="text-5xl mb-4">🕊️</div>
            <p className="text-gray-400 text-sm">Tu as tout lâché. Bravo !</p>
          </div>
        ) : (
          remaining.map(id => {
            const item = items.find(i => i.id === id)
            if (!item) return null
            const isCurrentlySwiping = swiping?.id === id
            const transform = isCurrentlySwiping
              ? `translate(${swiping.dx}px, ${swiping.dy}px) rotate(${swiping.dx * 0.1}deg)`
              : ''
            const opacity = isCurrentlySwiping
              ? Math.max(0, 1 - swiping.dist / 200)
              : 1

            return (
              <div
                key={id}
                onMouseDown={(e) => handleTouchStart(id, e)}
                onTouchStart={(e) => handleTouchStart(id, e)}
                className="w-full bg-danger-50 border-2 border-danger-100 rounded-2xl p-5 cursor-grab active:cursor-grabbing transition-opacity select-none"
                style={{ transform, opacity }}
              >
                <p className="text-sm font-medium text-gray-600 text-center">{item.text}</p>
                <p className="text-xs text-danger-500 text-center mt-2">↔ Balaye pour lâcher prise</p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
