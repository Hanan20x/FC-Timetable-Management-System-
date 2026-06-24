<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../stores/auth.js'
import { getScheduleForUser, schedules, rooms, subjects } from '../data/mockData.js'
import TimetableGrid from '../components/TimetableGrid.vue'
import { FunnelIcon } from '@heroicons/vue/24/outline'

const { user } = useAuth()

const view = ref(user.value?.user_type === 'admin' ? 'all' : 'mine')
const roomFilter = ref('')
const subjectFilter = ref('')

const baseSchedule = computed(() => {
  return view.value === 'all' ? schedules : getScheduleForUser(user.value)
})

const filteredSchedule = computed(() => {
  return baseSchedule.value.filter((s) => {
    if (roomFilter.value && s.room_id !== Number(roomFilter.value)) return false
    if (subjectFilter.value && s.subject_id !== Number(subjectFilter.value)) return false
    return true
  })
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

    <TimetableGrid v-if="filteredSchedule.length > 0" :schedules="filteredSchedule" />
    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center"
    >
      <p class="text-sm font-medium text-slate-600">No sessions match these filters.</p>
      <p class="mt-1 text-xs text-slate-400">Try clearing the room or subject filter.</p>
    </div>
  </div>
</template>
