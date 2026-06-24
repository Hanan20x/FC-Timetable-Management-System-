// Mock auth store — mirrors the shape of the future /api/auth/login and
// /api/auth/profile responses. Swap the two functions below for real
// axios/fetch calls once Backend/routes/auth.js exists.

import { reactive, computed } from 'vue'
import { findUserByUsername, adminUser } from '../data/mockData.js'

const state = reactive({
  user: null,
  token: null,
})

// Demo accounts so reviewers can log in as each role without typing matric numbers
export const demoAccounts = [
  { username: 'admin', password: 'admin123', label: 'Admin — Nor Adlina' },
  { username: 'STAFF1000', password: 'lecturer123', label: 'Lecturer — Dr. Aiman Hakim' },
  { username: 'A22001', password: 'student123', label: 'Student — Aiman Rahman' },
]

export function useAuth() {
  const isAuthenticated = computed(() => !!state.user)

  function login(username, password) {
    // Mock validation — any password works for demo accounts; real backend will bcrypt-compare
    const account = demoAccounts.find(
      (a) => a.username.toLowerCase() === username.toLowerCase()
    )
    if (!account) {
      return { success: false, error: 'No account found with that username.' }
    }
    if (password !== account.password) {
      return { success: false, error: 'Incorrect password.' }
    }
    const user =
      username.toLowerCase() === 'admin' ? adminUser : findUserByUsername(username)
    if (!user) {
      return { success: false, error: 'Account exists but profile could not be loaded.' }
    }
    state.user = user
    state.token = `mock-jwt.${user.id}.${Date.now()}`
    return { success: true }
  }

  function logout() {
    state.user = null
    state.token = null
  }

  function fetchProfile() {
    // Mirrors GET /api/auth/profile — in mock mode just returns current state
    return state.user
  }

  return {
    user: computed(() => state.user),
    token: computed(() => state.token),
    isAuthenticated,
    login,
    logout,
    fetchProfile,
  }
}
