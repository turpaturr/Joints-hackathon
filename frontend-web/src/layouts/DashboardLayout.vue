<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clearSession, getSession } from '../services/auth.api'
import { monitoringData, refreshMonitoringData } from '../composables/useMonitoringData'

const route = useRoute()
const router = useRouter()
const session = getSession()
const profile = ref(session?.user || {})
const collapsed = ref(false)
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const localNow = ref(new Date())
let clockInterval

const navItems = [
  { label: 'Dashboard', name: 'monitoring-overview', icon: 'dashboard' },
  { label: 'Pasien', name: 'monitoring-patients', icon: 'patients' },
  { label: 'Jadwal obat', name: 'monitoring-medications', icon: 'medications' },
  { label: 'Gerakan terapi', name: 'monitoring-movements', icon: 'therapy' },
  { label: 'Tugaskan terapi', name: 'monitoring-prescriptions', icon: 'therapy' },
  { label: 'Riwayat terapi', name: 'monitoring-reports', icon: 'history' },
  { label: 'Akun', name: 'monitoring-account', icon: 'account' },
]

const title = computed(() => route.meta.title || 'Dashboard')
const displayName = computed(() => profile.value?.namaLengkap || profile.value?.email || 'Nakes')
const initial = computed(() => displayName.value.slice(0, 1).toUpperCase())
const deviceTime = computed(() =>
  new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(localNow.value),
)
const deviceDate = computed(() =>
  new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }).format(localNow.value),
)
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const deviceLocation = computed(() => {
  const zoneCity = timeZone.split('/').at(-1)?.replaceAll('_', ' ')
  return zoneCity || 'Lokasi perangkat'
})

function closeOverlays() {
  mobileMenuOpen.value = false
  profileMenuOpen.value = false
}

function logout() {
  clearSession()
  closeOverlays()
  router.push('/login')
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeOverlays()
}

onMounted(() => {
  clockInterval = window.setInterval(() => {
    localNow.value = new Date()
  }, 1000)
  window.addEventListener('keydown', handleKeydown)
  refreshMonitoringData(session?.token)
})

