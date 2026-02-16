import { useNavigate } from 'react-router-dom'
import { EXERCISES_LIST } from '../../data/mockData'
import { Clock, ArrowRight, Lock } from 'lucide-react'

export default function ExercisesList() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Exercices</h1>
        <p className="text-sm text-gray-400 mt-1">Des outils pour t'accompagner au quotidien</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3">
        {EXERCISES_LIST.map(exercise => (
          <button
            key={exercise.id}
            onClick={() => exercise.active && navigate('/exercise/circles')}
            className={`w-full text-left rounded-2xl border p-4 transition-all ${
              exercise.active
                ? 'border-primary-200 bg-primary-50/50 active:scale-[0.99]'
                : 'border-gray-100 bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${
                  exercise.active ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  {exercise.icon}
                </div>
                <div>
                  <h3 className={`text-[15px] font-semibold ${
                    exercise.active ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {exercise.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{exercise.description}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-300">
                    <Clock size={12} />
                    <span className="text-xs">{exercise.duration}</span>
                  </div>
                </div>
              </div>
              <div className="mt-1">
                {exercise.active ? (
                  <ArrowRight size={16} className="text-primary-400" />
                ) : (
                  <Lock size={14} className="text-gray-300" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
