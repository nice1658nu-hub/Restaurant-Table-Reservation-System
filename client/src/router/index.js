import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenStore } from '../stores/authen'

import ReservationIndex from '../components/Reservations/Index.vue'
import TablesIndex from '../components/Tables/Index.vue'
import TablesShow from '../components/Tables/ShowTable.vue'
import TablesCreate from '../components/Tables/CreateTable.vue'
import TablesEdit from '../components/Tables/EditTable.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue' 

import CreateReservation from '../components/Reservations/CreateReservation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/tables' },
    { path: '/tables', name: 'tables', component: TablesIndex },
    { path: '/table/create', name: 'table-create', component: TablesCreate, meta: { requiresAdmin: true } },
    { path: '/table/edit/:tableId', name: 'table-edit', component: TablesEdit, meta: { requiresAdmin: true } },
    { path: '/table/:tableId', name: 'table-show', component: TablesShow },
    { path: '/login', name: 'login', component: Login, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: Register, meta: { guestOnly: true } },
    { path: '/reservation/create/:tableId', name: 'reservation-create', component: CreateReservation, meta: { requiresAuth: true } },
    { path: '/reservations', name: 'reservations', component: ReservationIndex, meta: { requiresAuth: true } }
  ],
})

router.beforeEach((to, from, next) => {
  const store = useAuthenStore()

  if (to.meta.requiresAuth && !store.isUserLoggedIn) {
    alert('กรุณาเข้าสู่ระบบก่อนใช้งานหน้านี้')
    next('/login')
    return
  }

  if (to.meta.guestOnly && store.isUserLoggedIn) {
    next('/tables')
    return
  }

  if (to.meta.requiresAdmin && (!store.user || store.user.type !== 'admin')) {
    alert('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเข้าถึงหน้านี้ได้!')
    next('/tables')
  } else {
    next()
  }
})

export default router
