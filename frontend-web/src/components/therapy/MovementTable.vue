<script setup>
defineProps({
  movements: { type: Array, required: true },
  busy: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'preview-image', 'preview-video'])
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[1040px] table-fixed border-collapse text-left">
      <colgroup>
        <col class="w-[19%]">
        <col class="w-[18%]">
        <col class="w-[29%]">
        <col class="w-[19%]">
        <col class="w-[15%]">
      </colgroup>
      <thead>
        <tr class="border-b border-line text-xs font-medium text-muted">
          <th class="px-4 py-3">Nama gerakan</th>
          <th class="px-4 py-3">Deskripsi</th>
          <th class="px-4 py-3">Instruksi</th>
          <th class="px-4 py-3">Media terapi</th>
          <th class="px-4 py-3 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line/70">
        <tr v-for="movement in movements" :key="movement.id" class="text-sm text-ink hover:bg-base/50">
          <td class="px-4 py-3 align-middle">
            <span class="line-clamp-2 break-words font-medium leading-5 text-primary-dark" :title="movement.namaGerakan">{{ movement.namaGerakan }}</span>
          </td>
          <td class="px-4 py-3 align-middle">
            <span class="line-clamp-2 break-words leading-5 text-muted" :title="movement.deskripsi || 'Tidak ada deskripsi'">{{ movement.deskripsi || 'Tidak ada deskripsi' }}</span>
          </td>
          <td class="px-4 py-3 align-middle">
            <span class="line-clamp-2 break-words leading-5" :title="movement.instruksi">{{ movement.instruksi }}</span>
          </td>
          <td class="px-4 py-3 align-middle">
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-if="movement.imageBase64"
                class="min-h-8 whitespace-nowrap rounded-control border border-line px-2.5 text-[11px] font-semibold text-primary transition hover:bg-primary/5"
                type="button"
                @click="$emit('preview-image', movement)"
              >
                Lihat gambar
              </button>
              <button
                v-if="movement.youtubeUrl || movement.mediaUrl"
                class="min-h-8 whitespace-nowrap rounded-control border border-line px-2.5 text-[11px] font-semibold text-primary transition hover:bg-primary/5"
                type="button"
                @click="$emit('preview-video', movement)"
              >
                Lihat video
              </button>
              <span v-if="!movement.imageBase64 && !movement.youtubeUrl && !movement.mediaUrl" class="text-muted">Tidak tersedia</span>
            </div>
          </td>
          <td class="px-4 py-3 align-middle">
            <div class="flex justify-end gap-1.5">
              <button
                class="min-h-8 rounded-control border border-line px-2.5 text-[11px] font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50"
                type="button"
                :disabled="busy"
                @click="$emit('edit', movement)"
              >
                Edit
              </button>
              <button
                class="min-h-8 rounded-control border border-danger/25 px-2.5 text-[11px] font-semibold text-danger transition hover:bg-danger/5 disabled:opacity-50"
                type="button"
                :disabled="busy"
                @click="$emit('delete', movement)"
              >
                Hapus
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
