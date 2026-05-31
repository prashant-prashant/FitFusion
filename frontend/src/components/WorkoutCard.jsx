import { Dumbbell, Clock, Repeat, Edit3, Trash2 } from 'lucide-react'

/**
 * WorkoutCard – displays a single workout entry.
 * @param {Object} workout  - workout data object
 * @param {Function} onEdit   - callback to edit
 * @param {Function} onDelete - callback to delete
 */
export default function WorkoutCard({ workout, onEdit, onDelete }) {
  return (
    <div className="glass-card p-5 hover-lift hover:border-brand-500/30 transition-all duration-300 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20
                          flex items-center justify-center">
            <Dumbbell size={18} className="text-brand-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">{workout.exercise_name}</h3>
            <p className="text-xs text-gray-500">{workout.workout_date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(workout)}
            className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20
                       flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(workout.id)}
            className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20
                       flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-dark-700/50 rounded-xl p-3 text-center">
          <p className="text-brand-400 font-bold text-xl">{workout.sets}</p>
          <p className="text-gray-500 text-xs mt-0.5">Sets</p>
        </div>
        <div className="bg-dark-700/50 rounded-xl p-3 text-center">
          <p className="text-emerald-400 font-bold text-xl">{workout.reps}</p>
          <p className="text-gray-500 text-xs mt-0.5">Reps</p>
        </div>
        <div className="bg-dark-700/50 rounded-xl p-3 text-center">
          <p className="text-purple-400 font-bold text-xl">{workout.duration}</p>
          <p className="text-gray-500 text-xs mt-0.5">Mins</p>
        </div>
      </div>

      {/* Notes */}
      {workout.notes && (
        <p className="mt-3 text-xs text-gray-500 italic border-t border-white/5 pt-3">
          📝 {workout.notes}
        </p>
      )}
    </div>
  )
}
