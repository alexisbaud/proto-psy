import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { Calendar, Plus, MessageCircle, Clock, Check, X } from 'lucide-react'

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatRelative(date) {
  const now = new Date()
  const d = new Date(date)
  const diffDays = Math.round((d - now) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === -1) return 'Hier'
  if (diffDays === 1) return 'Demain'
  if (diffDays < 0) return `Il y a ${Math.abs(diffDays)} jours`
  return `Dans ${diffDays} jours`
}

export default function Sessions() {
  const navigate = useNavigate()
  const sessions = useStore(s => s.sessions)
  const addSession = useStore(s => s.addSession)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDate, setNewDate] = useState('')

  const pastSessions = sessions.filter(s => s.type === 'past').sort((a, b) => new Date(b.date) - new Date(a.date))
  const upcomingSessions = sessions.filter(s => s.type === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date))

  function handleAddSession() {
    if (!newDate) return
    addSession({
      id: `session-${Date.now()}`,
      date: new Date(newDate),
      therapist: 'Dr. Martin',
      type: 'upcoming',
      debriefCompleted: false,
    })
    setShowAddForm(false)
    setNewDate('')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mes séances</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center active:scale-95 transition-transform shadow-sm"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {/* Upcoming sessions */}
        {upcomingSessions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">À venir</h2>
            <div className="space-y-3">
              {upcomingSessions.map(session => (
                <div key={session.id} className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                        <Calendar size={18} className="text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{session.therapist}</p>
                        <p className="text-xs text-gray-400">{formatDate(session.date)}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary-500 bg-primary-100 px-2.5 py-1 rounded-full">
                      {formatRelative(session.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past sessions */}
        {pastSessions.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Passées</h2>
            <div className="space-y-3">
              {pastSessions.map(session => (
                <div key={session.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Clock size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{session.therapist}</p>
                        <p className="text-xs text-gray-400">{formatDate(session.date)}</p>
                      </div>
                    </div>
                    {session.debriefCompleted ? (
                      <span className="text-xs font-medium text-sage-500 bg-sage-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Check size={12} />
                        Debriefé
                      </span>
                    ) : (
                      <button
                        onClick={() => navigate(`/debrief/${session.id}`)}
                        className="text-xs font-medium text-lavender-500 bg-lavender-50 px-2.5 py-1 rounded-full flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <MessageCircle size={12} />
                        Debriefer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add session modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-40 flex items-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddForm(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-6 pb-10">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X size={16} className="text-gray-400" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nouvelle séance</h3>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Date de la séance</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 outline-none focus:border-primary-400 mb-4"
            />
            <button
              onClick={handleAddSession}
              disabled={!newDate}
              className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                newDate
                  ? 'bg-primary-600 text-white active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-300'
              }`}
            >
              Ajouter la séance
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
