<script setup>
import { reactive, ref } from 'vue'
import { getSession } from '../../services/auth.api'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import { createMovement } from '../../services/therapy.api'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'
import EmptyState from '../../components/ui/EmptyState.vue'

const token = getSession()?.token
const busy = ref(false)
const notice = ref('')
const error = ref('')
const showMovementModal = ref(false)
const movementForm = reactive({
  namaGerakan: '',
  deskripsi: '',
  instruksi: '',
  mediaUrl: '',
  mediaType: 'VIDEO',
})

function openMovementModal() {
  error.value = ''
  showMovementModal.value = true
}

function closeMovementModal() {
  if (busy.value) return
  showMovementModal.value = false
}

async function addMovement() {
  error.value = notice.value = ''
  if (!movementForm.namaGerakan.trim() || !movementForm.instruksi.trim()) {
    error.value = 'Nama gerakan dan instruksi wajib diisi.'
    return
  }

  busy.value = true
  try {
    await createMovement({
      ...movementForm,
      deskripsi: movementForm.deskripsi || undefined,
      mediaUrl: movementForm.mediaUrl || undefined,
    }, token)
    notice.value = 'Gerakan berhasil disimpan ke pustaka.'
    Object.assign(movementForm, {
      namaGerakan: '',
      deskripsi: '',
      instruksi: '',
      mediaUrl: '',
      mediaType: 'VIDEO',
    })
    await refreshMonitoringData(token)
    showMovementModal.value = false
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Pustaka terapi"
      title="Gerakan terapi"
      description="Tambahkan dan kelola gerakan yang dapat digunakan dalam program terapi pasien."
    >
      <template #actions>
        <div class="flex items-center gap-2">
          <span class="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-3 text-sm text-muted">
            {{ monitoringData.movements.length }} gerakan
          </span>
          <button class="min-h-11 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark" type="button" @click="openMovementModal">
            Tambah gerakan
          </button>
        </div>
      </template>
    </PageHeader>

    <p v-if="notice" class="rounded-panel border border-success/25 bg-success/5 p-3 text-sm text-success" role="status">{{ notice }}</p>

    <SurfaceCard>
      <header class="mb-3 flex items-center justify-between gap-3">
        <div>
          <p class="mb-1 text-xs font-medium text-primary">Pustaka</p>
          <h2 class="text-lg font-semibold text-primary-dark">Gerakan tersedia</h2>
        </div>
        <span class="text-sm text-muted">{{ monitoringData.movements.length }} gerakan</span>
      </header>
      <EmptyState
        v-if="!monitoringData.movements.length"
        title="Pustaka belum memiliki gerakan"
        description="Tambahkan gerakan untuk menggunakannya pada program terapi pasien."
      />
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr class="border-b border-line text-xs font-medium text-muted">
              <th class="px-3 py-3">Nama gerakan</th>
              <th class="px-3 py-3">Deskripsi</th>
              <th class="px-3 py-3">Instruksi</th>
              <th class="px-3 py-3">Media</th>
              <th class="px-3 py-3">Tautan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line/70">
            <tr v-for="movement in monitoringData.movements" :key="movement.id" class="text-sm text-ink hover:bg-base/50">
              <td class="whitespace-nowrap px-3 py-3 font-medium text-primary-dark">{{ movement.namaGerakan }}</td>
              <td class="max-w-56 px-3 py-3">
                <span class="block truncate" :title="movement.deskripsi || 'Tidak ada deskripsi'">{{ movement.deskripsi || 'Tidak ada deskripsi' }}</span>
              </td>
              <td class="max-w-72 px-3 py-3">
                <span class="block truncate" :title="movement.instruksi">{{ movement.instruksi }}</span>
              </td>
              <td class="whitespace-nowrap px-3 py-3">{{ movement.mediaType || 'Tidak tersedia' }}</td>
              <td class="whitespace-nowrap px-3 py-3">
                <a v-if="movement.mediaUrl" class="font-medium text-primary hover:underline" :href="movement.mediaUrl" target="_blank" rel="noreferrer">Buka media ↗</a>
                <span v-else class="text-muted">Tidak tersedia</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SurfaceCard>

    <div v-if="showMovementModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" @click.self="closeMovementModal">
      <section aria-labelledby="movement-modal-title" aria-modal="true" class="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-[var(--connect-shadow-card)] sm:p-6" role="dialog">
        <header class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="movement-modal-title" class="text-lg font-semibold text-primary-dark">Tambah gerakan</h2>
            <p class="mt-1 text-sm text-muted">Lengkapi detail gerakan dan instruksi untuk pasien.</p>
          </div>
          <button aria-label="Tutup popup" class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted hover:bg-base hover:text-ink disabled:opacity-50" type="button" :disabled="busy" @click="closeMovementModal">×</button>
        </header>
        <p v-if="error" class="mb-4 rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">{{ error }}</p>
        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="addMovement">
          <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            Nama gerakan
            <input v-model.trim="movementForm.namaGerakan" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="text" placeholder="Contoh: Fleksi lutut" required />
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            Deskripsi
            <input v-model.trim="movementForm.deskripsi" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="text" placeholder="Deskripsi singkat (opsional)" />
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            Instruksi
            <textarea v-model.trim="movementForm.instruksi" class="min-h-24 rounded-control border border-line bg-surface px-3 py-2 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" rows="3" placeholder="Instruksi untuk pasien" required />
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink">
            Jenis media
            <select v-model="movementForm.mediaType" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
              <option value="VIDEO">Video</option>
              <option value="IMAGE">Gambar</option>
            </select>
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink">
            URL media
            <input v-model.trim="movementForm.mediaUrl" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="url" placeholder="https://" />
          </label>
          <div class="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <button class="min-h-11 rounded-panel border border-line px-4 text-sm font-semibold text-primary-dark hover:bg-base disabled:opacity-50" type="button" :disabled="busy" @click="closeMovementModal">Batal</button>
            <button class="min-h-11 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:bg-disabled" type="submit" :disabled="busy">
              {{ busy ? 'Menyimpan…' : 'Simpan gerakan' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
