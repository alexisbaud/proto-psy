import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { MOOD_QUADRANTS, CONTEXT_TAGS } from '../../data/mockData'
import { ArrowRight, X } from 'lucide-react'

// ─── Grid configuration ─────────────────────────────────────────────────────

const CELL = 105
const GAP = 40
const HALF = 3 * CELL           // 315px per quadrant side
const GRID_W = HALF + GAP + HALF // 670px total
const GRID_H = HALF + GAP + HALF
const BUBBLE = 64               // bubble diameter
const MAX_FISHEYE = 280         // distance at which scale bottoms out

// Build flat mood list with pre-computed grid positions
function buildMoods() {
  const list = []
  const quads = [
    { key: 'highUnpleasant', sr: 0, sc: 0 },
    { key: 'highPleasant',   sr: 0, sc: 3 },
    { key: 'lowUnpleasant',  sr: 3, sc: 0 },
    { key: 'lowPleasant',    sr: 3, sc: 3 },
  ]
  quads.forEach(({ key, sr, sc }) => {
    MOOD_QUADRANTS[key].moods.forEach((m, i) => {
      const col = sc + (i % 3)
      const row = sr + Math.floor(i / 3)
      list.push({
        ...m,
        quadrant: key,
        gx: (col < 3 ? col * CELL : col * CELL + GAP) + CELL / 2,
        gy: (row < 3 ? row * CELL : row * CELL + GAP) + CELL / 2,
      })
    })
  })
  return list
}

const ALL_MOODS = buildMoods()

