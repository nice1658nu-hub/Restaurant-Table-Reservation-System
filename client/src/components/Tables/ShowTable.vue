<template>
  <section class="panel-card detail-card" v-if="table">
    <div class="section-header">
      <p class="eyebrow">Table Detail</p>
      <h1>รายละเอียดโต๊ะ {{ table.table_number }}</h1>
      <p>ตรวจสอบข้อมูลโต๊ะและจัดการสถานะการใช้งานของโต๊ะนี้ได้จากหน้านี้</p>
    </div>

    <div class="detail-grid">
      <article>
        <span>รหัสโต๊ะ</span>
        <strong>#{{ table.id }}</strong>
      </article>
      <article>
        <span>หมายเลขโต๊ะ</span>
        <strong>{{ table.table_number }}</strong>
      </article>
      <article>
        <span>จำนวนที่นั่ง</span>
        <strong>{{ table.capacity }} ที่นั่ง</strong>
      </article>
      <article>
        <span>สถานะล่าสุด</span>
        <strong>{{ table.status === 'available' ? 'ว่างพร้อมจอง' : 'ไม่ว่าง' }}</strong>
      </article>
    </div>

    <div class="action-row">
      <button class="btn btn-primary" @click="navigateTo('/table/edit/' + table.id)">แก้ไขข้อมูลโต๊ะ</button>
      <button class="btn btn-secondary" @click="navigateTo('/tables')">กลับไปหน้าตารางโต๊ะ</button>
    </div>
  </section>
</template>

<script>
import TablesService from '../../services/TablesService'

export default {
    data() {
        return {
            table: null
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
        navigateTo(route) {
            this.$router.push(route)
        }
    }
}
</script>

<style scoped>
.detail-card {
  max-width: 52rem;
  margin: 0 auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.detail-grid article {
  padding: 1rem;
  border-radius: 18px;
  background: rgba(255, 248, 232, 0.04);
  border: 1px solid rgba(255, 248, 232, 0.07);
}

.detail-grid span {
  display: block;
  color: var(--color-muted);
  font-size: 0.86rem;
}

.detail-grid strong {
  display: block;
  margin-top: 0.35rem;
  color: var(--color-heading);
  font-size: 1.15rem;
}

@media (max-width: 700px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
