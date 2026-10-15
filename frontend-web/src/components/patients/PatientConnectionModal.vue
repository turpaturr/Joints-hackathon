<script setup>
defineProps({
  code: { type: String, default: '' },
  error: { type: String, default: '' },
  connecting: { type: Boolean, default: false },
})

const emit = defineEmits(['update:code', 'submit', 'close'])

function updateCode(event) {
  emit('update:code', event.target.value.replace(/\D/g, '').slice(0, 6))
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="presentation"
    @click.self="!connecting && emit('close')"
  >
    <section
      aria-labelledby="add-patient-title"
      aria-modal="true"
      class="flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-card border border-line bg-surface shadow-[var(--connect-shadow-card)]"
      role="dialog"
    >
      <header class="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div class="min-w-0">
          <p class="mb-1 text-xs font-medium text-primary">DATA PASIEN</p>
          <h2 id="add-patient-title" class="text-lg font-semibold text-primary-dark">Tambah pasien</h2>
          <p class="mt-1 text-sm leading-5 text-muted">Masukkan kode 6 digit yang ditampilkan di aplikasi pasien. Kode berlaku selama 10 menit.</p>
        </div>
        <button
          aria-label="Tutup popup"
          class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted transition hover:bg-base hover:text-ink disabled:opacity-50"
          type="button"
          :disabled="connecting"
          @click="emit('close')"
        >
          ×
        </button>
      </header>

      <form class="space-y-4 p-5 sm:p-6" @submit.prevent="emit('submit')">
        <div class="text-center">
          <label class="mb-1.5 block text-center text-sm font-medium text-primary-dark" for="patient-connection-code">
            Kode pasien <span class="text-danger">*</span>
          </label>
          <input
            id="patient-connection-code"
            :value="code"
            class="mx-auto min-h-12 w-full max-w-xs rounded-control border border-line bg-surface px-3 text-center font-mono text-xl tracking-[0.3em] text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-base"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            pattern="[0-9]{6}"
            placeholder="000000"
            aria-describedby="connection-code-hint"
            :disabled="connecting"
            required
            @input="updateCode"
          >
          <span id="connection-code-hint" class="sr-only">Masukkan enam angka dari aplikasi pasien.</span>
        </div>
        <p v-if="error" class="rounded-control border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger" role="alert">
          {{ error }}
        </p>
        <footer class="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <button
            class="min-h-11 rounded-control border border-line px-5 text-sm font-semibold text-primary-dark transition hover:bg-base disabled:opacity-50"
            type="button"
            :disabled="connecting"
            @click="emit('close')"
          >
            Batal
          </button>
          <button
            class="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
            type="submit"
            :disabled="connecting"
          >
            {{ connecting ? 'Menghubungkan…' : 'Hubungkan' }}
          </button>
        </footer>
      </form>
    </section>
  </div>
</template>
