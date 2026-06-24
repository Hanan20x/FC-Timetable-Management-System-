<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  icon: { type: [Object, Function], default: null },
  tone: { type: String, default: 'maroon' }, // maroon | gold | emerald | rose
})

// Each tone is a complete, self-contained class string (background + text color)
// so we never need fragile runtime string-matching to decide gradient vs solid.
const toneMap = {
  maroon: 'bg-maroon-700 text-white',
  gold: 'bg-gold-500 text-maroon-800',
  emerald: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white',
  rose: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white',
}
</script>

<template>
  <div
    class="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
  >
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-slate-400">{{ label }}</p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ value }}</p>
        <p v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
      </div>
      <div
        v-if="icon"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-card"
        :class="toneMap[tone]"
      >
        <component :is="icon" class="h-5 w-5" />
      </div>
    </div>
  </div>
</template>
