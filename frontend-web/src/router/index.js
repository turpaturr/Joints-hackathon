import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'

function getSessionToken() {
  try {
    const raw = localStorage.getItem('joints_session')
    return raw ? JSON.parse(raw)?.token : null
  } catch (error) {
    return null
  }
}

const routes = [
    { path: '/', redirect: '/login' },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Auth/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Auth/Register.vue')
    },
    {
        path: '/monitoring',
        component: DashboardLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'monitoring-overview',
                component: () => import('../views/Monitoring/Index.vue'),
                meta: { title: 'Dashboard' },
            },
            {
                path: 'patients',
                name: 'monitoring-patients',
                component: () => import('../views/Patients/Index.vue'),
                meta: { title: 'Pasien' },
            },
            {
                path: 'therapy',
                name: 'monitoring-therapy',
                component: () => import('../views/Therapy/Index.vue'),
                meta: { title: 'Terapi' },
            },
            {
                path: 'reports',
                name: 'monitoring-reports',
                component: () => import('../views/Reports/Index.vue'),
                meta: { title: 'Riwayat terapi' },
            },
            {
                path: 'account',
                name: 'monitoring-account',
                component: () => import('../views/Account/Index.vue'),
                meta: { title: 'Akun' },
            },
        ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
  const token = getSessionToken()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if ((to.path === '/login' || to.path === '/register') && token) {
    next({ name: 'monitoring-overview' })
    return
  }

  next()
})

export default router