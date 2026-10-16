<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'

const props = defineProps({
  movement: { type: Object, default: null },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'submit'])
const maxImageSize = 5 * 1024 * 1024
const movementForm = reactive({
  namaGerakan: props.movement?.namaGerakan || '',
  deskripsi: props.movement?.deskripsi || '',
  instruksi: props.movement?.instruksi || '',
  youtubeUrl: props.movement?.youtubeUrl || props.movement?.mediaUrl || '',
})
const selectedImage = ref(null)
const imagePreview = ref(props.movement?.imageBase64
  ? `data:${props.movement.imageMimeType || 'image/jpeg'};base64,${props.movement.imageBase64}`
  : '')
const imageInput = ref(null)
const validationError = ref('')

function releaseImagePreview() {
  if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
}

onBeforeUnmount(releaseImagePreview)

function onImageSelected(event) {
  const file = event.target.files?.[0]
  validationError.value = ''
  if (!file) {
    selectedImage.value = null
    if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = props.movement?.imageBase64
      ? `data:${props.movement.imageMimeType || 'image/jpeg'};base64,${props.movement.imageBase64}`
      : ''
    return
  }

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    validationError.value = 'Pilih gambar berformat JPG, PNG, atau WebP.'
    event.target.value = ''
    selectedImage.value = null
    if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = ''
    return
  }
  if (file.size > maxImageSize) {
    validationError.value = 'Ukuran gambar maksimal 5 MB.'
    event.target.value = ''
    selectedImage.value = null
    if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = props.movement?.imageBase64
      ? `data:${props.movement.imageMimeType || 'image/jpeg'};base64,${props.movement.imageBase64}`
      : ''
    return
  }

  if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
  selectedImage.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Gambar tidak dapat dibaca. Silakan pilih file lain.'))
        return
      }
      resolve(reader.result.split(',')[1])
    }
    reader.onerror = () => reject(new Error('Gambar gagal dibaca. Silakan coba lagi.'))
    reader.readAsDataURL(file)
  })
}

function normalizeVideoUrl(value) {
  const trimmedValue = value.trim()
  if (!trimmedValue) return ''

  const normalizedValue = /^[a-z][a-z\d+.-]*:/i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`

  try {
    const parsedUrl = new URL(normalizedValue)
    if (parsedUrl.protocol !== 'https:') return null
    const hostname = parsedUrl.hostname.toLowerCase()
    const isShortLink = hostname === 'youtu.be' && /^\/[^/]+/.test(parsedUrl.pathname)
    const isYoutubeLink = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(hostname)
      && (
        (parsedUrl.pathname === '/watch' && parsedUrl.searchParams.has('v'))
        || /^\/(embed|shorts)\/[^/]+/.test(parsedUrl.pathname)
      )
    if (!isShortLink && !isYoutubeLink) return null
    return parsedUrl.href
  } catch {
    return null
  }
}

async function submitMovement() {
  validationError.value = ''
  if (!movementForm.namaGerakan.trim() || !movementForm.instruksi.trim()) {
    validationError.value = 'Nama gerakan dan instruksi wajib diisi.'
    return
  }
  const videoUrl = normalizeVideoUrl(movementForm.youtubeUrl)
  if (!selectedImage.value && !props.movement) {
    validationError.value = 'Gambar gerakan wajib diunggah.'
    return
  }
  if (!videoUrl) {
    validationError.value = 'Masukkan URL video YouTube yang valid, seperti youtube.com/watch?v=...'
    return
  }

  try {
    const imageBase64 = selectedImage.value
      ? await readImageAsBase64(selectedImage.value)
      : undefined
    emit('submit', {
      namaGerakan: movementForm.namaGerakan,
      deskripsi: movementForm.deskripsi || undefined,
      instruksi: movementForm.instruksi,
      youtubeUrl: videoUrl,
      ...(imageBase64
        ? {
            imageBase64,
            imageMimeType: selectedImage.value.type,
          }
        : {}),
    })
  } catch (error) {
    validationError.value = error.message
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" @click.self="!busy && $emit('close')">
    <section aria-labelledby="movement-modal-title" aria-modal="true" class="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-[var(--connect-shadow-card)] sm:p-6" role="dialog">
      <header class="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="movement-modal-title" class="text-lg font-semibold text-primary-dark">
            {{ movement ? 'Edit gerakan' : 'Tambah gerakan' }}
          </h2>
          <p class="mt-1 text-sm text-muted">Lengkapi detail gerakan dan instruksi untuk pasien.</p>
          <p class="mt-1 text-xs text-muted">Unggah gambar dan tambahkan URL video YouTube untuk panduan yang lengkap.</p>
        </div>
        <button aria-label="Tutup popup" class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted hover:bg-base hover:text-ink disabled:opacity-50" type="button" :disabled="busy" @click="$emit('close')">×</button>
      </header>
      <p v-if="validationError || error" class="mb-4 rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">{{ validationError || error }}</p>
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submitMovement">
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
        <div class="grid gap-2 text-sm font-medium text-ink">
          <label for="movement-video-url">URL video</label>
          <input id="movement-video-url" v-model.trim="movementForm.youtubeUrl" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="text" inputmode="url" placeholder="youtube.com/watch?v=..." required />
          <p class="text-xs font-normal text-muted">Wajib URL YouTube. https:// akan ditambahkan otomatis jika belum ada.</p>
        </div>
        <div class="grid gap-2 text-sm font-medium text-ink">
          <label for="movement-image">Gambar gerakan</label>
          <input
            id="movement-image"
            ref="imageInput"
            class="min-h-11 w-full rounded-control border border-line bg-surface px-3 py-2 text-sm font-normal file:mr-3 file:rounded-control file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="onImageSelected"
          />
          <p class="text-xs font-normal text-muted">{{ movement ? 'Opsional, biarkan kosong untuk mempertahankan gambar saat ini.' : 'Wajib JPG, PNG, atau WebP.' }} Maksimal 5 MB. Gambar disimpan di database.</p>
          <img v-if="imagePreview" class="mt-1 h-36 w-full rounded-panel border border-line bg-base object-contain" :src="imagePreview" alt="Pratinjau gambar gerakan" />
        </div>
        <div class="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <button class="min-h-11 rounded-panel border border-line px-4 text-sm font-semibold text-primary-dark hover:bg-base disabled:opacity-50" type="button" :disabled="busy" @click="$emit('close')">Batal</button>
          <button class="min-h-11 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:bg-disabled" type="submit" :disabled="busy">
            {{ busy ? 'Menyimpan…' : movement ? 'Simpan perubahan' : 'Simpan gerakan' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
