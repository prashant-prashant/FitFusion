/**
 * FitFusion – Axios API Service
 * Centralized HTTP client with JWT token injection and error handling.
 */
import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT token ──────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 ──────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
  profile:  ()     => API.get('/auth/profile'),
}

// ─────────────────────────────────────────────────────────────
// Workouts
// ─────────────────────────────────────────────────────────────
export const workoutAPI = {
  getAll:         ()           => API.get('/workouts/'),
  add:            (data)       => API.post('/workouts/', data),
  update:         (id, data)   => API.put(`/workouts/${id}`, data),
  delete:         (id)         => API.delete(`/workouts/${id}`),
  weeklySummary:  ()           => API.get('/workouts/summary/weekly'),
}

// ─────────────────────────────────────────────────────────────
// Diet
// ─────────────────────────────────────────────────────────────
export const dietAPI = {
  getAll:       ()         => API.get('/diet/'),
  add:          (data)     => API.post('/diet/', data),
  update:       (id, data) => API.put(`/diet/${id}`, data),
  delete:       (id)       => API.delete(`/diet/${id}`),
  dailySummary: (date)     => API.get(`/diet/summary?date=${date}`),
}

// ─────────────────────────────────────────────────────────────
// BMI
// ─────────────────────────────────────────────────────────────
export const bmiAPI = {
  calculate: (data) => API.post('/bmi/calculate', data),
  history:   ()     => API.get('/bmi/history'),
}

// ─────────────────────────────────────────────────────────────
// Admin
// ─────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers:    ()         => API.get('/admin/users'),
  deleteUser:  (id)       => API.delete(`/admin/users/${id}`),
  getReports:  ()         => API.get('/admin/reports'),
}

export default API
