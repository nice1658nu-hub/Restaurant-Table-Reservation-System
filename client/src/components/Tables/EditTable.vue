<template>
  <section class="panel-card form-card">
    <div class="section-header">
      <p class="eyebrow">Admin</p>
      <h1>แก้ไขข้อมูลโต๊ะ</h1>
      <p>ปรับหมายเลขโต๊ะ จำนวนที่นั่ง หรือสถานะการใช้งานของโต๊ะในระบบ</p>
    </div>

    <form class="form-grid" @submit.prevent="editTable">
      <label class="field">
        <span>ID โต๊ะ</span>
        <input type="text" v-model="table.id" readonly disabled>
      </label>

      <label class="field">
        <span>หมายเลขโต๊ะ</span>
        <input type="text" v-model.trim="table.table_number" required>
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
        <button class="btn btn-primary" type="submit">บันทึกการแก้ไข</button>
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
        capacity: 0,
        status: ''
      },
      error: null
    }
  },
  async created() {
    try {
      let tableId = this.$route.params.tableId
      this.table = (await TablesService.show(tableId)).data
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    async editTable() {
      try {
        await TablesService.put(this.table)
        this.$router.push({ name: 'tables' })
      } catch (err) {
        this.error = err?.response?.data?.error || 'ไม่สามารถบันทึกการแก้ไขได้'
      }
    },
    navigateTo(route) {
      this.$router.push(route)
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
