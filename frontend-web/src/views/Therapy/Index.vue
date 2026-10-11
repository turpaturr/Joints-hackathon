<script setup>
import { computed, reactive, ref } from 'vue'
import { getSession } from '../../services/auth.api'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import { createMovement, createPrescription } from '../../services/therapy.api'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'
import EmptyState from '../../components/ui/EmptyState.vue'

const token = getSession()?.token
const busy = ref(false)
const notice = ref('')
const error = ref('')
const movementForm = reactive({ namaGerakan: '', deskripsi: '', instruksi: '', mediaUrl: '', mediaType: 'VIDEO' })
const prescriptionForm = reactive({
  patientId: '',
  movementId: '',
  targetRepetisi: 10,
  frekuensiPerHari: 2,
  tanggalMulai: new Date().toISOString().slice(0, 10),
  tanggalBerakhir: '',
})
const sortedPrescriptions = computed(() =>
  [...monitoringData.prescriptions].sort((a, b) => new Date(b.createdAt || b.tanggalMulai) - new Date(a.createdAt || a.tanggalMulai)),
)

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
    Object.assign(movementForm, { namaGerakan: '', deskripsi: '', instruksi: '', mediaUrl: '', mediaType: 'VIDEO' })
    await refreshMonitoringData(token)
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    busy.value = false
  }
}

