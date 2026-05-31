import { Salad, Flame, Droplets, Edit3, Trash2 } from 'lucide-react'

const mealTypeColors = {
  breakfast: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  lunch:     'text-green-400 bg-green-400/10 border-green-400/20',
  dinner:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
  snack:     'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

/**
 * DietCard – displays a single meal/diet entry.
 */
export default function DietCard({ meal, onEdit, onDelete }) {
  const typeStyle = mealTypeColors[meal.meal_type] || mealTypeColors.lunch

  return (
    <div className="glass-card p-5 hover-lift hover:border-emerald-500/30 transition-all duration-300 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20
                          flex items-center justify-center">
            <Salad size={18} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">{meal.meal_name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`badge text-[10px] border ${typeStyle}`}>
                {meal.meal_type}
              </span>
              <span className="text-xs text-gray-500">{meal.diet_date}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(meal)}
            className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20
                       flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(meal.id)}
            className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20
                       flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Macros row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-dark-700/50 rounded-xl p-2.5 text-center">
          <p className="text-brand-400 font-bold text-lg">{meal.calories}</p>
          <p className="text-gray-500 text-[10px]">kcal</p>
        </div>
        <div className="bg-dark-700/50 rounded-xl p-2.5 text-center">
          <p className="text-blue-400 font-bold text-lg">{meal.protein || 0}g</p>
          <p className="text-gray-500 text-[10px]">Protein</p>
        </div>
        <div className="bg-dark-700/50 rounded-xl p-2.5 text-center">
          <p className="text-yellow-400 font-bold text-lg">{meal.carbs || 0}g</p>
          <p className="text-gray-500 text-[10px]">Carbs</p>
        </div>
        <div className="bg-dark-700/50 rounded-xl p-2.5 text-center">
          <Droplets size={14} className="text-cyan-400 mx-auto mb-0.5" />
          <p className="text-cyan-400 font-bold text-sm">{meal.water_intake || 0}L</p>
          <p className="text-gray-500 text-[10px]">Water</p>
        </div>
      </div>
    </div>
  )
}
