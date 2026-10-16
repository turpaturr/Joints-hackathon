<script setup>
import { computed, ref } from 'vue'
import { getSession } from '../../services/auth.api'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import {
  createMovement,
  deleteMovement,
  updateMovement,
} from '../../services/therapy.api'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import DeleteConfirmationDialog from '../../components/therapy/DeleteConfirmationDialog.vue'
import MediaPreviewDialog from '../../components/therapy/MediaPreviewDialog.vue'
import MovementFormDialog from '../../components/therapy/MovementFormDialog.vue'
import MovementTable from '../../components/therapy/MovementTable.vue'

const token = getSession()?.token
const busy = ref(false)
const notice = ref('')
const error = ref('')
const showMovementModal = ref(false)
const movementToDelete = ref(null)
const editingMovement = ref(null)
const mediaPreview = ref(null)
const sortedMovements = computed(() => [...monitoringData.movements].sort((a, b) => {
  const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime()
  const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime()
  return (Number.isFinite(dateB) ? dateB : 0) - (Number.isFinite(dateA) ? dateA : 0)
}))

function openMovementModal() {
  error.value = ''
  notice.value = ''
  editingMovement.value = null
  showMovementModal.value = true
}

function editMovement(movement) {
  error.value = ''
  notice.value = ''
  editingMovement.value = movement
  showMovementModal.value = true
}

function closeMovementModal() {
  if (busy.value) return
  showMovementModal.value = false
  editingMovement.value = null
}

async function saveMovement(payload) {
  error.value = notice.value = ''
  busy.value = true
  try {
    if (editingMovement.value) {
      await updateMovement(editingMovement.value.id, payload, token)
      notice.value = 'Gerakan berhasil diperbarui.'
    } else {
      await createMovement(payload, token)
      notice.value = 'Gerakan berhasil disimpan ke pustaka.'
    }
    await refreshMonitoringData(token)
    showMovementModal.value = false
    editingMovement.value = null
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    busy.value = false
  }
}

function confirmRemoveMovement(movement) {
  error.value = ''
  movementToDelete.value = movement
}

async function removeMovement() {
  const movement = movementToDelete.value
  if (!movement) return
  error.value = ''
  notice.value = ''
  busy.value = true
  try {
    await deleteMovement(movement.id, token)
    await refreshMonitoringData(token)
    notice.value = 'Gerakan berhasil dihapus.'
    movementToDelete.value = null
  } catch (requestError) {
    error.value = requestError.message || 'Gerakan gagal dihapus.'
  } finally {
    busy.value = false
  }
}

function closeDeleteConfirmation() {
  if (busy.value) return
  movementToDelete.value = null
}

function openImagePreview(movement) {
  mediaPreview.value = {
    type: 'IMAGE',
    title: movement.namaGerakan,
    src: `data:${movement.imageMimeType || 'image/jpeg'};base64,${movement.imageBase64}`,
  }
}

function getYoutubeEmbedUrl(value) {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    const videoId = host === 'youtu.be'
      ? url.pathname.slice(1).split('/')[0]
      : url.pathname === '/watch'
        ? url.searchParams.get('v')
        : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
    return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : null
  } catch {
    return null
  }
}

function openVideoPreview(movement) {
  const url = movement.youtubeUrl || movement.mediaUrl
  const embedUrl = getYoutubeEmbedUrl(url)
  if (!embedUrl) {
    error.value = 'URL video gerakan tidak valid.'
    return
  }
  mediaPreview.value = {
    type: 'VIDEO',
    title: movement.namaGerakan,
    src: embedUrl,
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
    <p v-if="error && !showMovementModal && !movementToDelete" class="rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">{{ error }}</p>

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
      <MovementTable
        v-else
        :movements="sortedMovements"
        :busy="busy"
        @edit="editMovement"
        @delete="confirmRemoveMovement"
        @preview-image="openImagePreview"
        @preview-video="openVideoPreview"
      />
    </SurfaceCard>

    <MovementFormDialog
      v-if="showMovementModal"
      :movement="editingMovement"
      :busy="busy"
      :error="error"
      @close="closeMovementModal"
      @submit="saveMovement"
    />

    <MediaPreviewDialog
      v-if="mediaPreview"
      :preview="mediaPreview"
      @close="mediaPreview = null"
    />

    <DeleteConfirmationDialog
      v-if="movementToDelete"
      title="Hapus gerakan ini?"
      :description="`Gerakan “${movementToDelete.namaGerakan}” akan dihapus dari pustaka terapi. Tindakan ini tidak dapat dibatalkan.`"
      confirm-label="Ya, hapus gerakan"
      :busy="busy"
      :error="error"
      @cancel="closeDeleteConfirmation"
      @confirm="removeMovement"
    />
  </div>
</template>
