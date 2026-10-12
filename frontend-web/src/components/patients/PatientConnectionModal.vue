<script setup>
defineProps({
  open: { type: Boolean, default: false },
  code: { type: String, default: '' },
  error: { type: String, default: '' },
  connecting: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit', 'update:code'])
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="presentation"
    @click.self="!connecting && emit('close')"
  >
    <section
      aria-labelledby="add-patient-title"
      aria-modal="true"
      class="w-full max-w-md rounded-card border border-line bg-surface p-6 shadow-(--connect-shadow-card)"
      role="dialog"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 id="add-patient-title" class="text-lg font-semibold text-primary-dark">Tambah Pasien</h2>
          <p class="mt-1 text-sm leading-6 text-muted">Masukkan kode 6 digit yang ditampilkan di aplikasi pasien. Kode berlaku selama 10 menit.</p>
        </div>
        <button
          aria-label="Tutup popup"
          class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted transition hover:bg-base hover:text-ink disabled:opacity-50"
          type="button"
          :disabled="connecting"
          @click="emit('close')"
        >×</button>
      </div>

      <form class="mt-5 space-y-4" @submit.prevent="emit('submit')">
        <div>
          <label class="mb-2 block text-sm font-medium text-primary-dark" for="patient-connection-code">Kode pasien</label>
          <input
            id="patient-connection-code"
            :value="code"
            class="min-h-12 w-full rounded-control border border-line bg-surface px-3 text-center font-mono text-xl tracking-[0.3em] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            pattern="[0-9]{6}"
            placeholder="000000"
            aria-describedby="connection-code-hint"
            :disabled="connecting"
            @input="emit('update:code', $event.target.value.replace(/\D/g, '').slice(0, 6))"
          >
          <span id="connection-code-hint" class="sr-only">Masukkan enam angka dari aplikasi pasien.</span>
          <p v-if="error" class="mt-2 text-sm text-danger" role="alert">{{ error }}</p>
        </div>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            class="min-h-11 rounded-control border border-line px-5 text-sm font-semibold text-primary-dark transition hover:bg-base disabled:opacity-50"
            type="button"
            :disabled="connecting"
            @click="emit('close')"
          >Batal</button>
          <button
            class="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
            type="submit"
            :disabled="connecting"
          >{{ connecting ? 'Menghubungkan…' : 'Hubungkan' }}</button>
        </div>
      </form>
    </section>
  </div>
</template>
