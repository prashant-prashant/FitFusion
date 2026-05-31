import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Dumbbell, Salad, Calculator,
  TrendingUp, ShieldCheck, LogOut, Menu, X, Zap
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workout',   icon: Dumbbell,         label: 'Workouts' },
  { to: '/diet',      icon: Salad,            label: 'Diet Tracker' },
  { to: '/bmi',       icon: Calculator,       label: 'BMI Calculator' },
  { to: '/progress',  icon: TrendingUp,       label: 'Progress' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate   = useNavigate()
  const user       = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin    = user.role === 'admin'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`
          relative z-30 flex flex-col h-screen
          bg-dark-800 border-r border-white/5
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        `}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0 glow-orange">
            <Zap size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <p className="font-bold text-white text-lg leading-none">FitFusion</p>
              <p className="text-[10px] text-brand-400 font-medium tracking-widest uppercase">Fitness Tracker</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-500 hover:text-white transition-colors"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* ── Nav Items ── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="section-label px-3 mb-3">Main Menu</p>
          )}
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              {!collapsed && <p className="section-label px-3 mt-6 mb-3">Admin</p>}
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? 'Admin Panel' : undefined}
              >
                <ShieldCheck size={20} className="flex-shrink-0" />
                {!collapsed && <span>Admin Panel</span>}
              </NavLink>
            </>
          )}
        </nav>

        {/* ── User + Logout ── */}
        <div className="border-t border-white/5 px-3 py-4">
          {!collapsed && (
            <div className="glass-card p-3 mb-3 animate-fade-in">
              <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
              {isAdmin && <span className="badge-orange mt-1 inline-block">Admin</span>}
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10
                        ${collapsed ? 'justify-center px-2' : ''}`}
            title="Logout"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
