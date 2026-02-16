import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { detectMarkers } from '../../utils/markerDetection'
import EmergencyScreen from '../../components/markers/EmergencyScreen'
import ExerciseBottomSheet from '../../components/markers/ExerciseBottomSheet'
import JournalEntry from './JournalEntry'
import { Plus } from 'lucide-react'

function formatDateHeading(date) {
  const today = new Date()
  const d = new Date(date)
  const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function groupEntriesByDate(entries) {
  const groups = {}
  entries.forEach(entry => {
    const dateKey = new Date(entry.date).toDateString()
    if (!groups[dateKey]) {
      groups[dateKey] = { date: entry.date, entries: [] }
    }
    groups[dateKey].entries.push(entry)
  })
  // Oldest first (ascending)
  return Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date))
}

export default function Journal() {
  const navigate = useNavigate()
  const journalEntries = useStore(s => s.journalEntries)
  const addJournalEntry = useStore(s => s.addJournalEntry)
  const updateJournalEntry = useStore(s => s.updateJournalEntry)
  const currentMood = useStore(s => s.currentMood)
  const currentMoodColor = useStore(s => s.currentMoodColor)

  const [showEmergency, setShowEmergency] = useState(false)
  const [bottomSheet, setBottomSheet] = useState(null)
  const [activeEntryId, setActiveEntryId] = useState(null)
  const detectedMarkers = useRef(new Set())
  const debounceTimer = useRef(null)
  const scrollRef = useRef(null)
  const lastMoodUsed = useRef(null)

  const groups = groupEntriesByDate(journalEntries)

  // Create a new empty entry when arriving with a mood (including from "+" button)
  // or on first mount if no empty entry exists for today
  useEffect(() => {
    const moodKey = currentMood || '__none__'
    // If the mood changed since last time (user did a new check-in), create a new entry
    if (lastMoodUsed.current !== moodKey) {
      lastMoodUsed.current = moodKey
      const newEntry = {
        id: `entry-${Date.now()}`,
        date: new Date(),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        mood: currentMood || null,
        moodColor: currentMoodColor || null,
        content: '',
      }
      addJournalEntry(newEntry)
      setActiveEntryId(newEntry.id)
    }
  }, [currentMood])

  // Scroll to bottom on mount and when entries change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [groups.length, journalEntries.length])

  const handleContentChange = useCallback((entryId, content) => {
    updateJournalEntry(entryId, { content })

    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      const marker = detectMarkers(content)
      if (marker && !detectedMarkers.current.has(marker.keyword)) {
        detectedMarkers.current.add(marker.keyword)

        if (marker.type === 'danger') {
          setShowEmergency(true)
        } else if (marker.type === 'cognitive_distortion') {
          setBottomSheet({
            title: 'Cercles de contrôle',
            description: 'Cet exercice t\'aide à distinguer ce que tu contrôles de ce qui te dépasse, pour mieux investir ton énergie.',
            duration: '10 min',
            icon: '🎯',
            route: '/exercise/circles',
          })
        } else if (marker.type === 'insomnia') {
          setBottomSheet({
            title: 'Respiration guidée',
            description: 'Un exercice de relaxation pour apaiser ton esprit et favoriser un sommeil réparateur.',
            duration: '5 min',
            icon: '🌙',
            placeholder: true,
          })
        } else if (marker.type === 'rumination') {
          setBottomSheet({
            title: 'Ancrage sensoriel',
            description: 'Recentre-toi sur le moment présent grâce à tes 5 sens pour briser le cycle des pensées.',
            duration: '5 min',
            icon: '🧘',
            placeholder: true,
          })
        }
      }
    }, 800)
  }, [updateJournalEntry])

  function handleStartExercise() {
    if (bottomSheet?.route) {
      navigate(bottomSheet.route, { state: { returnEntryId: activeEntryId } })
    }
    setBottomSheet(null)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.exerciseData && activeEntryId) {
        updateJournalEntry(activeEntryId, {
          completedExercise: e.detail.exerciseData,
        })
      }
    }
    window.addEventListener('exerciseComplete', handler)
    return () => window.removeEventListener('exerciseComplete', handler)
  }, [activeEntryId])

  if (showEmergency) {
    return <EmergencyScreen onClose={() => setShowEmergency(false)} />
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mon journal</h1>
        <button
          onClick={() => navigate('/mood')}
          className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center active:scale-95 transition-transform shadow-sm"
          title="Nouvelle entrée avec mood"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Journal content — oldest on top, newest (+ editor) at bottom */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-4">
        {groups.map((group, gi) => (
          <div key={gi}>
            {/* Date heading */}
            <div className="flex items-center gap-3 py-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {formatDateHeading(group.date)}
              </h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Entries in chronological order */}
            {group.entries
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(entry => (
                <JournalEntry
                  key={entry.id}
                  entry={entry}
                  isActive={activeEntryId === entry.id}
                  onContentChange={handleContentChange}
                  onFocus={() => setActiveEntryId(entry.id)}
                  onNavigateExercise={() => navigate('/exercise/circles', { state: { returnEntryId: entry.id } })}
                />
              ))}
          </div>
        ))}

        {journalEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-gray-400 text-sm">
              Ton journal est vide pour le moment.<br />
              Commence à écrire ci-dessous.
            </p>
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      {bottomSheet && (
        <ExerciseBottomSheet
          exercise={bottomSheet}
          onStart={handleStartExercise}
          onClose={() => setBottomSheet(null)}
        />
      )}
    </div>
  )
}