onUnmounted(() => {
  window.clearInterval(clockInterval)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-base text-ink">
    <button
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-ink/30 lg:hidden"
      aria-label="Tutup navigasi"
      @click="closeOverlays"
    />

   <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-slate-200 bg-white px-4 py-5 text-slate-700 transition-transform duration-200 lg:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        collapsed ? 'lg:w-[76px]' : 'lg:w-[248px]',
      ]"
    >
       <RouterLink
        :class="[
          'flex items-center justify-center text-white no-underline transition-all duration-200 overflow-hidden',
          collapsed && !mobileMenuOpen ? 'h-16' : 'h-28 px-2',
        ]"
        to="/monitoring"
        aria-label="Connect - Dashboard"
        @click="closeOverlays"
      >
        <img
          src="/Connect.png"
          alt="Connect"
          :class="[
            'shrink-0 object-contain transition-all duration-200',
            collapsed && !mobileMenuOpen ? 'size-10 scale-100' : 'w-full max-w-[210px] scale-70',
          ]"
        >
      </RouterLink>

      <button
        class="mt-4 hidden min-h-11 items-center gap-3 rounded-control px-3 text-left text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:flex"
        :aria-label="collapsed ? 'Perluas menu samping' : 'Ringkas menu samping'"
        @click="collapsed = !collapsed"
      >
        <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path v-if="collapsed" d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          <path v-else d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span v-if="!collapsed">Ringkas menu</span>
      </button>

      <nav class="mt-4 grid gap-1.5" aria-label="Navigasi utama">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          :class="[
            'flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium no-underline transition-colors',
            route.name === item.name 
              ? 'bg-[#1679ab] text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          ]"
          :title="collapsed && !mobileMenuOpen ? item.label : undefined"
          @click="closeOverlays"
        >
          <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <template v-if="item.icon === 'dashboard'">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
            </template>
            <template v-else-if="item.icon === 'patients'">
              <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
              <circle cx="9.5" cy="7" r="4" />
              <path d="M17 11a4 4 0 0 0 0-8M21 20v-1.5a4 4 0 0 0-3-3.87" />
            </template>
            <template v-else-if="item.icon === 'therapy'">
              <path d="M12 3v4m0 10v4M3 12h4m10 0h4" />
              <path d="m5.64 5.64 2.83 2.83m7.06 7.06 2.83 2.83m0-12.72-2.83 2.83m-7.06 7.06-2.83 2.83" />
              <circle cx="12" cy="12" r="3" />
            </template>
            <template v-else-if="item.icon === 'history'">
              <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
              <path d="M3 3v5h5m4-1v5l3 2" />
            </template>
            <template v-else-if="item.icon === 'medications'">
              <path d="m10.5 3.5 10 10a4.24 4.24 0 0 1-6 6l-10-10a4.24 4.24 0 0 1 6-6Z" />
              <path d="m8 14 6-6" />
            </template>
            <template v-else>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </template>
          </svg>
          <span v-if="!collapsed || mobileMenuOpen">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div :class="['min-h-screen transition-[margin] duration-200', collapsed ? 'lg:ml-[76px]' : 'lg:ml-[248px]']">
      <header class="sticky top-0 z-30 flex min-h-[72px] items-center justify-between gap-3 border-b border-line bg-base/95 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div class="flex min-w-0 items-center gap-3">
          <button
            class="grid size-11 shrink-0 place-items-center rounded-panel border border-line bg-surface text-primary-dark lg:hidden"
            aria-label="Buka navigasi"
            :aria-expanded="mobileMenuOpen"
            @click="mobileMenuOpen = true"
          >
            <span class="text-xl" aria-hidden="true">☰</span>
          </button>
          <div class="min-w-0">
            <p class="hidden text-xs font-medium text-muted sm:block">Connect · Pemantauan Nakes</p>
            <h1 class="truncate text-lg font-semibold text-primary-dark sm:text-xl">{{ title }}</h1>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
          <div class="group hidden origin-right items-center gap-2.5 rounded-panel border-r border-line pr-4 transition duration-200 hover:scale-110 hover:border-line hover:bg-surface hover:px-3 hover:py-2 hover:shadow-[var(--connect-shadow-card)] md:flex" aria-label="Waktu lokal perangkat">
            <svg class="size-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span class="grid gap-0.5">
              <span class="text-xs font-semibold leading-4 text-primary-dark transition group-hover:text-sm">{{ deviceLocation }} <span class="font-normal text-muted">· {{ deviceTime }}</span></span>
              <span class="text-[10px] leading-3 text-muted transition group-hover:text-xs">{{ deviceDate }} · {{ timeZone }}</span>
            </span>
          </div>
          <div class="relative">
            <button
              class="flex min-h-11 items-center gap-2 rounded-panel px-1.5 text-left hover:bg-surface sm:gap-3 sm:px-2"
              :aria-expanded="profileMenuOpen"
              aria-haspopup="menu"
              @click="profileMenuOpen = !profileMenuOpen"
            >
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">{{ initial }}</span>
              <span class="hidden max-w-36 sm:grid">
                <strong class="truncate text-sm font-medium text-ink">{{ displayName }}</strong>
                <small class="text-xs text-muted">Akun Nakes</small>
              </span>
              <span class="hidden text-muted sm:inline" aria-hidden="true">⌄</span>
            </button>
            <div v-if="profileMenuOpen" class="absolute right-0 top-full z-40 mt-2 grid w-52 rounded-panel border border-line bg-surface p-1.5 shadow-lg" role="menu">
              <RouterLink class="grid min-h-11 content-center rounded-control px-3 text-sm text-ink no-underline hover:bg-base" to="/monitoring/account" role="menuitem" @click="closeOverlays">
                Akun dan keamanan
              </RouterLink>
              <button class="min-h-11 rounded-control px-3 text-left text-sm text-danger hover:bg-danger/5" role="menuitem" @click="logout">Keluar</button>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div v-if="monitoringData.error" class="flex flex-col justify-between gap-3 rounded-panel border border-warning/30 bg-warning/5 p-4 text-sm text-ink sm:flex-row sm:items-center" role="alert">
          <span>{{ monitoringData.error }}</span>
          <button class="min-h-11 rounded-panel border border-line bg-surface px-4 font-medium text-primary hover:bg-base" @click="refreshMonitoringData(session?.token)">Coba lagi</button>
        </div>
        <RouterView />
      </main>
    </div>
  </div>
</template>
