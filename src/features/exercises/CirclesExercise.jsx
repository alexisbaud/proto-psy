import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EXERCISE_ITEMS } from '../../data/mockData'
import useStore from '../../store/useStore'
import StepSelection from './circles/StepSelection'
import StepPlacement from './circles/StepPlacement'
import StepActions from './circles/StepActions'
import StepLetGo from './circles/StepLetGo'
import StepRecap from './circles/StepRecap'
import { ArrowLeft, X } from 'lucide-react'

const STEPS = ['selection', 'placement', 'actions', 'letgo', 'recap']
const STEP_LABELS = ['Sélection', 'Placement', 'Actions', 'Lâcher prise', 'Récap']

export default function CirclesExercise() {
  const navigate = useNavigate()
  const location = useLocation()
  const addCompletedExercise = useStore(s => s.addCompletedExercise)
  const updateJournalEntry = useStore(s => s.updateJournalEntry)

  const [stepIndex, setStepIndex] = useState(0)
  const [selectedItems, setSelectedItems] = useState([])
  const [placements, setPlacements] = useState({})
  const [actions, setActions] = useState({})

  const step = STEPS[stepIndex]
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  function handleNext() {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1)
    }
  }

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    }
  }

  function handleFinish() {
    const exerciseData = {
      id: `circles-${Date.now()}`,
      title: 'Cercles de contrôle',
      completedAt: new Date(),
      placements,
      actions,
    }
    addCompletedExercise(exerciseData)

    // Update journal entry if came from journal
    const returnEntryId = location.state?.returnEntryId
    if (returnEntryId) {
      updateJournalEntry(returnEntryId, {
        completedExercise: { id: exerciseData.id, title: 'Cercles de contrôle' },
      })
    }

    // Dispatch event for journal
    window.dispatchEvent(new CustomEvent('exerciseComplete', {
      detail: { exerciseData: { id: exerciseData.id, title: 'Cercles de contrôle' } }
    }))

    navigate('/app/journal', { replace: true })
  }

  function handleClose() {
    navigate(-1)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-2">
        <div className="flex items-center justify-between mb-4">
          {stepIndex > 0 ? (
            <button onClick={handleBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
          ) : (
            <button onClick={handleClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={18} className="text-gray-600" />
            </button>
          )}
          <span className="text-sm font-medium text-gray-400">
            {STEP_LABELS[stepIndex]}
          </span>
          <div className="w-10" />
        </div>

        {/* Progress */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden">
        {step === 'selection' && (
          <StepSelection
            items={EXERCISE_ITEMS}
            selected={selectedItems}
            onToggle={(id) => {
              if (selectedItems.includes(id)) {
                setSelectedItems(selectedItems.filter(i => i !== id))
              } else if (selectedItems.length < 5) {
                setSelectedItems([...selectedItems, id])
              }
            }}
            onNext={handleNext}
          />
        )}
        {step === 'placement' && (
          <StepPlacement
            items={EXERCISE_ITEMS.filter(i => selectedItems.includes(i.id))}
            placements={placements}
            onPlace={(itemId, zone) => setPlacements({ ...placements, [itemId]: zone })}
            onNext={handleNext}
          />
        )}
        {step === 'actions' && (
          <StepActions
            items={EXERCISE_ITEMS.filter(i => selectedItems.includes(i.id))}
            placements={placements}
            actions={actions}
            onAction={(itemId, text) => setActions({ ...actions, [itemId]: text })}
            onNext={handleNext}
          />
        )}
        {step === 'letgo' && (
          <StepLetGo
            items={EXERCISE_ITEMS.filter(i => selectedItems.includes(i.id) && placements[i.id] === 'hors')}
            onComplete={handleNext}
          />
        )}
        {step === 'recap' && (
          <StepRecap
            items={EXERCISE_ITEMS.filter(i => selectedItems.includes(i.id))}
            placements={placements}
            actions={actions}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  )
}
