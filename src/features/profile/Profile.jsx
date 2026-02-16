import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Heart } from 'lucide-react'

export default function Profile() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Profile card */}
        <div className="bg-primary-50 rounded-2xl p-5 flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-200 flex items-center justify-center">
            <User size={24} className="text-primary-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Alex</h2>
            <p className="text-sm text-gray-400">Membre depuis 3 mois</p>
          </div>
        </div>

        {/* Therapist */}
        <div className="bg-lavender-50 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lavender-200 flex items-center justify-center">
              <Heart size={18} className="text-lavender-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Dr. Martin</p>
              <p className="text-xs text-gray-400">Psychologue clinicien·ne</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-1">
          {[
            { icon: Bell, label: 'Notifications', desc: 'Rappels et alertes' },
            { icon: Shield, label: 'Confidentialité', desc: 'Données et partage' },
            { icon: HelpCircle, label: 'Aide', desc: 'FAQ et contact' },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <item.icon size={16} className="text-gray-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3.5 mt-4 rounded-xl hover:bg-danger-50 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-danger-50 flex items-center justify-center">
            <LogOut size={16} className="text-danger-500" />
          </div>
          <span className="text-sm font-medium text-danger-500">Se déconnecter</span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-gray-300 mt-8">Sereni v1.0 — Prototype</p>
      </div>
    </div>
  )
}
