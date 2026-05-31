import { Link } from 'react-router-dom'
import { Zap, Dumbbell, Salad, TrendingUp, Calculator, ShieldCheck, ArrowRight, Star } from 'lucide-react'

const features = [
  { icon: Dumbbell,   title: 'Workout Tracker',    desc: 'Log exercises, sets, reps & duration. Edit and delete with ease.',      color: 'text-brand-400',   bg: 'bg-brand-500/10' },
  { icon: Salad,      title: 'Diet Tracker',        desc: 'Track meals, calories, macros and daily water intake.',                   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Calculator, title: 'BMI Calculator',      desc: 'Calculate your Body Mass Index and understand your health category.',    color: 'text-blue-400',    bg: 'bg-blue-500/10' },
  { icon: TrendingUp, title: 'Progress Analytics',  desc: 'Beautiful Chart.js graphs showing weekly and monthly trends.',           color: 'text-purple-400',  bg: 'bg-purple-500/10' },
  { icon: ShieldCheck,title: 'Secure Auth',         desc: 'JWT-based authentication with bcrypt password hashing.',                  color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
  { icon: Zap,        title: 'Real-time Dashboard', desc: 'Live fitness overview with responsive analytics cards.',                  color: 'text-pink-400',    bg: 'bg-pink-500/10' },
]

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Workouts Logged' },
  { value: '100K+', label: 'Meals Tracked' },
  { value: '99.9%', label: 'Uptime' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center glow-orange">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">FitFusion</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-gray-400 hover:text-white font-medium text-sm transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6 animate-fade-in">
            <Star size={14} />
            Final Year Major Project – Full Stack + DevOps
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-in">
            Track Your{' '}
            <span className="gradient-text">Fitness</span>{' '}
            Journey
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            FitFusion is your all-in-one gym companion. Log workouts, track diet,
            calculate BMI and visualize progress with stunning charts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/register"
              className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 glow-orange">
              Start Tracking Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="btn-secondary text-base px-8 py-3.5">
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 border-y border-white/5 bg-dark-800/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black gradient-text">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Features</p>
            <h2 className="text-4xl font-bold text-white">Everything You Need</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              A complete fitness ecosystem built with React, Flask, and MySQL
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6 hover-lift hover:border-brand-500/20 transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon size={24} className={f.color} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-16 px-6 bg-dark-800/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-label mb-4">Tech Stack</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['React.js', 'Tailwind CSS', 'Chart.js', 'Flask', 'MySQL', 'JWT', 'Docker', 'Jenkins', 'GitHub Actions'].map(t => (
              <span key={t} className="px-4 py-2 glass-card text-sm text-gray-300 font-medium border border-white/10">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform?</h2>
          <p className="text-gray-500 mb-8">Join thousands of athletes tracking their progress with FitFusion.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-4 glow-orange">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} FitFusion – Final Year Major Project
      </footer>
    </div>
  )
}
