<script setup>
import { computed } from 'vue'
import { days, timeSlots } from '../data/constants.js'

const props = defineProps({
  schedules: { type: Array, required: true },
  compact: { type: Boolean, default: false },
  // optional: limit which days/slots render (used for the dashboard mini preview)
  visibleDays: { type: Array, default: () => days },
  visibleSlots: { type: Array, default: () => timeSlots },
})

const palette = [
  'bg-maroon-50 text-maroon-700 border-maroon-200',
  'bg-gold-100 text-gold-800 border-gold-300',
  'bg-sky-50 text-sky-700 border-sky-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-teal-50 text-teal-700 border-teal-200',
]

function colorFor(subjectId) {
  return palette[subjectId % palette.length]
}

const grid = computed(() => {
  const map = {}
  for (const day of props.visibleDays) {
    map[day] = {}
    for (const slot of props.visibleSlots) {
      map[day][slot] = []
    }
  }
  for (const s of props.schedules) {
    if (map[s.day_of_week] && map[s.day_of_week][s.time_slot] !== undefined) {
      map[s.day_of_week][s.time_slot].push(s)
    }
  }
  return map
})
</script>

<template>
  <div class="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-soft">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr>
          <th
            class="sticky left-0 z-10 w-28 border-b border-r border-slate-100 bg-slate-50 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Time
          </th>
          <th
            v-for="day in visibleDays"
            :key="day"
            class="border-b border-slate-100 bg-slate-50 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {{ day.slice(0, 3) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="slot in visibleSlots" :key="slot">
          <td
            class="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-3 py-2 text-xs font-medium text-slate-500 whitespace-nowrap"
          >
            {{ slot }}
          </td>
          <td
            v-for="day in visibleDays"
            :key="day + slot"
            class="border-b border-slate-50 px-1.5 py-1.5 align-top"
            :class="compact ? 'min-w-[7rem]' : 'min-w-[9rem]'"
          >
            <div
              v-for="entry in grid[day][slot]"
              :key="entry.id"
              class="mb-1 rounded-lg border px-2 py-1.5 text-xs leading-snug"
              :class="colorFor(entry.subject_id)"
            >
              <p class="font-semibold">{{ entry.subject?.kod_subjek }}</p>
              <p v-if="!compact" class="truncate text-[11px] opacity-80">
                {{ entry.subject?.nama_subjek }}
              </p>
              <p class="text-[11px] opacity-70">
                {{ entry.room?.nama_ruang_singkatan }} &middot; Sec {{ entry.section }}
              </p>
              <p v-if="!compact" class="truncate text-[11px] opacity-70">
                {{ entry.lecturer?.full_name }}
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
