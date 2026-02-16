import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DEBRIEF_SCRIPT } from '../../data/mockData'
import useStore from '../../store/useStore'
import { ArrowLeft } from 'lucide-react'

export default function Debrief() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const markSessionDebriefed = useStore(s => s.markSessionDebriefed)
  const [messages, setMessages] = useState([
    { type: 'bot', text: DEBRIEF_SCRIPT.start.message },
  ])
  const [currentNodeId, setCurrentNodeId] = useState('start')
  const [isComplete, setIsComplete] = useState(false)

  const currentNode = DEBRIEF_SCRIPT[currentNodeId]

  function handleOption(option) {
    const newMessages = [...messages, { type: 'user', text: option.label }]

    if (option.nextId && DEBRIEF_SCRIPT[option.nextId]) {
      const nextNode = DEBRIEF_SCRIPT[option.nextId]
      newMessages.push({ type: 'bot', text: nextNode.message })
      setCurrentNodeId(option.nextId)

      if (!nextNode.options || nextNode.options.length === 0) {
        setIsComplete(true)
        if (sessionId) {
          markSessionDebriefed(sessionId)
        }
      }
    } else {
      setIsComplete(true)
      if (sessionId) {
        markSessionDebriefed(sessionId)
      }
    }

    setMessages(newMessages)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Debrief de séance</h1>
          <p className="text-xs text-gray-400">Discussion guidée</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.type === 'user'
                  ? 'bg-primary-600 text-white rounded-br-md'
                  : 'bg-white text-gray-700 shadow-sm rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="bg-white px-4 pb-8 pt-3 border-t border-gray-100">
        {!isComplete && currentNode?.options && currentNode.options.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentNode.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOption(option)}
                className="px-4 py-2.5 bg-primary-50 text-primary-600 rounded-full text-sm font-medium active:scale-95 transition-transform border border-primary-200"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : isComplete ? (
          <button
            onClick={() => navigate('/app/journal', { replace: true })}
            className="w-full py-3.5 bg-primary-600 text-white rounded-2xl font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            Retourner au journal
          </button>
        ) : null}
      </div>
    </div>
  )
}
