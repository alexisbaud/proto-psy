import { useRef, useEffect } from 'react'
import { RotateCcw, Eye } from 'lucide-react'

export default function JournalEntry({ entry, isActive, onContentChange, onFocus, onNavigateExercise }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && entry.content && !editorRef.current.innerText.trim()) {
      editorRef.current.innerText = entry.content
    }
  }, [])

  useEffect(() => {
    if (isActive && editorRef.current) {
      editorRef.current.focus()
    }
  }, [isActive])

  function handleInput() {
    const text = editorRef.current?.innerText || ''
    onContentChange(entry.id, text)
  }

  return (
    <div className="mb-4">
      {/* Entry separator */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-400">{entry.time}</span>
        {entry.mood && (
          <span
            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: entry.moodColor ? `${entry.moodColor}20` : '#f3f4f6',
              color: entry.moodColor || '#9ca3af',
            }}
          >
            {entry.mood}
          </span>
        )}
      </div>

      {/* Content area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={onFocus}
        data-placeholder="Écris tes pensées ici..."
        className={`min-h-[60px] outline-none text-[15px] leading-relaxed text-gray-700 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 ${
          isActive ? 'bg-primary-50/30 -mx-3 px-3 py-2 rounded-xl' : ''
        }`}
      />

      {/* Completed exercise card */}
      {entry.completedExercise && (
        <div className="mt-3 bg-sage-50 border border-sage-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-200 flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-sage-500">{entry.completedExercise.title}</p>
                <p className="text-xs text-sage-400">Exercice complété</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onNavigateExercise}
                className="w-8 h-8 rounded-lg bg-sage-200 flex items-center justify-center"
              >
                <Eye size={14} className="text-sage-500" />
              </button>
              <button
                onClick={onNavigateExercise}
                className="w-8 h-8 rounded-lg bg-sage-200 flex items-center justify-center"
              >
                <RotateCcw size={14} className="text-sage-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debrief card */}
      {entry.debriefCompleted && (
        <div className="mt-3 bg-lavender-50 border border-lavender-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lavender-200 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-lavender-500">Debrief de séance</p>
              <p className="text-xs text-lavender-400">Complété</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
