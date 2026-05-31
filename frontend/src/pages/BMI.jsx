import { useState, useEffect } from 'react'
import { Calculator, Loader2, Scale } from 'lucide-react'
import { bmiAPI } from '../services/api.js'

const BMI_RANGES = [
  { label: 'Underweight', range: '< 18.5',       color: 'text-blue-400',   bg: 'bg-blue-500/10',   bar: 'from-blue-500 to-blue-400',   min: 0,    max: 18.5 },
  { label: 'Normal',      range: '18.5 – 24.9',  color: 'text-emerald-400',bg: 'bg-emerald-500/10',bar: 'from-emerald-500 to-green-400',min: 18.5, max: 25 },
  { label: 'Overweight',  range: '25 – 29.9',    color: 'text-yellow-400', bg: 'bg-yellow-500/10', bar: 'from-yellow-500 to-orange-400',min: 25,   max: 30 },
  { label: 'Obese',       range: '≥ 30',          color: 'text-red-400',    bg: 'bg-red-500/10',    bar: 'from-red-600 to-red-400',      min: 30,   max: 100 },
]

function getBmiStyle(bmi) {
  if (bmi < 18.5) return BMI_RANGES[0]
  if (bmi < 25)   return BMI_RANGES[1]
  if (bmi < 30)   return BMI_RANGES[2]
  return BMI_RANGES[3]
}

export default function BMI() {
  const [form, setForm]       = useState({ weight: '', height: '', date: new Date().toISOString().slice(0, 10) })
  const [result, setResult]   = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingH, setFH]    = useState(true)
  const [error, setError]     = useState('')

  const fetchHistory = async () => {
    try {
      const { data } = await bmiAPI.history()
      setHistory(data)
    } catch (e) { console.error(e) }
    finally { setFH(false) }
  }

  useEffect(() => { fetchHistory() }, [])

  const handleCalculate = async (e) => {
    e.preventDefault()
    if (!form.weight || !form.height) { setError('Weight and height are required'); return }
    if (parseFloat(form.height) <= 0 || parseFloat(form.weight) <= 0) {
      setError('Please enter valid positive values')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { data } = await bmiAPI.calculate({ weight: parseFloat(form.weight), height: parseFloat(form.height), date: form.date })
      setResult(data)
      fetchHistory()
    } catch (e) {
      setError(e.response?.data?.error || 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  const bmiStyle = result ? getBmiStyle(result.bmi) : null

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="page-title">BMI Calculator</h2>
        <p className="text-gray-500 text-sm">Body Mass Index – Know your health category</p>
      </div>

      {/* Calculator Card */}
      <div className="glass-card p-6">
        <form onSubmit={handleCalculate} className="space-y-4" id="bmi-form">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Weight (kg)</label>
              <input id="bmi-weight" type="number" min="1" step="0.1" value={form.weight}
                onChange={e => setForm({...form, weight: e.target.value})}
                placeholder="70" className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Height (cm)</label>
              <input id="bmi-height" type="number" min="1" step="0.1" value={form.height}
                onChange={e => setForm({...form, height: e.target.value})}
                placeholder="175" className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Date</label>
            <input id="bmi-date" type="date" value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
              className="input-field" />
          </div>

          <button id="bmi-calculate" type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
            {loading ? 'Calculating...' : 'Calculate BMI'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className={`mt-6 p-5 rounded-2xl border ${bmiStyle.bg} border-white/10 animate-fade-in`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-gray-400 text-sm">Your BMI</p>
                <p className={`text-5xl font-black mt-1 ${bmiStyle.color}`}>{result.bmi}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-4 py-2 rounded-xl font-semibold text-sm ${bmiStyle.bg} ${bmiStyle.color} border border-white/10`}>
                  {result.category}
                </span>
                <p className="text-gray-500 text-xs mt-2">
                  {result.weight} kg · {result.height} cm
                </p>
              </div>
            </div>

            {/* Gauge bar */}
            <div className="mt-4">
              <div className="h-3 rounded-full overflow-hidden bg-dark-600 relative">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${bmiStyle.bar} transition-all duration-700`}
                  style={{ width: `${Math.min(100, (result.bmi / 40) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BMI Reference Card */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Scale size={18} className="text-brand-400" /> BMI Categories
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {BMI_RANGES.map(r => (
            <div key={r.label} className={`${r.bg} rounded-xl p-3 border border-white/5`}>
              <p className={`font-semibold ${r.color}`}>{r.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">BMI: {r.range}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      {!fetchingH && history.length > 0 && (
        <div className="table-wrapper">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="font-semibold text-white">BMI History</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Weight (kg)</th><th>Height (cm)</th><th>BMI</th><th>Category</th>
              </tr>
            </thead>
            <tbody>
              {history.map(r => {
                const s = getBmiStyle(r.bmi_value)
                return (
                  <tr key={r.id}>
                    <td>{r.record_date}</td>
                    <td>{r.weight}</td>
                    <td>{r.height}</td>
                    <td><span className={`font-bold ${s.color}`}>{r.bmi_value}</span></td>
                    <td><span className={`badge ${s.bg} ${s.color} border border-white/10`}>{r.category}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
