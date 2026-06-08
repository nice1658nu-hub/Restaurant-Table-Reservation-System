<template>
  <section class="hero-card">
    <div class="hero-copy">
      <p class="eyebrow">Welcome Back</p>
      <h1>เข้าสู่ระบบเพื่อจัดการการจองโต๊ะของคุณ</h1>
    </div>

    <form class="panel-card auth-form" @submit.prevent="onLogin">
      <div class="section-header compact">
        <p class="eyebrow">Login</p>
        <h2>เริ่มใช้งานระบบ</h2>
      </div>

      <label class="field">
        <span>อีเมล</span>
        <input type="email" v-model.trim="email" placeholder="you@example.com" required />
      </label>

      <label class="field">
        <span>รหัสผ่าน</span>
        <input type="password" v-model="password" placeholder="กรอกรหัสผ่าน" required />
      </label>

      <button class="btn btn-primary btn-block" type="submit">Login</button>
      <p v-if="error" class="form-error">{{ error }}</p>

      <p class="form-switch">
        ยังไม่มีบัญชี?
        <router-link :to="{ name: 'register' }">สมัครสมาชิกที่นี่</router-link>
      </p>
    </form>
  </section>
</template>

<script>
import AuthenService from '../services/AuthenService'
import { useAuthenStore } from '../stores/authen'

export default {
    data() {
        return {
            email: '',
            password: '',
            error: null
        }
    },
    methods: {
        async onLogin() {
            try {
                const response = await AuthenService.login({
                    email: this.email,
                    password: this.password
                })

                const authenStore = useAuthenStore()
                authenStore.setToken(response.data.token)
                authenStore.setUser(response.data.user)

                this.$router.push({
                    name: 'tables'
                })

            } catch (error) {
                this.error = error?.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
            }
        }
    }
}
</script>

<style scoped>
.auth-form {
  max-width: 30rem;
}

.form-switch {
  margin: 0;
  color: var(--color-muted);
}

.form-switch a {
  color: var(--color-accent-strong);
}

.compact {
  margin-bottom: 0.5rem;
}
</style>
