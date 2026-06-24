<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../stores/auth.js'
import { days, timeSlots } from '../data/constants.js'
import { listSchedules } from '../services/scheduleService.js'
import { listRooms } from '../services/roomService.js'
import { listSubjects } from '../services/subjectService.js'
import { listUsers } from '../services/userService.js'
import { fetchAnalyticsOverview } from '../services/analyticsService.js'
import StatCard from '../components/StatCard.vue'
import TimetableGrid from '../components/TimetableGrid.vue'
import {
  CalendarDaysIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const { user } = useAuth()

const loading = ref(true)
const error = ref('')

const mySchedule = ref([])
const rooms = ref([])
const subjects = ref([])
const lecturers = ref([])
const students = ref([])
const conflictCount = ref(0)

const todayName = computed(() => {
  const idx = new Date().getDay() // 0 = Sun
  return ['Sunday', ...days][idx] || days[0]
})
const todaySchedule = computed(() =>
  mySchedule.value.filter((s) => s.day_of_week === todayName.value)
)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})

const roleLabel = computed(() => {
  if (!user.value) return ''
  return { admin: 'Administrator', lecturer: 'Lecturer', student: 'Student' }[user.value.user_type]
})

async function loadDashboard() {
  loading.value = true
  error.value = ''
  try {
    // Admins default to the unscoped view (matches the original mock
    // behavior); students/lecturers get the backend's role-scoped default.
    const isAdmin = user.value?.user_type === 'admin'
    const [scheduleData, roomData, subjectData, lecturerData, studentData, analytics] =
      await Promise.all([
        listSchedules(isAdmin ? { all: true } : {}),
        listRooms(),
        listSubjects(),
        listUsers('lecturer'),
        listUsers('student'),
        fetchAnalyticsOverview(),
      ])
    mySchedule.value = scheduleData
    rooms.value = roomData
    subjects.value = subjectData
    lecturers.value = lecturerData
    students.value = studentData
    conflictCount.value = analytics.conflicts.length
  } catch (err) {
    error.value = err.response?.data?.error || 'Could not load dashboard data. Is the backend running?'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <div v-if="loading" class="flex h-64 items-center justify-center text-sm text-slate-400">
    Loading dashboard…
  </div>

  <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
    {{ error }}
  </div>

  <div v-else class="space-y-6">
    <!-- Hero -->
    <section
      class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-maroon-700 to-maroon-900 p-6 text-white shadow-card sm:p-8 animate-fade-up"
    >
      <div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
      <div class="relative z-10 flex flex-col gap-1">
        <p class="text-sm font-medium text-gold-300">{{ greeting }}, {{ roleLabel }}</p>
        <h2 class="text-2xl font-bold sm:text-3xl">{{ user?.full_name }}</h2>
        <p class="mt-1 max-w-xl text-sm text-maroon-100">
          Here's what {{ todayName === 'Saturday' || todayName === 'Sunday' ? 'your week' : "today's" }}
          schedule looks like across {{ mySchedule.length }} session{{ mySchedule.length === 1 ? '' : 's' }}
          this semester.
        </p>
      </div>
    </section>

    <!-- Stat cards -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="My Sessions"
        :value="mySchedule.length"
        hint="this week"
        :icon="CalendarDaysIcon"
        tone="maroon"
      />
      <StatCard
        label="Rooms in Use"
        :value="rooms.length"
        hint="across faculty"
        :icon="BuildingOffice2Icon"
        tone="emerald"
      />
      <StatCard
        label="Subjects Offered"
        :value="subjects.length"
        hint="Sesi 2025/2026"
        :icon="UserGroupIcon"
        tone="gold"
      />
      <StatCard
        label="Active Conflicts"
        :value="conflictCount"
        hint="needs review"
        :icon="ExclamationTriangleIcon"
        tone="rose"
      />
    </section>

    <!-- Today's schedule (signature live grid) -->
    <section class="animate-fade-up">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-700">
          {{ todaySchedule.length > 0 ? `Today — ${todayName}` : 'This Week' }}
        </h3>
        <router-link to="/timetable" class="text-xs font-medium text-maroon-700 hover:text-maroon-800">
          View full timetable →
        </router-link>
      </div>

      <TimetableGrid
        v-if="todaySchedule.length > 0"
        :schedules="todaySchedule"
        :visible-days="[todayName]"
        :visible-slots="timeSlots"
        compact
      />
      <TimetableGrid v-else :schedules="mySchedule" compact />
    </section>

    <!-- Quick faculty stats -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Lecturers</p>
        <p class="mt-2 text-xl font-bold text-slate-900">{{ lecturers.length }}</p>
        <p class="mt-1 text-xs text-slate-500">Faculty of Computing staff</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Students Enrolled</p>
        <p class="mt-2 text-xl font-bold text-slate-900">{{ students.length }}</p>
        <p class="mt-1 text-xs text-slate-500">Across all programmes</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Room Types</p>
        <p class="mt-2 text-xl font-bold text-slate-900">4</p>
        <p class="mt-1 text-xs text-slate-500">Lecture Halls, Classrooms, Labs, Seminar Rooms</p>
      </div>
    </section>
  </div>
</template>
