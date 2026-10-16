<script setup>
import { computed, onMounted, ref } from 'vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import { getSession } from '../../services/auth.api'
import {
  getConsultations,
  respondToConsultation,
  updateConsultationStatus,
} from '../../services/consultation.api'

const session = getSession()
const consultations = ref([])
const expandedIds = ref([])
const responseDrafts = ref({})
const statusDrafts = ref({})
const filter = ref('ALL')
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const message = ref('')

const statusLabels = {
  PENDING: 'Menunggu',
  IN_PROGRESS: 'Dalam penanganan',
  RESOLVED: 'Selesai',
}

const filteredConsultations = computed(() => {
  const items = filter.value === 'ALL'
    ? consultations.value
    : consultations.value.filter((item) => item.status === filter.value)
  return [...items].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
})

const statusSummary = computed(() => [
  { label: 'Semua', value: consultations.value.length, key: 'ALL' },
  { label: 'Menunggu', value: consultations.value.filter((item) => item.status === 'PENDING').length, key: 'PENDING' },
  { label: 'Ditangani', value: consultations.value.filter((item) => item.status === 'IN_PROGRESS').length, key: 'IN_PROGRESS' },
  { label: 'Selesai', value: consultations.value.filter((item) => item.status === 'RESOLVED').length, key: 'RESOLVED' },
])

