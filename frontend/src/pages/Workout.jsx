import { useState, useEffect } from 'react'
import { Plus, Loader2, X, Search } from 'lucide-react'
import WorkoutCard from '../components/WorkoutCard.jsx'
import { workoutAPI } from '../services/api.js'

const emptyForm = {
  exercise_name: '', sets: '', reps: '',
  duration: '', notes: '',
  workout_date: new Date().toISOString().slice(0, 10),
}

export default function Workout() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  const fetchWorkouts = async () => {
    try {
      const { data } = await workoutAPI.getAll()
      setWorkouts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWorkouts() }, [])

  const openModal = (workout = null) => {
    if (workout) {
      setForm({ ...workout })
      setEditId(workout.id)
    } else {
      setForm(emptyForm)
      setEditId(null)
    }
    setError('')
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setError('') }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.exercise_name || !form.sets || !form.reps || !form.duration || !form.workout_date) {
      setError('Please fill all required fields')
      return
    }
    setSaving(true)
    try {
      if (editId) {
        await workoutAPI.update(editId, form)
      } else {
        await workoutAPI.add(form)
      }
      closeModal()
      fetchWorkouts()
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save workout')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this workout?')) return
    try {
      await workoutAPI.delete(id)
      setWorkouts(workouts.filter(w => w.id !== id))
    } catch (e) {
      alert('Failed to delete workout')
    }
  }

  const filtered = workouts.filter(w =>
    w.exercise_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="page-title">Workout Tracker</h2>
          <p className="text-gray-500 text-sm">{workouts.length} workouts logged total</p>
        </div>
        <button id="add-workout-btn" onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Workout
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text" placeholder="Search exercises..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 size={28} className="animate-spin text-brand-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-4xl mb-3">🏋️</p>
          <p className="text-gray-400 font-medium">No workouts yet</p>
          <p className="text-gray-600 text-sm mt-1">Click "Add Workout" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(w => (
            <WorkoutCard key={w.id} workout={w} onEdit={openModal} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative glass-card w-full max-w-md p-6 animate-fade-in z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">
                {editId ? 'Edit Workout' : 'Add Workout'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="workout-form">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Exercise Name *</label>
                <input name="exercise_name" value={form.exercise_name} onChange={handleChange}
                  placeholder="e.g. Bench Press" className="input-field" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Sets *</label>
                  <input name="sets" type="number" min="1" value={form.sets} onChange={handleChange}
                    placeholder="3" className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Reps *</label>
                  <input name="reps" type="number" min="1" value={form.reps} onChange={handleChange}
                    placeholder="10" className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Mins *</label>
                  <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange}
                    placeholder="30" className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Date *</label>
                <input name="workout_date" type="date" value={form.workout_date} onChange={handleChange}
                  className="input-field" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Any notes about this workout..." rows={2}
                  className="input-field resize-none" />
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
