<template>
  <section class="stack-lg">
    <div class="hero-banner">
      <div>
        <p class="eyebrow">Dining Room Overview</p>
        <h1>{{ isAdmin ? 'จัดการโต๊ะทั้งหมดของร้าน' : 'เลือกโต๊ะว่างสำหรับการจองของคุณ' }}</h1>
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <span>โต๊ะทั้งหมด</span>
          <strong>{{ tables.length }}</strong>
        </article>
        <article class="summary-card">
          <span>ว่างตอนนี้</span>
          <strong>{{ availableCount }}</strong>
        </article>
        <article class="summary-card">
          <span>ไม่ว่าง</span>
          <strong>{{ unavailableCount }}</strong>
        </article>
      </div>
    </div>

    <div class="action-row">
      <button v-if="isAdmin" class="btn btn-primary" @click="navigateTo('/table/create')">
        เพิ่มโต๊ะใหม่
      </button>
      <button v-if="isUserLoggedIn" class="btn btn-secondary" @click="navigateTo('/reservations')">
        {{ isAdmin ? 'เปิดรายการจองทั้งหมด' : 'ดูประวัติการจองของฉัน' }}
      </button>
    </div>

    <div v-if="tables.length === 0" class="panel-card empty-state">
      <h3>ยังไม่มีข้อมูลโต๊ะในระบบ</h3>
      <p>เริ่มต้นด้วยการเพิ่มโต๊ะใหม่เพื่อให้ลูกค้าสามารถจองผ่านเว็บไซต์ได้</p>
    </div>

    <div v-else class="grid-list cards-3">
      <article v-for="table in tables" :key="table.id" class="panel-card table-card">
        <div class="table-card-top">
          <div>
            <p class="table-label">โต๊ะหมายเลข</p>
            <h3>{{ table.table_number }}</h3>
          </div>
          <span class="status-badge" :class="table.status">
            {{ table.status === 'available' ? 'ว่าง' : 'ไม่ว่าง' }}
          </span>
        </div>

        <div class="table-meta">
          <div>
            <span>จำนวนที่นั่ง</span>
            <strong>{{ table.capacity }} ที่นั่ง</strong>
          </div>
          <div>
            <span>การใช้งาน</span>
            <strong>{{ table.status === 'available' ? 'พร้อมรับจอง' : 'มีการใช้งานอยู่' }}</strong>
          </div>
        </div>

        <p class="table-note">
          {{ table.status === 'available'
            ? 'สามารถเลือกโต๊ะนี้เพื่อทำรายการจองได้ทันที'
            : 'โต๊ะนี้ยังไม่พร้อมสำหรับการจองใหม่ในขณะนี้' }}
        </p>

        <div class="action-row">
          <button v-if="isAdmin" class="btn btn-secondary" @click="navigateTo('/table/' + table.id)">
            ดูรายละเอียด
          </button>
          <button v-if="isAdmin" class="btn btn-ghost" @click="navigateTo('/table/edit/' + table.id)">
            แก้ไข
          </button>
          <button v-if="isAdmin" class="btn btn-danger" @click="deleteTable(table)">
            ลบโต๊ะ
          </button>

          <button
            v-if="!isAdmin && table.status === 'available'"
            class="btn btn-primary"
            @click="bookTable(table.id)"
          >
            จองโต๊ะนี้
          </button>
          <button
            v-if="!isAdmin && table.status !== 'available'"
            class="btn btn-ghost"
            disabled
          >
            โต๊ะไม่ว่าง
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import TablesService from '../../services/TablesService'
import { useAuthenStore } from '../../stores/authen'

export default {
  data() {
    return {
      tables: []
    }
  },
  computed: {
    authenStore() {
      return useAuthenStore()
    },
    isAdmin() {
      return this.authenStore.user && this.authenStore.user.type === 'admin'
    },
    isUserLoggedIn() {
      return this.authenStore.isUserLoggedIn
    },
    availableCount() {
      return this.tables.filter((table) => table.status === 'available').length
    },
    unavailableCount() {
      return this.tables.filter((table) => table.status !== 'available').length
    },
  },
  created() {
    this.refreshData()
  },
  methods: {
    async refreshData() {
      try {
        const response = await TablesService.index()
        this.tables = response.data
      } catch (error) {
        console.log('เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ:', error)
      }
    },
    navigateTo(route) {
      this.$router.push(route)
    },
    async deleteTable(table) {
      const confirmDelete = confirm(`คุณต้องการลบโต๊ะหมายเลข ${table.table_number} ใช่หรือไม่?`)
      if (!confirmDelete) {
        return
      }

      try {
        await TablesService.delete(table)
        await this.refreshData()
      } catch (err) {
        alert(err?.response?.data?.error || 'เกิดข้อผิดพลาดในการลบโต๊ะ')
      }
    },
    bookTable(tableId) {
      if (!this.isUserLoggedIn) {
        alert('กรุณาเข้าสู่ระบบก่อนทำการจองโต๊ะ')
        this.$router.push({ name: 'login' })
        return
      }

      this.$router.push({ name: 'reservation-create', params: { tableId } })
    }
  }
}
</script>

<style scoped>
.table-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.table-card-top h3 {
  margin: 0.2rem 0 0;
}

.table-label {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.86rem;
}

.table-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.table-meta span {
  display: block;
  color: var(--color-muted);
  font-size: 0.88rem;
}

.table-meta strong {
  display: block;
  margin-top: 0.2rem;
  color: var(--color-heading);
}

.table-note {
  margin: 0;
  color: var(--color-muted);
}

@media (max-width: 700px) {
  .table-meta {
    grid-template-columns: 1fr;
  }
}
</style>
