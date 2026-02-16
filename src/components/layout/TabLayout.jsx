import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Dumbbell, Calendar, TrendingUp, User } from 'lucide-react'

const tabs = [
  { path: '/app/journal', label: 'Journal', icon: BookOpen },
  { path: '/app/exercises', label: 'Exercices', icon: Dumbbell },
  { path: '/app/sessions', label: 'Séances', icon: Calendar },
  { path: '/app/progression', label: 'Progrès', icon: TrendingUp },
  { path: '/app/profile', label: 'Profil', icon: User },
]

export default function TabLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <nav className="flex-shrink-0 bg-white border-t border-gray-100 px-2 pb-2 pt-1">
        <div className="flex justify-around items-center">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path
            const Icon = tab.icon
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-400'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
