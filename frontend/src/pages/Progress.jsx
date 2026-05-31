import { useEffect, useState } from 'react'
import { Loader2, TrendingUp } from 'lucide-react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Tooltip, Legend, Filler,
  ArcElement
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { workoutAPI, dietAPI, bmiAPI } from '../services/api.js'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Tooltip, Legend, Filler, ArcElement
)

const chartDefaults = {
  plugins: {
    legend: { labels: { color: '#9ca3af', font: { size: 12 } } },
    tooltip: { backgroundColor: '#1a1a27', titleColor: '#f3f4f6', bodyColor: '#9ca3af' },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280' } },
  },
  responsive: true,
  maintainAspectRatio: false,
}

export default function Progress() {
  const [loading,      setLoading]      = useState(true)
  const [weeklyW,      setWeeklyW]      = useState([])
  const [allMeals,     setAllMeals]     = useState([])
  const [bmiHistory,   setBmiHistory]   = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const [wRes, mRes, bRes] = await Promise.all([
          workoutAPI.weeklySummary(),
          dietAPI.getAll(),
          bmiAPI.history(),
        ])
        setWeeklyW(wRes.data)
        setAllMeals(mRes.data)
        setBmiHistory(bRes.data.slice(0, 10).reverse())
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  // ── Workout bar chart ──────────────────────────────────────
  const workoutChart = {
    labels: weeklyW.map(w => new Date(w.workout_date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Workouts',
        data: weeklyW.map(w => w.total_workouts),
        backgroundColor: 'rgba(249, 115, 22, 0.6)',
        borderColor: '#f97316',
        borderWidth: 2,
        borderRadius: 8,
        yAxisID: 'y',
      },
      {
        label: 'Duration (min)',
        data: weeklyW.map(w => w.total_duration),
        backgroundColor: 'rgba(168, 85, 247, 0.4)',
        borderColor: '#a855f7',
        borderWidth: 2,
        borderRadius: 8,
        yAxisID: 'y1',
      },
    ],
  }

  // ── Calorie line chart (last 7 days) ──────────────────────
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
  const calByDay = last7.map(date => {
    const dayMeals = allMeals.filter(m => m.diet_date === date)
    return dayMeals.reduce((s, m) => s + parseFloat(m.calories || 0), 0)
  })

  const calorieChart = {
    labels: last7.map(d => new Date(d).toLocaleDateString('en', { weekday: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Calories (kcal)',
      data: calByDay,
      fill: true,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#ef4444',
      borderWidth: 2,
      pointBackgroundColor: '#ef4444',
      pointRadius: 5,
      tension: 0.4,
    }],
  }

  // ── BMI Line chart ────────────────────────────────────────
  const bmiChart = {
    labels: bmiHistory.map(b => b.record_date),
    datasets: [{
      label: 'BMI',
      data: bmiHistory.map(b => b.bmi_value),
      fill: true,
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      borderColor: '#a855f7',
      borderWidth: 2,
      pointBackgroundColor: '#a855f7',
      pointRadius: 5,
      tension: 0.4,
    }],
  }

  // ── Macro donut (average) ────────────────────────────────
  const totalP = allMeals.reduce((s, m) => s + parseFloat(m.protein || 0), 0)
  const totalC = allMeals.reduce((s, m) => s + parseFloat(m.carbs   || 0), 0)
  const totalF = allMeals.reduce((s, m) => s + parseFloat(m.fat     || 0), 0)

  const macroChart = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [totalP || 1, totalC || 1, totalF || 1],
      backgroundColor: ['rgba(59,130,246,0.8)', 'rgba(234,179,8,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: ['#3b82f6', '#eab308', '#ef4444'],
      borderWidth: 2,
    }],
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-brand-400" />
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="page-title">Progress Analytics</h2>
        <p className="text-gray-500 text-sm">Visual insights into your fitness journey</p>
      </div>

      {/* Weekly Workout Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-brand-400" />
          <h3 className="font-semibold text-white">Weekly Workout Activity</h3>
        </div>
        {weeklyW.length > 0 ? (
          <div className="h-64">
            <Bar data={workoutChart} options={{
              ...chartDefaults,
              scales: {
                ...chartDefaults.scales,
                y:  { ...chartDefaults.scales.y, position: 'left',  title: { display: true, text: 'Workouts', color: '#6b7280' } },
                y1: { ...chartDefaults.scales.y, position: 'right', title: { display: true, text: 'Duration (min)', color: '#6b7280' }, grid: { drawOnChartArea: false } },
              },
            }} />
          </div>
        ) : (
          <p className="text-center text-gray-600 py-12">No workout data available yet.</p>
        )}
      </div>

      {/* Calorie + BMI */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Calorie Intake – Last 7 Days</h3>
          <div className="h-56">
            <Line data={calorieChart} options={chartDefaults} />
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">BMI Progress</h3>
          {bmiHistory.length > 1 ? (
            <div className="h-56">
              <Line data={bmiChart} options={chartDefaults} />
            </div>
          ) : (
            <p className="text-center text-gray-600 py-16 text-sm">
              Record at least 2 BMI entries to see progress
            </p>
          )}
        </div>
      </div>

      {/* Macros Donut */}
      <div className="glass-card p-6 max-w-sm mx-auto">
        <h3 className="font-semibold text-white mb-4 text-center">Total Macro Distribution</h3>
        <div className="h-56">
          <Doughnut data={macroChart} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: '#9ca3af' } },
              tooltip: { backgroundColor: '#1a1a27' },
            },
          }} />
        </div>
      </div>
    </div>
  )
}
