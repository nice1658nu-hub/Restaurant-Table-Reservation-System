<template>
  <section class="panel-card form-card">
    <div class="section-header">
      <p class="eyebrow">Admin</p>
      <h1>เพิ่มโต๊ะอาหารใหม่</h1>
      <p>กำหนดหมายเลขโต๊ะ จำนวนที่นั่ง และสถานะเริ่มต้นก่อนเปิดให้ลูกค้าจอง</p>
    </div>

    <form class="form-grid" @submit.prevent="createTable">
      <label class="field">
        <span>หมายเลขโต๊ะ</span>
        <input type="text" v-model.trim="table.table_number" placeholder="เช่น A1, B2, C3" required>
      </label>

      <label class="field">
        <span>จำนวนที่นั่ง</span>
        <input type="number" min="1" v-model.number="table.capacity" required>
      </label>

      <label class="field">
        <span>สถานะ</span>
        <select v-model="table.status">
          <option value="available">ว่าง (Available)</option>
          <option value="unavailable">ไม่ว่าง (Unavailable)</option>
        </select>
      </label>

      <div class="action-row">
        <button class="btn btn-primary" type="submit">บันทึกโต๊ะ</button>
        <button class="btn btn-secondary" type="button" @click="navigateTo('/tables')">กลับ</button>
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>
    </form>
  </section>
</template>

<script>
import TablesService from '../../services/TablesService'

export default {
    data() {
        return {
            table: {
                table_number: '',
                capacity: 2,
                status: 'available'
            },
            error: null
        }
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route)
        },
        async createTable() {
            try {
                await TablesService.post(this.table)
                this.$router.push({ name: 'tables' }) 
            } catch (err) {
                this.error = err?.response?.data?.error || 'เกิดข้อผิดพลาดในการสร้างโต๊ะ'
            }
        }
    }
}
</script>

<style scoped>
.form-card {
  max-width: 42rem;
  margin: 0 auto;
}
</style>