function findClosest(ox, oy) {
  let best = null, min = Infinity
  for (const m of ALL_MOODS) {
    const dx = m.gx - GRID_W / 2 + ox
    const dy = m.gy - GRID_H / 2 + oy
    const d = dx * dx + dy * dy
    if (d < min) { min = d; best = m }
  }
  return best
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function MoodSelector() {
  const navigate = useNavigate()
  const setCurrentMood = useStore(s => s.setCurrentMood)

  const [phase, setPhase] = useState('grid')
  const [selectedId, setSelectedId] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const containerRef = useRef(null)
  const [viewSize, setViewSize] = useState({ w: 0, h: 0 })

  // Pan offset — slight initial bias toward lowPleasant so "Paisible" is selected
  const [offset, setOffset] = useState({ x: -8, y: -8 })
  const oRef = useRef({ x: -8, y: -8 })

  const dragRef = useRef(null)
  const lastRef = useRef({ x: 0, y: 0, t: 0 })
  const velRef = useRef({ vx: 0, vy: 0 })
  const animRef = useRef(null)

  function setO(o) { oRef.current = o; setOffset(o) }

  // Measure container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) =>
      setViewSize({ w: e.contentRect.width, h: e.contentRect.height })
    )
    ro.observe(el)
    setViewSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  // Auto-select closest mood to viewport center
  useEffect(() => {
    const m = findClosest(offset.x, offset.y)
    if (m) setSelectedId(m.id)
  }, [offset])

  const selectedMood = ALL_MOODS.find(m => m.id === selectedId)

  // ─── Animations ──────────────────────────────────────────────────────────

  function stop() {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null }
  }

  function snapTo(mood) {
    if (!mood) return
    const tx = GRID_W / 2 - mood.gx
    const ty = GRID_H / 2 - mood.gy
    stop()
    ;(function tick() {
      const { x, y } = oRef.current
      const dx = tx - x, dy = ty - y
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) { setO({ x: tx, y: ty }); return }
      setO({ x: x + dx * 0.14, y: y + dy * 0.14 })
      animRef.current = requestAnimationFrame(tick)
    })()
  }

  function fling() {
    let { vx, vy } = velRef.current
    if (Math.abs(vx) < 1 && Math.abs(vy) < 1) {
      snapTo(findClosest(oRef.current.x, oRef.current.y))
      return
    }
    stop()
    ;(function tick() {
      vx *= 0.94; vy *= 0.94
      if (Math.abs(vx) < 0.4 && Math.abs(vy) < 0.4) {
        snapTo(findClosest(oRef.current.x, oRef.current.y))
        return
      }
      const { x, y } = oRef.current
      setO({ x: x + vx, y: y + vy })
      animRef.current = requestAnimationFrame(tick)
    })()
  }

  // ─── Pointer handlers ────────────────────────────────────────────────────

  function onDown(e) {
    stop()
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      origX: oRef.current.x, origY: oRef.current.y,
      moved: false,
    }
    lastRef.current = { x: e.clientX, y: e.clientY, t: Date.now() }
    velRef.current = { vx: 0, vy: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onMove(e) {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX, dy = e.clientY - d.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true

    const now = Date.now(), dt = Math.max(now - lastRef.current.t, 1)
    velRef.current = {
      vx: (e.clientX - lastRef.current.x) / dt * 16,
      vy: (e.clientY - lastRef.current.y) / dt * 16,
    }
    lastRef.current = { x: e.clientX, y: e.clientY, t: now }
    setO({ x: d.origX + dx, y: d.origY + dy })
  }

  function onUp(e) {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null

    if (!d.moved) {
      // Tap → find tapped mood and snap to it
      const rect = containerRef.current.getBoundingClientRect()
      const px = e.clientX - rect.left, py = e.clientY - rect.top
      const gridL = viewSize.w / 2 - GRID_W / 2 + oRef.current.x
      const gridT = viewSize.h / 2 - GRID_H / 2 + oRef.current.y
      const mgx = px - gridL, mgy = py - gridT
      let best = null, min = Infinity
      for (const m of ALL_MOODS) {
        const d2 = (m.gx - mgx) ** 2 + (m.gy - mgy) ** 2
        if (d2 < min && d2 < CELL * CELL) { min = d2; best = m }
      }
      if (best) snapTo(best)
    } else {
      fling()
    }
  }

  // ─── Actions ─────────────────────────────────────────────────────────────

  function handleNext() { setPhase('context') }

  function handleConfirm() {
    if (selectedMood) setCurrentMood(selectedMood.label, selectedMood.color)
    navigate('/app/journal', { replace: true })
  }

  function handleSkip() {
    setCurrentMood(null, null)
    navigate('/app/journal', { replace: true })
  }

  function toggleTag(id) {
    setSelectedTags(p => p.includes(id) ? p.filter(t => t !== id) : [...p, id])
  }

  // ─── Context screen ─────────────────────────────────────────────────────

  if (phase === 'context' && selectedMood) {
    return (
      <div className="flex flex-col h-full overflow-hidden" style={{ background: selectedMood.color }}>
        <div className="flex-shrink-0 px-5 pt-12 pb-6 flex items-center justify-between">
          <button onClick={() => setPhase('grid')}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <X size={16} className="text-white" />
          </button>
          <button onClick={handleSkip} className="text-white/60 text-sm font-medium">
            Passer
          </button>
        </div>

        <div className="flex-shrink-0 px-6 pb-8 text-center">
          <p className="text-white/60 text-sm mb-2">Je me sens</p>
          <h1 className="text-4xl font-bold text-white mb-3">{selectedMood.label}</h1>
          <p className="text-white/70 text-[15px] leading-relaxed max-w-[280px] mx-auto">
            {selectedMood.def}
          </p>
        </div>

        <div className="flex-1 bg-white rounded-t-[32px] px-6 pt-6 pb-8 flex flex-col">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
            Qu'est-ce qui influence ton humeur ?
          </h3>
          <p className="text-[13px] text-gray-400 mb-4">Optionnel — tu peux en choisir plusieurs</p>

          <div className="flex flex-wrap gap-2 mb-auto">
            {CONTEXT_TAGS.map(tag => {
              const active = selectedTags.includes(tag.id)
              return (
                <button key={tag.id} onClick={() => toggleTag(tag.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                    active ? 'text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600'
                  }`}
                  style={active ? { backgroundColor: selectedMood.color } : undefined}
                >
                  <span>{tag.icon}</span>
                  {tag.label}
                </button>
              )
            })}
          </div>

          <button onClick={handleConfirm}
            className="w-full py-4 rounded-2xl text-white font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-4"
            style={{ backgroundColor: selectedMood.color }}>
            Valider
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ─── Grid screen ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#fafafa]">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-12 pb-2 flex items-center justify-between z-10">
        <h1 className="text-[22px] font-bold text-gray-900">Comment te sens-tu ?</h1>
        <button onClick={handleSkip}
          className="w-9 h-9 rounded-full bg-gray-200/80 flex items-center justify-center">
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Grid viewport */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
      >
        {/* Center reticle */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-[72px] h-[72px] rounded-full border-2 border-gray-300/25" />
        </div>

        {/* Grid plane — positioned via transform for GPU perf */}
        {viewSize.w > 0 && (
          <div
            style={{
              position: 'absolute',
              width: GRID_W,
              height: GRID_H,
              left: 0,
              top: 0,
              transform: `translate(${viewSize.w / 2 - GRID_W / 2 + offset.x}px, ${viewSize.h / 2 - GRID_H / 2 + offset.y}px)`,
              willChange: 'transform',
            }}
          >
            {/* Quadrant backgrounds */}
            <div className="absolute rounded-2xl"
              style={{ left: 0, top: 0, width: HALF, height: HALF, background: MOOD_QUADRANTS.highUnpleasant.bgLight }} />
            <div className="absolute rounded-2xl"
              style={{ left: HALF + GAP, top: 0, width: HALF, height: HALF, background: MOOD_QUADRANTS.highPleasant.bgLight }} />
            <div className="absolute rounded-2xl"
              style={{ left: 0, top: HALF + GAP, width: HALF, height: HALF, background: MOOD_QUADRANTS.lowUnpleasant.bgLight }} />
            <div className="absolute rounded-2xl"
              style={{ left: HALF + GAP, top: HALF + GAP, width: HALF, height: HALF, background: MOOD_QUADRANTS.lowPleasant.bgLight }} />

            {/* Axis labels on the grid */}
            <span className="absolute text-[9px] font-bold text-gray-400/70 uppercase tracking-wider whitespace-nowrap"
              style={{ left: '50%', top: 8, transform: 'translateX(-50%)' }}>
              Énergie haute ↑
            </span>
            <span className="absolute text-[9px] font-bold text-gray-400/70 uppercase tracking-wider whitespace-nowrap"
              style={{ left: '50%', bottom: 8, transform: 'translateX(-50%)' }}>
              Énergie basse ↓
            </span>
            <span className="absolute text-[9px] font-bold text-gray-400/70 uppercase tracking-wider"
              style={{ left: 8, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: '0 50%' }}>
              Désagréable
            </span>
            <span className="absolute text-[9px] font-bold text-gray-400/70 uppercase tracking-wider"
              style={{ right: 8, top: '50%', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: '100% 50%' }}>
              Agréable
            </span>

            {/* Mood bubbles */}
            {ALL_MOODS.map(mood => {
              const dx = mood.gx - GRID_W / 2 + offset.x
              const dy = mood.gy - GRID_H / 2 + offset.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              const t = Math.min(dist / MAX_FISHEYE, 1)
              const scale = 1.5 - t * 0.8   // 1.5 at center → 0.7 far away
              const opacity = 0.55 + (1 - t) * 0.45
              const isSelected = selectedId === mood.id

              return (
                <div
                  key={mood.id}
                  className="absolute"
                  style={{
                    left: mood.gx,
                    top: mood.gy,
                    transform: `translate(-50%, -50%) scale(${scale.toFixed(3)})`,
                    zIndex: isSelected ? 10 : Math.round((1 - t) * 5),
                    willChange: 'transform',
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: BUBBLE,
                      height: BUBBLE,
                      backgroundColor: mood.color,
                      opacity,
                      boxShadow: isSelected
                        ? `0 4px 20px ${mood.color}55, 0 0 0 3px white`
                        : `0 2px 8px ${mood.color}22`,
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <span className="text-white text-[11px] font-semibold text-center leading-tight select-none px-1">
                      {mood.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom sheet — always visible since a mood is always selected */}
      <div className="flex-shrink-0">
        {selectedMood && (
          <div
            className="bg-white rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-5 pt-4 pb-8"
            style={{ borderTop: `3px solid ${selectedMood.color}` }}
          >
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
            <h2 className="text-[22px] font-bold text-gray-900">{selectedMood.label}</h2>
            <p className="text-[14px] text-gray-500 leading-relaxed mt-1 mb-4">{selectedMood.def}</p>
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{ backgroundColor: selectedMood.color }}
            >
              Suivant
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
