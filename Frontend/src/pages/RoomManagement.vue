<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { listRooms, createRoom, updateRoom, deleteRoom } from '../services/roomService.js'
import { fetchAnalyticsOverview } from '../services/analyticsService.js'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  BuildingOffice2Icon,
} from '@heroicons/vue/24/outline'

const rooms = ref([])
const utilization = ref([])
const loading = ref(true)
const loadError = ref('')

const roomTypes = ['Lecture Hall', 'Classroom', 'Computer Lab', 'Seminar Room']

const modalOpen = ref(false)
const editingId = ref(null)
const deleteTarget = ref(null)
const search = ref('')
const formError = ref('')
const saving = ref(false)
const deleting = ref(false)

const form = reactive({
  kod_ruang: '',
  nama_ruang: '',
  nama_ruang_singkatan: '',
  kapasiti: 30,
  jenis_ruang: 'Classroom',
})

const filteredRooms = computed(() => {
  if (!search.value.trim()) return rooms.value
  const q = search.value.toLowerCase()
  return rooms.value.filter(
    (r) =>
      r.nama_ruang.toLowerCase().includes(q) ||
      r.kod_ruang.toLowerCase().includes(q) ||
      r.jenis_ruang.toLowerCase().includes(q)
  )
})

function utilFor(roomId) {
  return utilization.value.find((u) => u.room.id === roomId)?.utilizationRate ?? 0
}

async function loadRooms() {
  loading.value = true
  loadError.value = ''
  try {
    const [roomData, analytics] = await Promise.all([listRooms(), fetchAnalyticsOverview()])
    rooms.value = roomData
    utilization.value = analytics.utilization
  } catch (err) {
    loadError.value = err.response?.data?.error || 'Could not load rooms. Is the backend running?'
  } finally {
    loading.value = false
  }
}

onMounted(loadRooms)

function openCreate() {
  editingId.value = null
  formError.value = ''
  Object.assign(form, {
    kod_ruang: '',
    nama_ruang: '',
    nama_ruang_singkatan: '',
    kapasiti: 30,
    jenis_ruang: 'Classroom',
  })
  modalOpen.value = true
}

function openEdit(room) {
  editingId.value = room.id
  formError.value = ''
  Object.assign(form, { ...room })
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function saveRoom() {
  if (!form.kod_ruang || !form.nama_ruang) {
    formError.value = 'Room code and name are required.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const payload = {
      kod_ruang: form.kod_ruang,
      nama_ruang: form.nama_ruang,
      nama_ruang_singkatan: form.nama_ruang_singkatan,
      kapasiti: form.kapasiti,
      jenis_ruang: form.jenis_ruang,
    }
    if (editingId.value) {
      const updated = await updateRoom(editingId.value, payload)
      const idx = rooms.value.findIndex((r) => r.id === editingId.value)
      rooms.value[idx] = updated
    } else {
      const created = await createRoom(payload)
      rooms.value.push(created)
    }
    modalOpen.value = false
  } catch (err) {
    // Surfaces the backend's actual message — e.g. "Room code already exists"
    // or validation details — rather than failing silently.
    formError.value = err.response?.data?.error || 'Could not save the room. Please try again.'
  } finally {
    saving.value = false
  }
}

function confirmDelete(room) {
  deleteTarget.value = room
}

async function performDelete() {
  deleting.value = true
  try {
    await deleteRoom(deleteTarget.value.id)
    rooms.value = rooms.value.filter((r) => r.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch (err) {
    // e.g. "Cannot delete this room — it has 3 scheduled session(s)."
    loadError.value = err.response?.data?.error || 'Could not delete the room.'
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

function typeBadgeColor(type) {
  const map = {
    'Lecture Hall': 'bg-maroon-50 text-maroon-700',
    Classroom: 'bg-sky-50 text-sky-700',
    'Computer Lab': 'bg-emerald-50 text-emerald-700',
    'Seminar Room': 'bg-amber-50 text-amber-700',
  }
  return map[type] || 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Room Management</h2>
        <p class="text-sm text-slate-500">{{ rooms.length }} rooms registered across the faculty.</p>
      </div>
      <div class="flex gap-2">
        <input
          v-model="search"
          type="text"
          placeholder="Search rooms…"
          class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-soft outline-none focus:border-maroon-300"
        />
        <button
          class="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-maroon-700 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-maroon-800"
          @click="openCreate"
        >
          <PlusIcon class="h-4 w-4" />
          Add Room
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex h-48 items-center justify-center text-sm text-slate-400">
      Loading rooms…
    </div>

    <div v-else-if="loadError" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
      {{ loadError }}
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          class="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-700 text-white">
                <BuildingOffice2Icon class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ room.nama_ruang }}</p>
                <p class="text-xs text-slate-400">{{ room.kod_ruang }}</p>
              </div>
            </div>
            <div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-maroon-700"
                @click="openEdit(room)"
              >
                <PencilSquareIcon class="h-4 w-4" />
              </button>
              <button
                class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                @click="confirmDelete(room)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span
              class="rounded-full px-2.5 py-1 text-xs font-medium"
              :class="typeBadgeColor(room.jenis_ruang)"
            >
              {{ room.jenis_ruang }}
            </span>
            <span class="text-xs text-slate-500">Capacity: {{ room.kapasiti }}</span>
          </div>

          <div class="mt-3">
            <div class="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span>Weekly utilization</span>
              <span>{{ utilFor(room.id) }}%</span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-full rounded-full bg-gold-500"
                :style="{ width: utilFor(room.id) + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <p v-if="filteredRooms.length === 0" class="py-10 text-center text-sm text-slate-400">
        No rooms match "{{ search }}".
      </p>
    </template>

    <!-- Add/Edit modal -->
    <Transition name="fade">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
        @click.self="closeModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-base font-semibold text-slate-900">
              {{ editingId ? 'Edit Room' : 'Add Room' }}
            </h3>
            <button class="rounded-lg p-1 text-slate-400 hover:bg-slate-100" @click="closeModal">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600">Room Code</label>
              <input
                v-model="form.kod_ruang"
                type="text"
                placeholder="FSKM-K3.1"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-maroon-300"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600">Room Name</label>
              <input
                v-model="form.nama_ruang"
                type="text"
                placeholder="Kuliah 3.1"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-maroon-300"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600">Short Name</label>
              <input
                v-model="form.nama_ruang_singkatan"
                type="text"
                placeholder="K3.1"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-maroon-300"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-600">Capacity</label>
                <input
                  v-model.number="form.kapasiti"
                  type="number"
                  min="1"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-maroon-300"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-600">Type</label>
                <select
                  v-model="form.jenis_ruang"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-maroon-300"
                >
                  <option v-for="t in roomTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
            </div>

            <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button
              class="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              :disabled="saving"
              class="rounded-xl bg-maroon-700 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-maroon-800 disabled:opacity-60"
              @click="saveRoom"
            >
              {{ saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Room' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete confirmation -->
    <Transition name="fade">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
        @click.self="deleteTarget = null"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
            <TrashIcon class="h-6 w-6 text-rose-500" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-slate-900">Delete this room?</h3>
          <p class="mt-1 text-sm text-slate-500">
            "{{ deleteTarget.nama_ruang }}" will be removed. This can't be undone.
          </p>
          <div class="mt-5 flex justify-center gap-2">
            <button
              class="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              @click="deleteTarget = null"
            >
              Cancel
            </button>
            <button
              :disabled="deleting"
              class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
              @click="performDelete"
            >
              {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
