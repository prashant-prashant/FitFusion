import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell, Flame, Scale, Droplets, TrendingUp, Activity,
  ArrowRight, Loader2
} from 'lucide-react'
import { workoutAPI, dietAPI, bmiAPI } from '../services/api.js'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler)

function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className={`stat-card hover-lift`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
          <Icon size={22} className={color} />
        </div>
        <span className="badge-orange">Today</span>
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-gray-400 font-medium text-sm mt-1">{label}</p>
      {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [loading,        setLoading]        = useState(true)
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([])
  const [todayDiet,      setTodayDiet]      = useState({ total_calories: 0, total_water: 0 })
  const [latestBmi,      setLatestBmi]      = useState(null)
  const [totalWorkouts,  setTotalWorkouts]  = useState(0)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [wRes, dRes, bRes] = await Promise.all([
          workoutAPI.weeklySummary(),
          dietAPI.dailySummary(new Date().toISOString().slice(0, 10)),
          bmiAPI.history(),
        ])
        setWeeklyWorkouts(wRes.data)
        setTodayDiet(dRes.data)
        if (bRes.data.length > 0) setLatestBmi(bRes.data[0])

        const allW = await workoutAPI.getAll()
        setTotalWorkouts(allW.data.length)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const chartData = {
    labels: weeklyWorkouts.map(w => new Date(w.workout_date).toLocaleDateString('en', { weekday: 'short' })),
    datasets: [{
      label: 'Duration (min)',
      data: weeklyWorkouts.map(w => w.total_duration),
      backgroundColor: 'rgba(249, 115, 22, 0.5)',
      borderColor: '#f97316',
      borderWidth: 2,
      borderRadius: 8,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a1a27' } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' } },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-brand-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card p-6 border-brand-500/20 bg-gradient-to-r from-brand-500/10 to-purple-500/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              Welcome back, {user.name?.split(' ')[0] || 'Athlete'}! 🔥
            </h2>
            <p className="text-gray-400 text-sm mt-1">Here's your fitness summary for today.</p>
          </div>
          <Link to="/workout" className="btn-primary text-sm flex items-center gap-2">
            Log Workout <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Dumbbell} label="Total Workouts" value={totalWorkouts}
          sub="All time" color="text-brand-400" bg="bg-brand-500/10" />
        <StatCard
          icon={Flame} label="Calories Today" value={`${todayDiet.total_calories.toFixed(0)} kcal`}
          sub="Consumed today" color="text-red-400" bg="bg-red-500/10" />
        <StatCard
          icon={Droplets} label="Water Today" value={`${todayDiet.total_water.toFixed(1)} L`}
          sub="Daily intake" color="text-cyan-400" bg="bg-cyan-500/10" />
        <StatCard
          icon={Scale} label="Current BMI"
          value={latestBmi ? latestBmi.bmi_value : 'N/A'}
          sub={latestBmi ? latestBmi.category : 'Not recorded'}
          color="text-purple-400" bg="bg-purple-500/10" />
      </div>

      {/* Chart + Quick Links */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Workout Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Weekly Activity</h3>
            <span className="badge-orange">Last 7 Days</span>
          </div>
          {weeklyWorkouts.length > 0 ? (
            <Bar data={chartData} options={chartOptions} height={80} />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-600">
              <Activity size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No workouts this week yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { to: '/workout', icon: Dumbbell, label: 'Log Workout', color: 'text-brand-400' },
              { to: '/diet',    icon: Flame,    label: 'Add Meal',    color: 'text-red-400' },
              { to: '/bmi',     icon: Scale,    label: 'Check BMI',   color: 'text-purple-400' },
              { to: '/progress',icon: TrendingUp,label:'View Progress',color:'text-emerald-400' },
            ].map(item => (
              <Link key={item.to} to={item.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <item.icon size={18} className={item.color} />
                <span className="text-gray-300 group-hover:text-white text-sm transition-colors">{item.label}</span>
                <ArrowRight size={14} className="ml-auto text-gray-600 group-hover:text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BMI Progress */}
      {latestBmi && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">BMI Status</h3>
            <Link to="/bmi" className="text-brand-400 text-sm hover:text-brand-300">View History →</Link>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="text-5xl font-black text-purple-400">{latestBmi.bmi_value}</p>
              <p className="text-gray-500 text-sm mt-1">BMI Score</p>
            </div>
            <div>
              <span className={`badge text-sm px-4 py-2 rounded-xl border ${
                latestBmi.category === 'Normal weight'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : latestBmi.category === 'Underweight'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
              }`}>
                {latestBmi.category}
              </span>
              <p className="text-gray-500 text-xs mt-2">
                Weight: {latestBmi.weight} kg · Height: {latestBmi.height} cm
              </p>
              <p className="text-gray-600 text-xs">Recorded: {latestBmi.record_date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
