import { useLocation } from 'react-router-dom'
import { Bell, Search, Zap } from 'lucide-react'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/workout':   'Workout Tracker',
  '/diet':      'Diet Tracker',
  '/bmi':       'BMI Calculator',
  '/progress':  'Progress Analytics',
  '/admin':     'Admin Panel',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const title = pageTitles[pathname] || 'FitFusion'
  const now   = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="h-16 border-b border-white/5 bg-dark-800/50 backdrop-blur-xl px-6
                       flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
      {/* Left: Page title */}
      <div>
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <p className="text-xs text-gray-500">{greeting}, {user.name?.split(' ')[0] || 'Athlete'} 💪</p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl bg-dark-600 border border-white/10
                           flex items-center justify-center text-gray-400 hover:text-white
                           hover:border-brand-500/40 transition-all duration-200">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700
                        flex items-center justify-center font-bold text-white text-sm glow-orange">
          {(user.name || 'U')[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}
