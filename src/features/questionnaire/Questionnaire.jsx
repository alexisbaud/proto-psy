import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { QUESTIONNAIRE_QUESTIONS } from '../../data/mockData'
import { ChevronRight, Sparkles } from 'lucide-react'

export default function Questionnaire() {
  const navigate = useNavigate()
  const setQuestionnaireCompleted = useStore(s => s.setQuestionnaireCompleted)
  const setQuestionnaireAnswer = useStore(s => s.setQuestionnaireAnswer)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const question = QUESTIONNAIRE_QUESTIONS[currentIndex]
  const total = QUESTIONNAIRE_QUESTIONS.length
  const progress = ((currentIndex) / total) * 100

  const currentAnswer = answers[question.id]
  const canProceed = question.type === 'multiple'
    ? currentAnswer && currentAnswer.length > 0
    : !!currentAnswer

  function handleSelect(optionId) {
    if (question.type === 'multiple') {
      const prev = answers[question.id] || []
      const next = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
      setAnswers({ ...answers, [question.id]: next })
    } else {
      setAnswers({ ...answers, [question.id]: optionId })
    }
  }

  function handleNext() {
    setQuestionnaireAnswer(question.id, answers[question.id])
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setQuestionnaireCompleted()
      navigate('/mood', { replace: true })
    }
  }

  const isSelected = (optionId) => {
    if (question.type === 'multiple') {
      return (currentAnswer || []).includes(optionId)
    }
    return currentAnswer === optionId
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-primary-50 to-white">
      {/* Progress bar */}
      <div className="px-6 pt-14 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary-400">{currentIndex + 1} / {total}</span>
        </div>
        <div className="h-1.5 bg-primary-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 pt-8 flex flex-col">
        {currentIndex === 0 && (
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Sparkles size={20} className="text-primary-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Faisons connaissance</h2>
              <p className="text-sm text-gray-500">Quelques questions pour personnaliser ton expérience</p>
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
          {question.text}
        </h3>
        {question.type === 'multiple' && (
          <p className="text-sm text-gray-400 mb-6">Plusieurs réponses possibles</p>
        )}
        {question.type !== 'multiple' && <div className="mb-6" />}

        <div className="flex flex-col gap-3">
          {question.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`text-left px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 ${
                isSelected(option.id)
                  ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
              }`}
            >
              <span className="text-[15px]">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Next button */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
            canProceed
              ? 'bg-primary-600 text-white active:scale-[0.98]'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {currentIndex < total - 1 ? 'Continuer' : 'Commencer'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