async function addPrescription() {
  error.value = notice.value = ''
  if (!prescriptionForm.patientId || !prescriptionForm.movementId || !prescriptionForm.tanggalBerakhir) {
    error.value = 'Pilih pasien dan gerakan, lalu tentukan tanggal berakhir.'
    return
  }

  busy.value = true
  try {
    await createPrescription({
      patientId: prescriptionForm.patientId,
      movementId: prescriptionForm.movementId,
      targetRepetisi: Number(prescriptionForm.targetRepetisi),
      frekuensiPerHari: Number(prescriptionForm.frekuensiPerHari),
      tanggalMulai: new Date(`${prescriptionForm.tanggalMulai}T00:00:00`).toISOString(),
      tanggalBerakhir: new Date(`${prescriptionForm.tanggalBerakhir}T23:59:59`).toISOString(),
    }, token)
    notice.value = 'Resep terapi berhasil dibuat.'
    await refreshMonitoringData(token)
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Pengelolaan terapi" title="Terapi" description="Kelola pustaka gerakan dan resep terapi pasien.">
      <template #actions>
        <span class="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-3 text-sm text-muted">{{ monitoringData.movements.length }} gerakan</span>
      </template>
    </PageHeader>

    <p v-if="notice" class="rounded-panel border border-success/25 bg-success/5 p-3 text-sm text-success" role="status">{{ notice }}</p>
    <p v-if="error" class="rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">{{ error }}</p>

    <div class="grid items-start gap-4 xl:grid-cols-2">
      <SurfaceCard>
        <header class="mb-5 flex items-center gap-3">
          <span class="grid size-10 place-items-center rounded-panel bg-primary/10 font-semibold text-primary" aria-hidden="true">+</span>
          <div>
            <h2 class="text-lg font-semibold text-primary-dark">Buat resep terapi</h2>
            <p class="mt-1 text-sm text-muted">Tentukan gerakan dan target untuk pasien.</p>
          </div>
        </header>
        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="addPrescription">
          <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            Pasien
            <select v-model="prescriptionForm.patientId" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" required>
              <option value="" disabled>Pilih pasien</option>
              <option v-for="patient in monitoringData.patients" :key="patient.id" :value="patient.id">{{ patient.namaLengkap }} · {{ patient.user?.email }}</option>
            </select>
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            Jenis gerakan
            <select v-model="prescriptionForm.movementId" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" required>
              <option value="" disabled>Pilih gerakan</option>
              <option v-for="movement in monitoringData.movements" :key="movement.id" :value="movement.id">{{ movement.namaGerakan }}</option>
            </select>
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink">
            Target repetisi
            <input v-model.number="prescriptionForm.targetRepetisi" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="number" min="1" required />
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink">
            Frekuensi per hari
            <input v-model.number="prescriptionForm.frekuensiPerHari" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="number" min="1" required />
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink">
            Tanggal mulai
            <input v-model="prescriptionForm.tanggalMulai" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="date" required />
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink">
            Tanggal berakhir
            <input v-model="prescriptionForm.tanggalBerakhir" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="date" :min="prescriptionForm.tanggalMulai" required />
          </label>
          <button class="min-h-11 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:bg-disabled sm:col-span-2" type="submit" :disabled="busy || !monitoringData.patients.length || !monitoringData.movements.length">
            {{ busy ? 'Menyimpan…' : 'Buat resep' }}
          </button>
          <p v-if="!monitoringData.patients.length || !monitoringData.movements.length" class="text-sm leading-6 text-muted sm:col-span-2">Resep memerlukan pasien yang ditugaskan dan setidaknya satu gerakan terapi.</p>
        </form>
      </SurfaceCard>

      <SurfaceCard>
        <header class="mb-5 flex items-center gap-3">
          <span class="grid size-10 place-items-center rounded-panel bg-accent-teal/20 font-semibold text-primary-dark" aria-hidden="true">↗</span>
          <div>
            <h2 class="text-lg font-semibold text-primary-dark">Tambah gerakan</h2>
            <p class="mt-1 text-sm text-muted">Tambahkan item ke pustaka terapi bersama.</p>
          </div>
        </header>
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
            <select v-model="movementForm.mediaType" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"><option value="VIDEO">Video</option><option value="IMAGE">Gambar</option></select>
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink">
            URL media
            <input v-model.trim="movementForm.mediaUrl" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="url" placeholder="https://" />
          </label>
          <button class="min-h-11 rounded-panel border border-primary bg-surface px-4 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:border-disabled disabled:text-disabled sm:col-span-2" type="submit" :disabled="busy">
            {{ busy ? 'Menyimpan…' : 'Simpan gerakan' }}
          </button>
        </form>
      </SurfaceCard>
    </div>

    <SurfaceCard>
      <header class="mb-3 flex items-center justify-between gap-3">
        <div>
          <p class="mb-1 text-xs font-medium text-primary">Perawatan pasien</p>
          <h2 class="text-lg font-semibold text-primary-dark">Resep terapi</h2>
        </div>
        <span class="text-sm text-muted">{{ sortedPrescriptions.length }} resep</span>
      </header>
      <EmptyState v-if="!sortedPrescriptions.length" title="Belum ada resep terapi" description="Resep yang dibuat untuk pasien akan ditampilkan di sini." />
      <div v-else class="divide-y divide-line/70">
        <article v-for="plan in sortedPrescriptions" :key="plan.id" class="flex flex-col gap-2 py-4 sm:flex-row sm:items-center">
          <span class="grid size-9 shrink-0 place-items-center rounded-panel bg-accent-teal/20 font-semibold text-primary-dark" aria-hidden="true">✳</span>
          <div class="grid min-w-0 flex-1">
            <strong class="truncate text-sm font-medium text-ink">{{ plan.movement?.namaGerakan || 'Gerakan terapi' }}</strong>
            <small class="text-xs text-muted">{{ monitoringData.patients.find((patient) => patient.id === plan.patientId)?.namaLengkap || `Pasien ${plan.patientId.slice(0, 8)}` }}</small>
          </div>
          <span class="text-sm text-muted">{{ plan.targetRepetisi }} repetisi · {{ plan.frekuensiPerHari }}× sehari</span>
          <span class="text-xs text-muted sm:min-w-40 sm:text-right">{{ new Date(plan.tanggalMulai).toLocaleDateString('id-ID') }} – {{ new Date(plan.tanggalBerakhir).toLocaleDateString('id-ID') }}</span>
        </article>
      </div>
    </SurfaceCard>

    <SurfaceCard>
      <header class="mb-3 flex items-center justify-between gap-3">
        <div>
          <p class="mb-1 text-xs font-medium text-primary">Pustaka gerakan</p>
          <h2 class="text-lg font-semibold text-primary-dark">Gerakan tersedia</h2>
        </div>
        <span class="text-sm text-muted">{{ monitoringData.movements.length }} gerakan</span>
      </header>
      <EmptyState v-if="!monitoringData.movements.length" title="Pustaka belum memiliki gerakan" description="Tambahkan gerakan untuk menggunakannya pada resep terapi pasien." />
      <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article v-for="movement in monitoringData.movements" :key="movement.id" class="rounded-panel border border-line bg-base/50 p-4">
          <span class="inline-flex min-h-7 items-center rounded-full bg-accent-teal/20 px-2.5 text-xs font-medium text-primary-dark">{{ movement.mediaType || 'Gerakan' }}</span>
          <h3 class="mt-3 text-base font-semibold text-primary-dark">{{ movement.namaGerakan }}</h3>
          <p class="mt-1 text-sm leading-6 text-muted">{{ movement.instruksi }}</p>
          <a v-if="movement.mediaUrl" class="mt-3 inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4" :href="movement.mediaUrl" target="_blank" rel="noreferrer">Buka media ↗</a>
        </article>
      </div>
    </SurfaceCard>
  </div>
</template>
