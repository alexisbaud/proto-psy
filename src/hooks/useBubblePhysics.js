import { useRef, useEffect, useCallback } from 'react'

// Lightweight force-directed bubble simulation
// Each bubble: { id, x, y, vx, vy, radius, homeX, homeY }

const DAMPING = 0.92
const REPULSION = 1.8
const HOME_PULL = 0.003
const JITTER = 0.15
const SELECTED_SCALE = 1.6
const BASE_RADIUS = 32

export default function useBubblePhysics(moods, containerSize, selectedId) {
  const bubblesRef = useRef([])
  const frameRef = useRef(null)
  const listenersRef = useRef(new Set())

  // Initialize or re-sync bubbles when moods change
  useEffect(() => {
    if (!containerSize.w || !containerSize.h) return

    const cx = containerSize.w / 2
    const cy = containerSize.h / 2
    const existing = new Map(bubblesRef.current.map(b => [b.id, b]))

    bubblesRef.current = moods.map((mood, i) => {
      const prev = existing.get(mood.id)
      if (prev) {
        return { ...prev, homeX: mood.homeX, homeY: mood.homeY }
      }
      // Scatter around home position with some randomness
      const angle = (i / moods.length) * Math.PI * 2 + Math.random() * 0.5
      const dist = 20 + Math.random() * 30
      return {
        id: mood.id,
        x: mood.homeX + Math.cos(angle) * dist,
        y: mood.homeY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: BASE_RADIUS,
        homeX: mood.homeX,
        homeY: mood.homeY,
      }
    })
  }, [moods, containerSize])

  // Update selected bubble radius
  useEffect(() => {
    bubblesRef.current.forEach(b => {
      b.targetRadius = b.id === selectedId ? BASE_RADIUS * SELECTED_SCALE : BASE_RADIUS
    })
  }, [selectedId])

  // Physics tick
  const tick = useCallback(() => {
    const bubbles = bubblesRef.current
    if (!bubbles.length) return

    for (let i = 0; i < bubbles.length; i++) {
      const a = bubbles[i]

      // Lerp radius toward target
      const target = a.targetRadius || BASE_RADIUS
      a.radius += (target - a.radius) * 0.12

      // If selected, pull toward center of container
      let pullX, pullY
      if (a.id === selectedId) {
        pullX = (containerSize.w / 2 - a.x) * 0.04
        pullY = ((containerSize.h * 0.38) - a.y) * 0.04
      } else {
        // Home pull
        pullX = (a.homeX - a.x) * HOME_PULL
        pullY = (a.homeY - a.y) * HOME_PULL
      }

      a.vx += pullX
      a.vy += pullY

      // Gentle random jitter
      a.vx += (Math.random() - 0.5) * JITTER
      a.vy += (Math.random() - 0.5) * JITTER

      // Bubble-bubble repulsion
      for (let j = i + 1; j < bubbles.length; j++) {
        const b = bubbles[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const minDist = a.radius + b.radius + 4
        if (dist < minDist) {
          const force = (minDist - dist) / dist * REPULSION
          const fx = dx * force * 0.5
          const fy = dy * force * 0.5
          a.vx -= fx
          a.vy -= fy
          b.vx += fx
          b.vy += fy
        }
      }

      // Wall containment
      const margin = a.radius + 2
      if (a.x < margin) a.vx += (margin - a.x) * 0.1
      if (a.x > containerSize.w - margin) a.vx += (containerSize.w - margin - a.x) * 0.1
      if (a.y < margin) a.vy += (margin - a.y) * 0.1
      if (a.y > containerSize.h - margin) a.vy += (containerSize.h - margin - a.y) * 0.1

      // Apply velocity
      a.vx *= DAMPING
      a.vy *= DAMPING
      a.x += a.vx
      a.y += a.vy
    }

    // Notify subscribers
    listenersRef.current.forEach(fn => fn([...bubbles]))
  }, [selectedId, containerSize])

  // Animation loop
  useEffect(() => {
    let running = true
    function loop() {
      if (!running) return
      tick()
      frameRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      running = false
      cancelAnimationFrame(frameRef.current)
    }
  }, [tick])

  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn)
    return () => listenersRef.current.delete(fn)
  }, [])

  return { subscribe, bubblesRef }
}
