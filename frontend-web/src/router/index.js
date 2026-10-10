import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Auth/Login.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router