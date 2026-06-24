// Real auth store — calls the backend's /api/auth endpoints and persists
// the session to localStorage so a page refresh doesn't log the user out.

import { reactive, computed } from 'vue'
import * as authService from '../services/authService.js'

const TOKEN_KEY = 'ttms_token'
const USER_KEY = 'ttms_user'

function loadPersistedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    // Corrupted localStorage value — treat as logged out rather than crash
    return null
  }
}

const state = reactive({
  user: loadPersistedUser(),
  token: localStorage.getItem(TOKEN_KEY) || null,
})

// Demo accounts shown on the login screen for quick access during
// development. These exist as real seeded rows in the database (see
// Backend/scripts/seed.js) — the login screen just pre-fills the fields,
// the backend still validates them for real.
//
// SECURITY: gated behind import.meta.env.DEV (Vite's built-in flag, true
// for `npm run dev`, false for `npm run build`) so this list — and the
// quick-login buttons that read it — are automatically empty/absent in
// any production build. Leaving working admin credentials clickable on a
// public login page is a real "default credentials" vulnerability; this
// ensures nobody has to remember to strip it out by hand before deploying.
// Before any real deployment, also change these seeded passwords to
// something nobody could guess — gating the UI doesn't help if the
// accounts themselves still use admin123/lecturer123/student123 and
// someone logs in by typing the username/password directly.
export const demoAccounts = import.meta.env.DEV
  ? [
      { username: 'admin', password: 'admin123', label: 'Admin — Nor Adlina' },
      { username: 'STAFF1000', password: 'lecturer123', label: 'Lecturer — Dr. Aiman Hakim' },
      { username: 'A22001', password: 'student123', label: 'Student — Aiman Rahman' },
    ]
  : []

export function useAuth() {
  const isAuthenticated = computed(() => !!state.user && !!state.token)

  async function login(username, password) {
    try {
      const { token, user } = await authService.login(username, password)
      state.user = user
      state.token = token
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return { success: true }
    } catch (err) {
      // Backend sends { error: "..." } on 401/400; fall back to a generic
      // message for network errors (backend down, CORS misconfigured, etc.)
      const message =
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK'
          ? "Can't reach the server. Is the backend running?"
          : 'Something went wrong. Please try again.')
      return { success: false, error: message }
    }
  }

  function logout() {
    state.user = null
    state.token = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  /**
   * Re-fetches the current user from the backend (e.g. on app load, to
   * confirm a persisted token is still valid rather than trusting the
   * cached localStorage copy indefinitely). Logs out silently if the
   * token has expired or the user no longer exists.
   */
  async function refreshProfile() {
    if (!state.token) return null
    try {
      const user = await authService.fetchProfile()
      state.user = user
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return user
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
      }
      return null
    }
  }

  return {
    user: computed(() => state.user),
    token: computed(() => state.token),
    isAuthenticated,
    login,
    logout,
    refreshProfile,
  }
}
