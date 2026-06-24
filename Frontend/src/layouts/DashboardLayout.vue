<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth.js'
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()
const mobileOpen = ref(false)

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: Squares2X2Icon },
  { name: 'Timetable', to: '/timetable', icon: CalendarDaysIcon },
  { name: 'Room Management', to: '/rooms', icon: BuildingOffice2Icon },
  { name: 'Analytics', to: '/analytics', icon: ChartBarIcon },
]

const pageTitle = computed(() => {
  const found = navItems.find((n) => route.path.startsWith(n.to))
  if (found) return found.name
  if (route.path.startsWith('/profile')) return 'Profile'
  return 'UTM Timetable'
})

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

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 lg:static lg:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-16 items-center gap-3 px-6 border-b border-white/5">
        <img
          src="/branding/utm-logo-white.png"
          alt="UTM"
          class="h-8 w-auto shrink-0 object-contain"
        />
        <div class="leading-tight border-l border-white/20 pl-3">
          <p class="text-[13px] font-semibold text-white tracking-wide">Timetable</p>
          <p class="text-[10px] text-slate-400">Faculty of Computing</p>
        </div>
      </div>

      <nav class="mt-6 flex flex-col gap-1 px-3">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          :class="
            route.path.startsWith(item.to)
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          "
          @click="mobileOpen = false"
        >
          <component
            :is="item.icon"
            class="h-5 w-5 shrink-0"
            :class="route.path.startsWith(item.to) ? 'text-gold-400' : 'text-slate-500 group-hover:text-gold-400'"
          />
          {{ item.name }}
        </router-link>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-white/5">
        <p class="text-xs text-slate-500">Sesi 2025/2026 &middot; Semester 2</p>
        <p class="mt-1 text-xs text-slate-600">Faculty of Computing</p>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
      @click="mobileOpen = false"
    />

    <!-- Main column -->
    <div class="flex flex-1 flex-col min-w-0">
      <!-- Sticky translucent header -->
      <header
        class="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-md sm:px-6"
      >
        <div class="flex items-center gap-3">
          <button
            class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            @click="mobileOpen = true"
          >
            <Bars3Icon class="h-5 w-5" />
          </button>
          <h1 class="text-base font-semibold text-slate-900 sm:text-lg">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <BellIcon class="h-5 w-5" />
            <span class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold-500" />
          </button>

          <router-link
            to="/profile"
            class="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-slate-100 transition-colors"
            aria-label="View profile"
          >
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-maroon-700 text-xs font-semibold text-white"
            >
              {{ initials }}
            </span>
            <span class="hidden text-sm font-medium text-slate-700 sm:inline">
              {{ user?.full_name }}
            </span>
          </router-link>

          <div class="hidden h-6 w-px bg-slate-200 sm:block"></div>

          <button
            @click="handleLogout"
            class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Sign out"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
          </button>
        </div>
      </header>

      <!-- Scrollable content -->
      <main class="flex-1 overflow-y-auto scrollbar-thin">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