function unwrap(response) {
  return response?.data ?? response
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function loadConsultations() {
  if (!session?.token) {
    error.value = 'Sesi login tidak ditemukan. Silakan login kembali.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const response = await getConsultations(session.token)
    consultations.value = unwrap(response) || []
    expandedIds.value = expandedIds.value.filter((id) =>
      consultations.value.some((item) => item.id === id),
    )
  } catch (requestError) {
    error.value = requestError?.message || 'Daftar konsultasi gagal dimuat.'
  } finally {
    loading.value = false
  }
}

function isExpanded(item) {
  return expandedIds.value.includes(item.id)
}

function toggleDetails(item) {
  if (isExpanded(item)) {
    expandedIds.value = expandedIds.value.filter((id) => id !== item.id)
  } else {
    expandedIds.value = [...expandedIds.value, item.id]
    responseDrafts.value[item.id] ??= item.response || ''
    statusDrafts.value[item.id] ??= item.status
  }
  message.value = ''
  error.value = ''
}

async function saveResponse(item) {
  const response = (responseDrafts.value[item.id] || '').trim()
  if (!response) {
    error.value = 'Tuliskan tanggapan sebelum menyimpan.'
    return
  }
  if (!session?.token) return

  saving.value = true
  error.value = ''
  message.value = ''
  try {
    await respondToConsultation(item.id, response, session.token)
    await loadConsultations()
    responseDrafts.value[item.id] = response
    message.value = 'Tanggapan konsultasi berhasil dikirim.'
  } catch (requestError) {
    error.value = requestError?.message || 'Tanggapan gagal dikirim.'
  } finally {
    saving.value = false
  }
}

async function saveStatus(item) {
  const status = statusDrafts.value[item.id]
  if (!session?.token || !status) return

  saving.value = true
  error.value = ''
  message.value = ''
  try {
    await updateConsultationStatus(item.id, status, session.token)
    await loadConsultations()
    statusDrafts.value[item.id] = status
    message.value = 'Status konsultasi berhasil diperbarui.'
  } catch (requestError) {
    error.value = requestError?.message || 'Status konsultasi gagal diperbarui.'
  } finally {
    saving.value = false
  }
}

onMounted(() => loadConsultations())
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Ruang perawatan"
      title="Konsultasi"
      description="Pesan pasien tersusun sebagai kartu. Buka detail untuk menanggapi atau ubah status."
    >
      <template #actions>
        <button
          class="flex min-h-11 items-center justify-center gap-2 rounded-control border border-line bg-surface px-4 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/5 disabled:opacity-60"
          type="button"
          :disabled="loading"
          @click="loadConsultations"
        >
          <svg class="size-4" :class="loading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 7v5h-5M4 17v-5h5" />
            <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" />
          </svg>
          {{ loading ? 'Memuat' : 'Muat ulang' }}
        </button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-2" aria-label="Filter konsultasi">
        <button
          v-for="item in statusSummary"
          :key="item.key"
          type="button"
          :aria-pressed="filter === item.key"
          :class="[
            'min-h-9 rounded-full border px-3.5 text-xs font-medium transition',
            filter === item.key ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-muted hover:border-primary/40 hover:text-primary',
          ]"
          @click="filter = item.key"
        >
          {{ item.label }} <span class="ml-1 opacity-75">{{ item.value }}</span>
        </button>
      </div>
      <p class="text-xs text-muted">Pesan baru muncul di sebelah kanan.</p>
    </div>

    <p v-if="error" class="rounded-panel border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
      {{ error }}
    </p>
    <p v-if="message" class="rounded-panel border border-success/20 bg-success/5 px-4 py-3 text-sm text-success" role="status">
      {{ message }}
    </p>

    <div v-if="loading && !consultations.length" class="flex min-h-48 items-center justify-center gap-3 rounded-card border border-line bg-surface text-sm text-muted" role="status">
      <span class="size-4 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" aria-hidden="true" />
      Memuat konsultasi…
    </div>
    <EmptyState
      v-else-if="!filteredConsultations.length"
      :title="filter === 'ALL' ? 'Belum ada konsultasi' : 'Belum ada laporan di status ini'"
      description="Pesan konsultasi dari pasien akan muncul sebagai kartu di sini."
    />
    <div v-else class="grid items-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      <article
        v-for="item in filteredConsultations"
        :key="item.id"
        class="min-w-0 overflow-hidden rounded-card border border-line bg-surface shadow-[var(--connect-shadow-card)] transition hover:border-primary/30"
      >
        <header class="flex items-start gap-3 p-4">
          <span class="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {{ (item.patient?.namaLengkap || 'P').slice(0, 1).toUpperCase() }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h2 class="truncate text-sm font-semibold text-primary-dark">{{ item.patient?.namaLengkap || 'Pasien' }}</h2>
                <p class="mt-0.5 text-xs text-muted">{{ formatDate(item.createdAt) }}</p>
              </div>
              <span
                :class="[
                  'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium',
                  item.status === 'RESOLVED' ? 'bg-success/10 text-success' : item.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' : 'bg-warning/15 text-warning',
                ]"
              >
                {{ statusLabels[item.status] || item.status }}
              </span>
            </div>
            <p class="mt-3 truncate text-sm font-medium text-ink">{{ item.subject }}</p>
            <p class="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted">{{ item.description }}</p>
          </div>
        </header>

        <div class="flex items-center justify-between border-t border-line bg-base/50 px-4 py-2.5">
          <span class="text-xs text-muted">{{ item.response ? 'Sudah ditanggapi' : 'Belum ditanggapi' }}</span>
          <button
            type="button"
            class="flex min-h-8 items-center gap-1.5 rounded-control px-2.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
            :aria-expanded="isExpanded(item)"
            @click="toggleDetails(item)"
          >
            {{ isExpanded(item) ? 'Minimalkan' : 'Lihat detail' }}
            <svg
              class="size-3.5 transition-transform"
              :class="isExpanded(item) ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div v-if="isExpanded(item)" class="space-y-4 border-t border-line p-4">
          <div class="grid grid-cols-2 gap-2">
            <div class="rounded-panel bg-base px-3 py-2.5">
              <p class="text-[11px] text-muted">Lokasi keluhan</p>
              <p class="mt-1 text-sm font-medium text-ink">{{ item.location || '—' }}</p>
            </div>
            <div class="rounded-panel bg-base px-3 py-2.5">
              <p class="text-[11px] text-muted">Skala nyeri</p>
              <p class="mt-1 text-sm font-medium text-ink">{{ item.painScale ? `${item.painScale}/10` : '—' }}</p>
            </div>
            <div v-if="item.symptomStartedAt" class="col-span-2 rounded-panel bg-base px-3 py-2.5">
              <p class="text-[11px] text-muted">Gejala mulai</p>
              <p class="mt-1 text-sm font-medium text-ink">{{ formatDate(item.symptomStartedAt) }}</p>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-primary-dark">Detail keluhan</h3>
            <p class="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-ink">{{ item.description }}</p>
          </div>

          <div v-if="item.response" class="rounded-panel bg-primary/5 px-3.5 py-3">
            <h3 class="text-xs font-semibold text-primary-dark">Tanggapan sebelumnya</h3>
            <p class="mt-1.5 whitespace-pre-wrap text-sm leading-5 text-ink">{{ item.response }}</p>
          </div>

          <div>
            <label class="text-xs font-semibold text-primary-dark" :for="`response-${item.id}`">Tanggapan dokter</label>
            <textarea
              :id="`response-${item.id}`"
              v-model="responseDrafts[item.id]"
              class="mt-1.5 min-h-24 w-full resize-y rounded-panel border border-line bg-surface p-3 text-sm leading-5 text-ink outline-none transition placeholder:text-muted/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="Tulis saran atau tindak lanjut…"
              maxlength="5000"
            />
            <p class="mt-1 text-right text-[11px] text-muted">{{ (responseDrafts[item.id] || '').length }}/5000</p>
            <button
              class="mt-2 min-h-10 w-full rounded-control bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              :disabled="saving"
              @click="saveResponse(item)"
            >
              {{ saving ? 'Mengirim…' : 'Kirim tanggapan' }}
            </button>
          </div>

          <div class="flex flex-col gap-2 border-t border-line pt-3 sm:flex-row">
            <label class="sr-only" :for="`status-${item.id}`">Status konsultasi</label>
            <select
              :id="`status-${item.id}`"
              v-model="statusDrafts[item.id]"
              class="min-h-10 flex-1 rounded-control border border-line bg-surface px-3 text-sm text-ink"
            >
              <option value="PENDING">Menunggu</option>
              <option value="IN_PROGRESS">Dalam penanganan</option>
              <option value="RESOLVED">Selesai</option>
            </select>
            <button
              class="min-h-10 rounded-control border border-primary px-4 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              :disabled="saving || statusDrafts[item.id] === item.status"
              @click="saveStatus(item)"
            >
              {{ saving ? 'Menyimpan…' : 'Simpan status' }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
