<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuth } from '../stores/auth.js'
import { listSchedules } from '../services/scheduleService.js'
import { listRooms } from '../services/roomService.js'
import { listSubjects } from '../services/subjectService.js'
import TimetableGrid from '../components/TimetableGrid.vue'
import { FunnelIcon } from '@heroicons/vue/24/outline'

const { user } = useAuth()

const view = ref(user.value?.user_type === 'admin' ? 'all' : 'mine')
const roomFilter = ref('')
const subjectFilter = ref('')

const rooms = ref([])
const subjects = ref([])
const schedule = ref([])
const loading = ref(true)
const error = ref('')

async function loadFilters() {
  try {
    const [roomData, subjectData] = await Promise.all([listRooms(), listSubjects()])
    rooms.value = roomData
    subjects.value = subjectData
  } catch (err) {
    // Non-fatal — filters just won't populate, but the grid can still load
    console.error('Failed to load filter options', err)
  }
}

async function loadSchedule() {
  loading.value = true
  error.value = ''
  try {
    schedule.value = await listSchedules({
      all: view.value === 'all',
      roomId: roomFilter.value || undefined,
      subjectId: subjectFilter.value || undefined,
    })
  } catch (err) {
    error.value = err.response?.data?.error || 'Could not load the timetable.'
  } finally {
    loading.value = false
  }
}

// Re-fetch from the server whenever the view toggle or either filter changes,
// rather than fetching everything once and filtering client-side — the
// backend already supports these as query params.
watch([view, roomFilter, subjectFilter], loadSchedule)

onMounted(() => {
  loadFilters()
  loadSchedule()
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Weekly Timetable</h2>
        <p class="text-sm text-slate-500">
          {{ view === 'all' ? 'All sessions across the faculty.' : `Sessions for ${user?.full_name}.` }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div v-if="user?.user_type === 'admin'" class="flex rounded-xl bg-slate-100 p-1">
          <button
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition"
            :class="view === 'mine' ? 'bg-white text-maroon-700 shadow-soft' : 'text-slate-500'"
            @click="view = 'mine'"
          >
            My View
          </button>
          <button
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition"
            :class="view === 'all' ? 'bg-white text-maroon-700 shadow-soft' : 'text-slate-500'"
            @click="view = 'all'"
          >
            All Sessions
          </button>
        </div>

        <div class="relative">
          <FunnelIcon class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <select
            v-model="roomFilter"
            class="rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs font-medium text-slate-600 shadow-soft outline-none focus:border-maroon-300"
          >
            <option value="">All Rooms</option>
            <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.nama_ruang_singkatan }}</option>
          </select>
        </div>

        <select
          v-model="subjectFilter"
          class="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-600 shadow-soft outline-none focus:border-maroon-300"
        >
          <option value="">All Subjects</option>
          <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.kod_subjek }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex h-48 items-center justify-center text-sm text-slate-400">
      Loading timetable…
    </div>

    <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
      {{ error }}
    </div>

    <TimetableGrid v-else-if="schedule.length > 0" :schedules="schedule" />
    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center"
    >
      <p class="text-sm font-medium text-slate-600">No sessions match these filters.</p>
      <p class="mt-1 text-xs text-slate-400">Try clearing the room or subject filter.</p>
    </div>
  </div>
</template>
