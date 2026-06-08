<template>
  <section class="hero-card">
    <div class="hero-copy">
      <p class="eyebrow">Create Account</p>
      <h1>สมัครสมาชิกเพื่อเริ่มจองโต๊ะออนไลน์</h1>
    </div>

    <form class="panel-card auth-form" @submit.prevent="onRegister">
      <div class="section-header compact">
        <p class="eyebrow">Register</p>
        <h2>ข้อมูลสมาชิกใหม่</h2>
      </div>

      <div class="form-grid two-cols">
        <label class="field">
          <span>ชื่อ</span>
          <input type="text" v-model.trim="user.name" required />
        </label>

        <label class="field">
          <span>นามสกุล</span>
          <input type="text" v-model.trim="user.lastname" required />
        </label>
      </div>

      <label class="field">
        <span>อีเมล</span>
        <input type="email" v-model.trim="user.email" required />
      </label>

      <label class="field">
        <span>รหัสผ่าน</span>
        <input type="password" v-model="user.password" minlength="4" required />
      </label>

      <button class="btn btn-primary btn-block" type="submit">สมัครสมาชิก</button>
      <button class="btn btn-secondary btn-block" type="button" @click="navigateTo('/login')">
        กลับไปหน้าเข้าสู่ระบบ
      </button>

      <p v-if="error" class="form-error">{{ error }}</p>
    </form>
  </section>
</template>

<script>
import AuthenService from '../services/AuthenService'

export default {
    data() {
        return {
            user: {
                name: '',
                lastname: '',
                email: '',
                password: '',
                status: 'active',
                type: 'user' // บังคับให้คนที่สมัครผ่านหน้านี้เป็นแค่ user ธรรมดา
            },
            error: null
        }
    },
    methods: {
        async onRegister() {
            try {
                await AuthenService.register(this.user)
                alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ')
                this.$router.push({ name: 'login' })
            } catch (error) {
                this.error = error?.response?.data?.error || 'ไม่สามารถสมัครสมาชิกได้'
            }
        },
        navigateTo(route) {
            this.$router.push(route)
        }
    }
}
</script>

<style scoped>
.auth-form {
  max-width: 34rem;
}

.compact {
  margin-bottom: 0.5rem;
}
</style>
