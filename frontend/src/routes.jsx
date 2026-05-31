import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home       from './pages/Home.jsx'
import Login      from './pages/Login.jsx'
import Register   from './pages/Register.jsx'
import Dashboard  from './pages/Dashboard.jsx'
import Workout    from './pages/Workout.jsx'
import Diet       from './pages/Diet.jsx'
import BMI        from './pages/BMI.jsx'
import Progress   from './pages/Progress.jsx'
import Admin      from './pages/Admin.jsx'
import Sidebar    from './components/Sidebar.jsx'
import Navbar     from './components/Navbar.jsx'

/* ── Protected Route Wrapper ──────────────────────────────── */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

/* ── Admin Route Wrapper ──────────────────────────────────── */
function AdminRoute({ children }) {
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

/* ── App Layout (Sidebar + Navbar) ────────────────────────── */
function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/workout" element={
          <ProtectedRoute>
            <AppLayout><Workout /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/diet" element={
          <ProtectedRoute>
            <AppLayout><Diet /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/bmi" element={
          <ProtectedRoute>
            <AppLayout><BMI /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute>
            <AppLayout><Progress /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin route */}
        <Route path="/admin" element={
          <AdminRoute>
            <AppLayout><Admin /></AppLayout>
          </AdminRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
