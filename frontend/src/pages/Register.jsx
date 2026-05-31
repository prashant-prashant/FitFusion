import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { authAPI } from '../services/api.js'

export default function Register() {
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const validate = () => {
    if (!form.name.trim())  return 'Full name is required'
    if (!form.email.trim()) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      const { data } = await authAPI.register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const strengthLevel = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-10">
      <div className="fixed top-1/4 right-1/4 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-48 h-48 bg-brand-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center glow-orange">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">FitFusion</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">Start tracking your fitness journey today</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="reg-name" type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="John Doe"
                  className="input-field pl-11" autoComplete="name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="reg-email" type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com"
                  className="input-field pl-11" autoComplete="email" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="reg-password" type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                  className="input-field pl-11 pr-11" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {[1,2,3].map(l => (
                    <div key={l} className={`h-1 flex-1 rounded-full transition-colors ${
                      strengthLevel >= l
                        ? l === 1 ? 'bg-red-500' : l === 2 ? 'bg-yellow-500' : 'bg-emerald-500'
                        : 'bg-dark-500'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="reg-confirm" type="password" name="confirmPassword"
                  value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password"
                  className="input-field pl-11" autoComplete="new-password" />
              </div>
            </div>

            <button id="reg-submit" type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
