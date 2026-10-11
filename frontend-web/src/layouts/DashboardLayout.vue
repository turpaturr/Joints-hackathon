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
  { label: 'Overview', name: 'monitoring-overview', icon: 'OV' },
  { label: 'Patients', name: 'monitoring-patients', icon: 'PT' },
  { label: 'Therapy', name: 'monitoring-therapy', icon: 'TH' },
  { label: 'Reports', name: 'monitoring-reports', icon: 'RP' },
]

const title = computed(() => route.meta.title || 'Monitoring')
const displayName = computed(() => profile.value?.namaLengkap || profile.value?.email || 'Nakes')
const initial = computed(() => displayName.value.slice(0, 1).toUpperCase())
const deviceTime = computed(() =>
  new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(localNow.value),
)
const deviceDate = computed(() =>
  new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(localNow.value),
)
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

function closeOverlays() {
  mobileMenuOpen.value = false
  profileMenuOpen.value = false
}

function logout() {
  clearSession()
  closeOverlays()
  router.push('/')
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
  <div class="dashboard-frame">
    <button
      v-if="mobileMenuOpen"
      class="mobile-scrim"
      aria-label="Close navigation menu"
      @click="closeOverlays"
    />

    <aside :class="['sidebar', { collapsed, 'mobile-open': mobileMenuOpen }]">
      <RouterLink class="brand" to="/monitoring" @click="closeOverlays">
        <span class="brand-icon">C</span>
        <span v-if="!collapsed || mobileMenuOpen" class="brand-copy">
          <small>MONITORING</small>
          <strong>connect</strong>
        </span>
      </RouterLink>

      <button class="collapse-toggle" :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'" @click="collapsed = !collapsed">
        <span>{{ collapsed ? '›' : '‹' }}</span>
        <span v-if="!collapsed">Collapse</span>
      </button>

      <nav class="nav-list" aria-label="Dashboard navigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          :class="['nav-link', { active: route.name === item.name }]"
          :title="collapsed ? item.label : undefined"
          @click="closeOverlays"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!collapsed || mobileMenuOpen">{{ item.label }}</span>
        </RouterLink>
      </nav>

    </aside>

    <div class="dashboard-main">
      <header class="topbar">
        <div class="topbar-leading">
          <button class="mobile-menu-toggle" aria-label="Open navigation menu" @click="mobileMenuOpen = true">
            <span></span><span></span><span></span>
          </button>
          <div>
            <p class="topbar-kicker">CONNECT / CARE MANAGEMENT</p>
            <h1>{{ title }}</h1>
          </div>
        </div>

        <div class="topbar-right">
          <div class="clock-chip" aria-label="Local device date and time">
            <strong>{{ deviceTime }}</strong>
            <span>{{ deviceDate }} · {{ timeZone }}</span>
          </div>
          <div class="profile-menu-wrap">
            <button
              class="profile-trigger"
              :aria-expanded="profileMenuOpen"
              aria-haspopup="menu"
              @click="profileMenuOpen = !profileMenuOpen"
            >
              <span class="avatar">{{ initial }}</span>
              <span class="profile-trigger-copy"><strong>{{ displayName }}</strong><small>Nakes account</small></span>
              <span class="chevron">⌄</span>
            </button>
            <div v-if="profileMenuOpen" class="profile-menu" role="menu">
              <RouterLink to="/monitoring/account" role="menuitem" @click="closeOverlays">
                <span>Account</span><small>Profile & security</small>
              </RouterLink>
              <button role="menuitem" @click="logout">Log out</button>
            </div>
          </div>
        </div>
      </header>

      <main class="page-content">
        <div v-if="monitoringData.error" class="global-alert" role="alert">
          <span>{{ monitoringData.error }}</span>
          <button @click="refreshMonitoringData(session?.token)">Retry</button>
        </div>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
.dashboard-frame {
  --navy: #0d47a1;
  --blue: #2196f3;
  --soft-blue: #90caf9;
  --ice: #e3f2fd;
  display: flex;
  min-height: 100vh;
  color: #16324f;
  background: #edf6ff;
  font-family: Inter, 'Segoe UI', sans-serif;
}
.dashboard-frame * { box-sizing: border-box; }
.sidebar {
  position: fixed;
  z-index: 30;
  inset: 0 auto 0 0;
  display: flex;
  width: 248px;
  flex-direction: column;
  padding: 22px 15px 18px;
  color: #fff;
  background: linear-gradient(165deg, #0d47a1, #123e85);
  transition: width 220ms ease, transform 220ms ease;
}
.sidebar.collapsed { width: 82px; }
.brand { display: flex; align-items: center; gap: 12px; min-height: 50px; padding: 3px 7px; color: inherit; text-decoration: none; }
.brand-icon { display: grid; width: 36px; height: 36px; flex: 0 0 36px; place-items: center; border: 1px solid #ffffff35; border-radius: 11px; background: #ffffff1c; font-weight: 800; }
.brand-copy { display: grid; gap: 3px; }
.brand-copy small, .topbar-kicker { font-size: 9px; font-weight: 800; letter-spacing: .13em; }
.brand-copy { font-size: 19px; }
.collapse-toggle { display: flex; align-items: center; gap: 10px; margin: 24px 0 10px; padding: 9px 11px; border: 0; border-radius: 10px; color: #d9e8ff; background: transparent; text-align: left; cursor: pointer; }
.collapse-toggle:hover, .nav-link:hover { background: #ffffff18; }
.collapse-toggle span:first-child { width: 18px; text-align: center; font-size: 21px; line-height: 1; }
.nav-list { display: grid; gap: 7px; }
.nav-link { display: flex; min-height: 43px; align-items: center; gap: 12px; padding: 8px 10px; border: 1px solid transparent; border-radius: 11px; color: #e5f1ff; font-size: 13px; font-weight: 650; text-decoration: none; transition: background 160ms, border-color 160ms; }
.nav-link.active { border-color: #ffffff2e; background: #ffffff20; box-shadow: inset 3px 0 #90caf9; }
.nav-icon { display: grid; width: 26px; height: 26px; flex: 0 0 26px; place-items: center; border-radius: 8px; color: #c9e4ff; background: #ffffff12; font-size: 9px; font-weight: 800; }
.dashboard-main { width: calc(100% - 248px); min-width: 0; min-height: 100vh; margin-left: 248px; transition: width 220ms ease, margin-left 220ms ease; }
.sidebar.collapsed ~ .dashboard-main { width: calc(100% - 82px); margin-left: 82px; }
.topbar { position: sticky; z-index: 20; top: 0; display: flex; min-height: 82px; align-items: center; justify-content: space-between; gap: 18px; padding: 13px clamp(18px, 3vw, 38px); border-bottom: 1px solid #d9e9fa; background: #f7fbffed; backdrop-filter: blur(16px); }
.topbar-leading, .topbar-right, .profile-trigger { display: flex; align-items: center; }
.topbar-leading { gap: 13px; }
.topbar-kicker { margin: 0 0 4px; color: #4780b9; }
.topbar h1 { margin: 0; color: #123e73; font-size: 20px; letter-spacing: -.02em; }
.topbar-right { gap: 16px; }
.clock-chip { display: grid; gap: 2px; padding: 7px 11px; border: 1px solid #d7e9f9; border-radius: 10px; color: #416482; background: #fff; font-variant-numeric: tabular-nums; transform-origin: center; transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease; }
.clock-chip:hover { z-index: 21; border-color: #9fcff2; box-shadow: 0 12px 28px #164d8326; transform: scale(1.22); }
.clock-chip:hover strong { font-size: 14px; }
.clock-chip:hover span { font-size: 10px; }
.clock-chip:focus-visible { outline: 2px solid #2196f3; outline-offset: 2px; }
.clock-chip strong { font-size: 11px; }.clock-chip span { color: #8298aa; font-size: 9px; }
.profile-menu-wrap { position: relative; }
.profile-trigger { gap: 9px; padding: 5px 8px; border: 1px solid transparent; border-radius: 12px; color: #173755; background: transparent; text-align: left; cursor: pointer; }
.profile-trigger:hover, .profile-trigger[aria-expanded="true"] { border-color: #d7e9f9; background: white; }
.avatar { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; color: #fff; background: linear-gradient(145deg, #2196f3, #0d47a1); font-weight: 800; }
.profile-trigger-copy { display: grid; gap: 2px; }
.profile-trigger-copy strong { max-width: 150px; overflow: hidden; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.profile-trigger-copy small { color: #71869a; font-size: 9px; }
.chevron { color: #70879c; }
.profile-menu { position: absolute; top: calc(100% + 9px); right: 0; display: grid; width: 190px; padding: 6px; border: 1px solid #d9e8f5; border-radius: 13px; background: white; box-shadow: 0 18px 48px #194d771f; }
.profile-menu a, .profile-menu button { display: grid; gap: 3px; padding: 10px; border: 0; border-radius: 8px; color: #183b5b; background: transparent; text-align: left; text-decoration: none; cursor: pointer; }
.profile-menu a:hover, .profile-menu button:hover { background: #edf6ff; }
.profile-menu small { color: #7890a5; font-size: 10px; }
.page-content { max-width: 1600px; margin: 0 auto; padding: 26px clamp(18px, 3vw, 38px) 42px; }
.global-alert { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; padding: 12px 15px; border: 1px solid #f5d9a8; border-radius: 12px; color: #805519; background: #fff8e9; font-size: 13px; }
.global-alert button { padding: 6px 10px; border: 1px solid #edd7ad; border-radius: 8px; color: inherit; background: white; cursor: pointer; }
.mobile-menu-toggle { display: none; width: 38px; height: 38px; align-content: center; justify-items: center; gap: 4px; border: 1px solid #d7e8f6; border-radius: 10px; background: white; }
.mobile-menu-toggle span { width: 17px; height: 2px; border-radius: 2px; background: #164d83; }
.mobile-scrim { display: none; }
@media (max-width: 760px) {
  .sidebar, .sidebar.collapsed { width: 248px; transform: translateX(-100%); }
  .sidebar.mobile-open { transform: translateX(0); }
  .sidebar.collapsed .brand-copy, .sidebar.collapsed .collapse-toggle span:last-child, .sidebar.collapsed .nav-link > span:last-child, .sidebar.collapsed .sidebar-clock small, .sidebar.collapsed .sidebar-clock span { display: initial; }
  .sidebar.collapsed .nav-link > span:last-child, .sidebar.collapsed .sidebar-clock small, .sidebar.collapsed .sidebar-clock span { display: block; }
  .sidebar.collapsed .collapse-toggle { display: none; }
  .dashboard-main, .sidebar.collapsed ~ .dashboard-main { width: 100%; margin-left: 0; }
  .mobile-menu-toggle { display: grid; }
  .mobile-scrim { position: fixed; z-index: 29; inset: 0; display: block; border: 0; background: #09243e75; backdrop-filter: blur(2px); }
  .topbar { min-height: 72px; padding: 11px 15px; }
  .topbar h1 { font-size: 17px; }
  .topbar-kicker { font-size: 8px; }
  .profile-trigger-copy, .chevron { display: none; }
  .clock-chip { padding: 6px 8px; }.clock-chip span { max-width: 94px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .profile-trigger { padding: 2px; }
  .topbar-right { gap: 6px; }
  .page-content { padding: 18px 14px 30px; }
}
@media (prefers-reduced-motion: reduce) {
  .sidebar, .dashboard-main, .nav-link, .clock-chip { transition: none; }
  .clock-chip:hover { transform: none; }
}
</style>
