<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { computeRoomUtilization, detectConflicts, computeOptimizationSuggestions } from '../data/analytics.js'
import {
  ExclamationTriangleIcon,
  SparklesIcon,
  ChartBarIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const utilization = computeRoomUtilization()
const conflicts = detectConflicts()
const suggestions = computeOptimizationSuggestions()

const sortedUtilization = [...utilization].sort((a, b) => b.utilizationRate - a.utilizationRate)

const chartData = computed(() => ({
  labels: sortedUtilization.map((u) => u.room.nama_ruang_singkatan),
  datasets: [
    {
      label: 'Utilization %',
      data: sortedUtilization.map((u) => u.utilizationRate),
      backgroundColor: sortedUtilization.map((u) =>
        u.utilizationRate > 60 ? '#5C001F' : u.utilizationRate > 30 ? '#8A002E' : '#F3C4D4'
      ),
      borderRadius: 8,
      maxBarThickness: 36,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.parsed.y}% of weekly slots booked`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { callback: (v) => v + '%' },
      grid: { color: '#f1f5f9' },
    },
    x: {
      grid: { display: false },
    },
  },
}

const avgUtilization = computed(() => {
  const sum = utilization.reduce((acc, u) => acc + u.utilizationRate, 0)
  return Math.round(sum / utilization.length)
})

function conflictLabel(type) {
  return {
    room_double_booking: 'Room double-booking',
    lecturer_double_booking: 'Lecturer double-booking',
    capacity_overflow: 'Capacity overflow',
  }[type]
}

function severityColor(severity) {
  return severity === 'high'
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : 'bg-amber-50 text-amber-700 border-amber-200'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold text-slate-900">Analytics & Optimization</h2>
      <p class="text-sm text-slate-500">Room utilization, conflict detection, and scheduling suggestions.</p>
    </div>

    <!-- Summary row -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div class="flex items-center gap-2 text-slate-400">
          <ChartBarIcon class="h-4 w-4" />
          <p class="text-xs font-medium uppercase tracking-wide">Avg. Utilization</p>
        </div>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ avgUtilization }}%</p>
        <p class="mt-1 text-xs text-slate-500">across all {{ utilization.length }} rooms</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div class="flex items-center gap-2 text-rose-400">
          <ExclamationTriangleIcon class="h-4 w-4" />
          <p class="text-xs font-medium uppercase tracking-wide">Conflicts Found</p>
        </div>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ conflicts.length }}</p>
        <p class="mt-1 text-xs text-slate-500">double-bookings & overflow</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
        <div class="flex items-center gap-2 text-maroon-700">
          <SparklesIcon class="h-4 w-4" />
          <p class="text-xs font-medium uppercase tracking-wide">Suggestions</p>
        </div>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ suggestions.length }}</p>
        <p class="mt-1 text-xs text-slate-500">optimization opportunities</p>
      </div>
    </section>

    <!-- Utilization chart -->
    <section class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <h3 class="mb-4 text-sm font-semibold text-slate-700">Room Utilization Rate</h3>
      <div class="h-64">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </section>

    <!-- Conflicts panel -->
    <section class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <ExclamationTriangleIcon class="h-4 w-4 text-rose-500" />
        Scheduling Conflicts
      </h3>

      <div v-if="conflicts.length === 0" class="rounded-xl bg-emerald-50 px-4 py-6 text-center">
        <p class="text-sm font-medium text-emerald-700">No conflicts detected this week.</p>
      </div>

      <div v-else class="space-y-2.5">
        <div
          v-for="(c, i) in conflicts"
          :key="i"
          class="rounded-xl border px-4 py-3"
          :class="severityColor(c.severity)"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold">{{ conflictLabel(c.type) }}</p>
            <span class="text-xs opacity-70">{{ c.day }} &middot; {{ c.time_slot }}</span>
          </div>

          <p v-if="c.type === 'room_double_booking'" class="mt-1 flex items-center gap-1.5 text-xs opacity-90">
            <MapPinIcon class="h-3.5 w-3.5" />
            {{ c.room.nama_ruang }} booked for
            {{ c.entries.map((e) => `${e.subject.kod_subjek} (Sec ${e.section})`).join(' & ') }}
          </p>

          <p v-else-if="c.type === 'lecturer_double_booking'" class="mt-1 flex items-center gap-1.5 text-xs opacity-90">
            <UserIcon class="h-3.5 w-3.5" />
            {{ c.lecturer.full_name }} assigned to
            {{ c.entries.map((e) => `${e.subject.kod_subjek} in ${e.room.nama_ruang_singkatan}`).join(' & ') }}
          </p>

          <p v-else class="mt-1 text-xs opacity-90">
            {{ c.subject.kod_subjek }} in {{ c.room.nama_ruang_singkatan }}: {{ c.enrolled }} enrolled, capacity {{ c.capacity }}
          </p>
        </div>
      </div>
    </section>

    <!-- Suggestions -->
    <section class="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <SparklesIcon class="h-4 w-4 text-maroon-700" />
        Optimization Suggestions
      </h3>

      <div v-if="suggestions.length === 0" class="text-sm text-slate-400">
        No suggestions right now — the schedule looks well balanced.
      </div>

      <ul v-else class="space-y-2">
        <li
          v-for="(s, i) in suggestions"
          :key="i"
          class="flex items-start gap-2.5 rounded-xl bg-maroon-50 px-4 py-3 text-sm text-slate-700"
        >
          <span class="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon-700" />
          {{ s.message }}
        </li>
      </ul>
    </section>
  </div>
</template>
