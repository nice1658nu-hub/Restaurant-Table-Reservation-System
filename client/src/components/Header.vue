<template>
  <header class="site-header">
    <div class="brand-block">
      <p class="brand-eyebrow">Restaurant Table Reservation System</p>
      <router-link :to="{ name: 'tables' }" class="brand-title">
        ReserveTable
      </router-link>
    </div>

    <nav class="nav-pills">
      <router-link :to="{ name: 'tables' }">โต๊ะทั้งหมด</router-link>
      <router-link v-if="isLoggedIn" :to="{ name: 'reservations' }">
        {{ isAdmin ? 'รายการจองทั้งหมด' : 'ประวัติการจอง' }}
      </router-link>
      <router-link v-if="isAdmin" :to="{ name: 'table-create' }">เพิ่มโต๊ะ</router-link>
      <router-link v-if="!isLoggedIn" :to="{ name: 'login' }">เข้าสู่ระบบ</router-link>
      <router-link v-if="!isLoggedIn" :to="{ name: 'register' }">สมัครสมาชิก</router-link>
    </nav>

    <div class="account-panel">
      <template v-if="isLoggedIn">
        <div class="account-summary">
          <span class="account-name">{{ displayName }}</span>
          <span class="account-role">{{ isAdmin ? 'Admin' : 'Customer' }}</span>
        </div>
        <button class="btn btn-secondary" @click="logout">ออกจากระบบ</button>
      </template>
      <template v-else>
        <p class="account-hint">เข้าสู่ระบบเพื่อใช้งานระบบ</p>
      </template>
    </div>
  </header>
</template>

<script>
import { useAuthenStore } from '../stores/authen'

export default {
  computed: {
    authenStore() {
      return useAuthenStore()
    },
    isLoggedIn() {
      return this.authenStore.isUserLoggedIn
    },
    isAdmin() {
      return this.authenStore.user?.type === 'admin'
    },
    displayName() {
      const user = this.authenStore.user
      if (!user) {
        return ''
      }
      return [user.name, user.lastname].filter(Boolean).join(' ')
    }
  },
  methods: {
    logout() {
      this.authenStore.logout()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>
.site-header {
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(247, 201, 72, 0.34), transparent 38%),
    rgba(20, 28, 32, 0.88);
  border: 1px solid rgba(229, 197, 123, 0.24);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
}

.brand-eyebrow {
  margin: 0 0 0.45rem;
  font-size: 0.76rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.brand-title {
  display: inline-block;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  color: var(--color-heading);
}

.nav-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.nav-pills a {
  padding: 0.8rem 1.1rem;
  border-radius: 999px;
  background: rgba(255, 248, 232, 0.08);
  color: var(--color-text);
  border: 1px solid rgba(255, 248, 232, 0.08);
}

.nav-pills a.router-link-exact-active,
.nav-pills a:hover {
  background: linear-gradient(135deg, rgba(245, 205, 98, 0.94), rgba(217, 150, 52, 0.96));
  color: #24180b;
  border-color: rgba(255, 226, 170, 0.35);
}

.account-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.account-summary {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.account-name {
  font-weight: 700;
  color: var(--color-heading);
}

.account-role {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(245, 205, 98, 0.14);
  color: var(--color-accent-strong);
  font-size: 0.9rem;
}

.account-hint {
  margin: 0;
  color: var(--color-muted);
}

@media (max-width: 700px) {
  .site-header {
    padding: 1.15rem;
    border-radius: 22px;
  }
}
</style>
