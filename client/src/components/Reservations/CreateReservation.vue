<template>
  <section class="panel-card reservation-layout">
    <div class="section-header">
      <p class="eyebrow">Book Table</p>
      <h1>จองโต๊ะอาหารล่วงหน้า</h1>
    </div>

    <div v-if="table" class="reservation-summary">
      <article>
        <span>โต๊ะหมายเลข</span>
        <strong>{{ table.table_number }}</strong>
      </article>
      <article>
        <span>จำนวนที่นั่ง</span>
        <strong>{{ table.capacity }} ที่นั่ง</strong>
      </article>
      <article>
        <span>สถานะ</span>
        <strong>{{ table.status === 'available' ? 'พร้อมจอง' : 'ไม่ว่าง' }}</strong>
      </article>
    </div>

    <form @submit.prevent="submitReservation" class="form-grid">
      <label class="field">
        <span>วันที่จอง</span>
        <input type="date" v-model="reservation.res_date" :min="today" required />
      </label>

      <label class="field">
        <span>เวลาที่จอง</span>
        <input type="time" v-model="reservation.res_time" required />
      </label>

      <div class="action-row">
        <button type="submit" class="btn btn-primary">ยืนยันการจองโต๊ะ</button>
        <button type="button" class="btn btn-secondary" @click="goBack">กลับ</button>
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>
    </form>
  </section>
</template>

<script>
import TablesService from '../../services/TablesService'
import ReservationsService from '../../services/ReservationsService'

export default {
  data() {
    return {
      table: null,
      reservation: {
        res_date: '',
        res_time: ''
      },
      error: null,
      today: new Date().toISOString().split('T')[0]
    }
  },
  async created() {
    try {
      let tableId = this.$route.params.tableId
      this.table = (await TablesService.show(tableId)).data

      if (this.table.status !== 'available') {
        alert('ขออภัย โต๊ะนี้ถูกจองไปแล้ว')
        this.$router.push('/tables')
      }
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    async submitReservation() {
      try {
        const reservationData = {
          table_id: this.table.id,
          res_date: this.reservation.res_date,
          res_time: this.reservation.res_time
        }

        await ReservationsService.post(reservationData)

        alert('จองโต๊ะสำเร็จเรียบร้อยแล้ว!')
        this.$router.push('/reservations')
      } catch (error) {
        this.error = error?.response?.data?.error || 'เกิดข้อผิดพลาดในการจองโต๊ะ'
      }
    },
    goBack() {
      this.$router.push('/tables')
    }
  }
}
</script>

<style scoped>
.reservation-layout {
  max-width: 46rem;
  margin: 0 auto;
}

.reservation-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.reservation-summary article {
  padding: 1rem;
  border-radius: 18px;
  background: rgba(255, 248, 232, 0.05);
  border: 1px solid rgba(255, 248, 232, 0.08);
}

.reservation-summary span {
  display: block;
  color: var(--color-muted);
  font-size: 0.88rem;
}

.reservation-summary strong {
  display: block;
  margin-top: 0.35rem;
  color: var(--color-heading);
}

@media (max-width: 700px) {
  .reservation-summary {
    grid-template-columns: 1fr;
  }
}
</style>
