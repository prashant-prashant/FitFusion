import { useState, useEffect } from 'react'
import { Plus, Loader2, X, Droplets, Flame } from 'lucide-react'
import DietCard from '../components/DietCard.jsx'
import { dietAPI } from '../services/api.js'

const emptyForm = {
  meal_name: '', calories: '', protein: '', carbs: '',
  fat: '', water_intake: '', meal_type: 'lunch',
  diet_date: new Date().toISOString().slice(0, 10),
}

export default function Diet() {
  const [meals,      setMeals]     = useState([])
  const [loading,    setLoading]   = useState(true)
  const [showModal,  setShowModal] = useState(false)
  const [form,       setForm]      = useState(emptyForm)
  const [editId,     setEditId]    = useState(null)
  const [saving,     setSaving]    = useState(false)
  const [error,      setError]     = useState('')
  const [summary,    setSummary]   = useState({ total_calories: 0, total_water: 0 })
  const today = new Date().toISOString().slice(0, 10)

  const fetchMeals = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        dietAPI.getAll(),
        dietAPI.dailySummary(today),
      ])
      setMeals(mRes.data)
      setSummary(sRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMeals() }, [])

  const openModal = (meal = null) => {
    setForm(meal ? { ...meal } : emptyForm)
    setEditId(meal ? meal.id : null)
    setError('')
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.meal_name || !form.calories || !form.diet_date) {
      setError('Meal name, calories and date are required')
      return
    }
    setSaving(true)
    try {
      if (editId) { await dietAPI.update(editId, form) }
      else        { await dietAPI.add(form) }
      closeModal()
      fetchMeals()
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save meal')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this meal?')) return
    try {
      await dietAPI.delete(id)
      setMeals(meals.filter(m => m.id !== id))
      const sRes = await dietAPI.dailySummary(today)
      setSummary(sRes.data)
    } catch (e) { alert('Failed to delete meal') }
  }

  const CALORIE_GOAL = 2000
  const WATER_GOAL   = 3

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="page-title">Diet Tracker</h2>
          <p className="text-gray-500 text-sm">{meals.length} meals logged total</p>
        </div>
        <button id="add-meal-btn" onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Meal
        </button>
      </div>

      {/* Today's Summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Calories */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Flame size={18} className="text-red-400" />
            </div>
            <span className="font-semibold text-white text-sm">Today's Calories</span>
          </div>
          <p className="text-3xl font-black text-red-400">
            {summary.total_calories.toFixed(0)}
            <span className="text-base font-normal text-gray-500"> / {CALORIE_GOAL} kcal</span>
          </p>
          <div className="mt-3 h-2 bg-dark-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (summary.total_calories / CALORIE_GOAL) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1.5">
            {Math.max(0, CALORIE_GOAL - summary.total_calories).toFixed(0)} kcal remaining
          </p>
        </div>

        {/* Water */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Droplets size={18} className="text-cyan-400" />
            </div>
            <span className="font-semibold text-white text-sm">Water Intake</span>
          </div>
          <p className="text-3xl font-black text-cyan-400">
            {summary.total_water.toFixed(1)}
            <span className="text-base font-normal text-gray-500"> / {WATER_GOAL} L</span>
          </p>
          <div className="mt-3 h-2 bg-dark-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (summary.total_water / WATER_GOAL) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1.5">
            {Math.max(0, WATER_GOAL - summary.total_water).toFixed(1)} L remaining
          </p>
        </div>
      </div>

      {/* Meals Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 size={28} className="animate-spin text-brand-400" />
        </div>
      ) : meals.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-4xl mb-3">🥗</p>
          <p className="text-gray-400 font-medium">No meals tracked yet</p>
          <p className="text-gray-600 text-sm mt-1">Start by adding your first meal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {meals.map(m => (
            <DietCard key={m.id} meal={m} onEdit={openModal} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative glass-card w-full max-w-md p-6 animate-fade-in z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">{editId ? 'Edit Meal' : 'Add Meal'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="diet-form">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Meal Name *</label>
                <input name="meal_name" value={form.meal_name}
                  onChange={e => setForm({...form, meal_name: e.target.value})}
                  placeholder="e.g. Grilled Chicken Rice" className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Calories (kcal) *</label>
                  <input name="calories" type="number" min="0" value={form.calories}
                    onChange={e => setForm({...form, calories: e.target.value})}
                    placeholder="450" className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Meal Type</label>
                  <select name="meal_type" value={form.meal_type}
                    onChange={e => setForm({...form, meal_type: e.target.value})}
                    className="input-field">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Protein (g)</label>
                  <input name="protein" type="number" min="0" value={form.protein}
                    onChange={e => setForm({...form, protein: e.target.value})}
                    placeholder="30" className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Carbs (g)</label>
                  <input name="carbs" type="number" min="0" value={form.carbs}
                    onChange={e => setForm({...form, carbs: e.target.value})}
                    placeholder="50" className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Fat (g)</label>
                  <input name="fat" type="number" min="0" value={form.fat}
                    onChange={e => setForm({...form, fat: e.target.value})}
                    placeholder="15" className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Water (litres)</label>
                  <input name="water_intake" type="number" min="0" step="0.1" value={form.water_intake}
                    onChange={e => setForm({...form, water_intake: e.target.value})}
                    placeholder="0.5" className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Date *</label>
                  <input name="diet_date" type="date" value={form.diet_date}
                    onChange={e => setForm({...form, diet_date: e.target.value})}
                    className="input-field" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
