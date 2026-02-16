import useStore from '../../store/useStore'
import { TrendingUp, Smile, BookOpen, Dumbbell, Calendar } from 'lucide-react'

function getDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function formatShortDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
}

export default function Progression() {
  const journalEntries = useStore(s => s.journalEntries)
  const completedExercises = useStore(s => s.completedExercises)
  const sessions = useStore(s => s.sessions)

  // Stats
  const totalEntries = journalEntries.length
  const totalExercises = completedExercises.length
  const totalSessions = sessions.filter(s => s.type === 'past').length

  // Mood history for chart
  const moodColors = journalEntries
    .filter(e => e.moodColor)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // Activity calendar (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = getDaysAgo(6 - i)
    const dateStr = date.toDateString()
    const hasEntry = journalEntries.some(e => new Date(e.date).toDateString() === dateStr)
    return { date, hasEntry }
  })

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Ma progression</h1>
        <p className="text-sm text-gray-400 mt-1">Ton parcours en un coup d'œil</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary-50 rounded-2xl p-4 text-center">
            <BookOpen size={20} className="text-primary-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary-600">{totalEntries}</p>
            <p className="text-[10px] text-primary-400 font-medium">Entrées</p>
          </div>
          <div className="bg-sage-50 rounded-2xl p-4 text-center">
            <Dumbbell size={20} className="text-sage-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-sage-500">{totalExercises + 1}</p>
            <p className="text-[10px] text-sage-400 font-medium">Exercices</p>
          </div>
          <div className="bg-lavender-50 rounded-2xl p-4 text-center">
            <Calendar size={20} className="text-lavender-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-lavender-500">{totalSessions}</p>
            <p className="text-[10px] text-lavender-400 font-medium">Séances</p>
          </div>
        </div>

        {/* Activity calendar */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-gray-400" />
            Activité de la semaine
          </h3>
          <div className="flex justify-between">
            {last7Days.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.hasEntry
                      ? 'bg-primary-500'
                      : 'bg-gray-200'
                  }`}
                >
                  {day.hasEntry && <Check size={14} className="text-white" />}
                </div>
                <span className="text-[10px] text-gray-400">
                  {formatShortDate(day.date).split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood timeline */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Smile size={16} className="text-gray-400" />
            Humeurs récentes
          </h3>
          {moodColors.length > 0 ? (
            <div className="space-y-2">
              {moodColors.slice(-5).map((entry, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.moodColor }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{entry.mood}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: entry.moodColor,
                          width: `${40 + Math.random() * 60}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              Pas encore assez de données
            </p>
          )}
        </div>

        {/* Streak */}
        <div className="bg-warm-50 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🔥</div>
          <p className="text-lg font-bold text-warm-500">3 jours consécutifs</p>
          <p className="text-xs text-warm-400">Continue comme ça !</p>
        </div>
      </div>
    </div>
  )
}

function Check({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
