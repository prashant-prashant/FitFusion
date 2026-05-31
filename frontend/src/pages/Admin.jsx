import { useEffect, useState } from 'react'
import { Users, Dumbbell, Salad, Scale, Trash2, Loader2, ShieldCheck } from 'lucide-react'
import { adminAPI } from '../services/api.js'

function ReportCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="stat-card">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-3`}>
        <Icon size={22} className={color} />
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  )
}

export default function Admin() {
  const [reports, setReports] = useState(null)
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting,setDeleting]= useState(null)

  const fetchData = async () => {
    try {
      const [rRes, uRes] = await Promise.all([adminAPI.getReports(), adminAPI.getUsers()])
      setReports(rRes.data)
      setUsers(uRes.data)
    } catch (e) {
      console.error('Admin fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return
    setDeleting(id)
    try {
      await adminAPI.deleteUser(id)
      setUsers(users.filter(u => u.id !== id))
      if (reports) setReports({ ...reports, total_users: reports.total_users - 1 })
    } catch (e) {
      alert('Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-brand-400" />
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center glow-orange">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h2 className="page-title mb-0">Admin Panel</h2>
          <p className="text-gray-500 text-sm">Manage users and monitor app activity</p>
        </div>
      </div>

      {/* Report Cards */}
      {reports && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ReportCard icon={Users}   label="Total Users"    value={reports.total_users}       color="text-brand-400"   bg="bg-brand-500/10" />
          <ReportCard icon={Dumbbell}label="Total Workouts" value={reports.total_workouts}    color="text-purple-400"  bg="bg-purple-500/10" />
          <ReportCard icon={Salad}   label="Meals Tracked"  value={reports.total_meals}       color="text-emerald-400" bg="bg-emerald-500/10" />
          <ReportCard icon={Scale}   label="BMI Records"    value={reports.total_bmi_records} color="text-blue-400"    bg="bg-blue-500/10" />
        </div>
      )}

      {/* Recent Registrations */}
      {reports?.recent_users?.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Recent Registrations</h3>
          <div className="space-y-2">
            {reports.recent_users.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/30 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {u.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{u.name}</p>
                  <p className="text-gray-500 text-xs truncate">{u.email}</p>
                </div>
                <span className={u.role === 'admin' ? 'badge-orange' : 'badge-blue'}>{u.role}</span>
                <span className="text-gray-600 text-xs">{new Date(u.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Users Table */}
      <div className="table-wrapper">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="font-semibold text-white">All Users ({users.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const me = JSON.parse(localStorage.getItem('user') || '{}')
              return (
                <tr key={u.id}>
                  <td className="text-gray-600">#{u.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {u.name[0].toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td className="text-gray-400">{u.email}</td>
                  <td>
                    <span className={u.role === 'admin' ? 'badge-orange' : 'badge-blue'}>{u.role}</span>
                  </td>
                  <td className="text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    {me.id !== u.id ? (
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        disabled={deleting === u.id}
                        className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                      >
                        {deleting === u.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <Trash2 size={12} />}
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs">You</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
