<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../stores/auth.js'
import { listSchedules } from '../services/scheduleService.js'
import { EnvelopeIcon, IdentificationIcon, AcademicCapIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

const { user } = useAuth()

const mySchedule = ref([])
const loading = ref(true)
const error = ref('')

async function loadSchedule() {
  loading.value = true
  error.value = ''
  try {
    mySchedule.value = await listSchedules()
  } catch (err) {
    error.value = err.response?.data?.error || 'Could not load your schedule.'
  } finally {
    loading.value = false
  }
}

onMounted(loadSchedule)

const initials = computed(() => {
  if (!user.value?.full_name) return '?'
  return user.value.full_name
    .replace(/^(Dr\.|Prof\.|Assoc\.)\s*/gi, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
})

const roleLabel = computed(() => {
  return { admin: 'Administrator', lecturer: 'Lecturer', student: 'Student' }[user.value?.user_type] || ''
})

// Derived from the schedule rather than a dedicated enrollments endpoint:
// each schedule entry already carries { subject, section } and the backend
// has already scoped /api/schedules to this user's enrolled/teaching
// subjects, so deduplicating by subject+section gives the same list a
// dedicated StudentCourse/LecturerCourse endpoint would.
const myCourses = computed(() => {
  if (user.value?.user_type === 'admin') return []
  const seen = new Set()
  const courses = []
  for (const entry of mySchedule.value) {
    const key = `${entry.subject_id}-${entry.section}`
    if (seen.has(key)) continue
    seen.add(key)
    courses.push({ subject: entry.subject, section: entry.section })
  }
  return courses
})
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <!-- Profile header -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-maroon-700 to-maroon-900 p-6 text-white shadow-card sm:p-8">
      <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl" />
      <div class="relative z-10 flex items-center gap-4">
        <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
          {{ initials }}
        </span>
        <div>
          <h2 class="text-xl font-bold sm:text-2xl">{{ user?.full_name }}</h2>
          <p class="text-sm text-gold-300">{{ roleLabel }} &middot; {{ user?.faculty_code }}</p>
        </div>
      </div>
    </section>

    <!-- Details -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div class="flex items-center gap-2 text-slate-400">
          <IdentificationIcon class="h-4 w-4" />
          <p class="text-xs font-medium uppercase tracking-wide">ID</p>
        </div>
        <p class="mt-1.5 text-sm font-semibold text-slate-800">{{ user?.username }}</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div class="flex items-center gap-2 text-slate-400">
          <EnvelopeIcon class="h-4 w-4" />
          <p class="text-xs font-medium uppercase tracking-wide">Email</p>
        </div>
        <p class="mt-1.5 truncate text-sm font-semibold text-slate-800">{{ user?.email }}</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:col-span-2">
        <div class="flex items-center gap-2 text-slate-400">
          <AcademicCapIcon class="h-4 w-4" />
          <p class="text-xs font-medium uppercase tracking-wide">Description</p>
        </div>
        <p class="mt-1.5 text-sm font-semibold text-slate-800">{{ user?.description }}</p>
      </div>
    </section>

    <div v-if="loading" class="flex h-24 items-center justify-center text-sm text-slate-400">
      Loading…
    </div>

    <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
      {{ error }}
    </div>

    <template v-else>
      <!-- Courses -->
      <section v-if="myCourses.length > 0" class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <CalendarDaysIcon class="h-4 w-4 text-maroon-700" />
          {{ user?.user_type === 'student' ? 'Enrolled Subjects' : 'Teaching Assignments' }}
        </h3>
        <div class="divide-y divide-slate-100">
          <div v-for="(c, i) in myCourses" :key="i" class="flex items-center justify-between py-2.5">
            <div>
              <p class="text-sm font-medium text-slate-800">{{ c.subject?.kod_subjek }}</p>
              <p class="text-xs text-slate-400">{{ c.subject?.nama_subjek }}</p>
            </div>
            <span class="rounded-full bg-maroon-50 px-2.5 py-1 text-xs font-medium text-maroon-700">
              Section {{ c.section }}
            </span>
          </div>
        </div>
      </section>

      <section class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <h3 class="mb-1 text-sm font-semibold text-slate-700">Weekly Sessions</h3>
        <p class="text-xs text-slate-500">
          {{ mySchedule.length }} session{{ mySchedule.length === 1 ? '' : 's' }} scheduled this semester.
          <router-link to="/timetable" class="font-medium text-maroon-700 hover:text-maroon-800">
            View timetable →
          </router-link>
        </p>
      </section>
    </template>
  </div>
</template>
