<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, demoAccounts } from '../stores/auth.js'
import { LockClosedIcon, UserIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function fillDemo(account) {
  username.value = account.username
  password.value = account.password
  error.value = ''
}

async function handleSubmit() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Enter both your ID and password.'
    return
  }
  loading.value = true
  const result = await login(username.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Brand panel -->
    <div
      class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-maroon-800 via-maroon-700 to-maroon-900 p-10 text-white lg:flex"
    >
      <div class="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
      <div class="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

      <div class="relative z-10 flex items-center gap-3">
        <img src="/branding/utm-emblem-white.png" alt="UTM" class="h-11 w-11 object-contain" />
        <div class="leading-tight">
          <p class="text-sm font-semibold tracking-wide">Universiti Teknologi Malaysia</p>
          <p class="text-xs text-gold-300">Faculty of Computing — Timetable System</p>
        </div>
      </div>

      <div class="relative z-10 max-w-md">
        <h2 class="text-3xl font-bold leading-tight">
          Every room, every section, every clash — accounted for before semester one starts.
        </h2>
        <p class="mt-4 text-sm text-maroon-100">
          One schedule for students, lecturers, and room admins to share —
          built for UTM's Faculty of Computing.
        </p>
      </div>

      <p class="relative z-10 text-xs text-maroon-200">Sesi 2025/2026 &middot; Semester 1</p>
    </div>

    <!-- Form panel -->
    <div class="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
      <div class="w-full max-w-sm">
        <div class="mb-8 flex items-center gap-3 lg:hidden">
          <img src="/branding/utm-emblem.png" alt="UTM" class="h-10 w-10 object-contain" />
          <div class="leading-tight">
            <p class="text-sm font-semibold text-slate-800">UTM Timetable</p>
            <p class="text-xs text-slate-500">Faculty of Computing</p>
          </div>
        </div>

        <h1 class="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p class="mt-1 text-sm text-slate-500">Sign in with your matric or staff ID.</p>

        <form class="mt-8 space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Matric / Staff ID</label>
            <div class="relative">
              <UserIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="username"
                type="text"
                placeholder="A22001 or STAFF1000"
                class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 shadow-soft outline-none transition focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100"
              />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div class="relative">
              <LockClosedIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 shadow-soft outline-none transition focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100"
              />
            </div>
          </div>

          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-maroon-700 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-maroon-800 disabled:opacity-60"
          >
            <span
              v-if="loading"
              class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <div class="mt-8 border-t border-slate-100 pt-5">
          <p class="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
            Quick demo access
          </p>
          <div class="space-y-2">
            <button
              v-for="acc in demoAccounts"
              :key="acc.username"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-600 transition hover:border-maroon-200 hover:bg-maroon-50/50"
              @click="fillDemo(acc)"
            >
              {{ acc.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
