<template>
  <section class="stack-lg">
    <div class="hero-banner">
      <div>
        <p class="eyebrow">Reservation Dashboard</p>
        <h1>{{ isAdmin ? 'รายการจองทั้งหมดของร้าน' : 'ประวัติการจองของฉัน' }}</h1>
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <span>ทั้งหมด</span>
          <strong>{{ reservations.length }}</strong>
        </article>
        <article class="summary-card">
          <span>กำลังใช้งาน</span>
          <strong>{{ activeCount }}</strong>
        </article>
        <article class="summary-card">
          <span>ยกเลิกแล้ว</span>
          <strong>{{ cancelledCount }}</strong>
        </article>
      </div>
    </div>

    <div v-if="reservations.length === 0" class="panel-card empty-state">
      <h3>ยังไม่มีรายการจอง</h3>
      <p>{{ isAdmin ? 'เมื่อมีลูกค้าจองโต๊ะ รายการจะปรากฏที่หน้านี้' : 'เริ่มเลือกโต๊ะจากหน้ารายการโต๊ะเพื่อทำการจองครั้งแรกของคุณ' }}</p>
    </div>

    <div v-else class="grid-list cards-2">
      <article v-for="res in reservations" :key="res.id" class="panel-card reservation-card">
        <div class="reservation-top">
          <div>
            <p class="reservation-label">รหัสการจอง</p>
            <h3>#{{ res.id }}</h3>
          </div>
          <span class="status-badge" :class="res.status === 'cancelled' ? 'cancelled' : 'confirmed'">
            {{ statusText(res.status) }}
          </span>
        </div>

        <div class="reservation-meta">
          <div>
            <span>โต๊ะ</span>
            <strong>{{ res.table?.table_number || res.table_id }}</strong>
          </div>
          <div>
            <span>จำนวนที่นั่ง</span>
            <strong>{{ res.table?.capacity || '-' }}</strong>
          </div>
          <div>
            <span>วันที่จอง</span>
            <strong>{{ res.res_date }}</strong>
          </div>
          <div>
            <span>เวลาที่จอง</span>
            <strong>{{ res.res_time }}</strong>
          </div>
          <div v-if="isAdmin">
            <span>ลูกค้า</span>
            <strong>{{ customerName(res) }}</strong>
          </div>
          <div v-if="isAdmin">
            <span>อีเมล</span>
            <strong>{{ res.user?.email || '-' }}</strong>
          </div>
        </div>

        <div class="action-row">
          <button
            v-if="res.status !== 'cancelled'"
            class="btn btn-danger"
            @click="cancelReservation(res)"
          >
            ยกเลิกการจอง
          </button>
        </div>
      </article>
    </div>

    <div class="action-row center">
      <button class="btn btn-secondary" @click="goBack">ย้อนกลับไปหน้าหลัก</button>
    </div>
  </section>
</template>

<script>
import ReservationsService from '../../services/ReservationsService'
import { useAuthenStore } from '../../stores/authen'

export default {
  data() {
    return {
      reservations: []
    }
  },
  async created() {
    this.refreshData()
  },
  computed: {
    isAdmin() {
      const authenStore = useAuthenStore()
      return authenStore.user?.type === 'admin'
    },
    activeCount() {
      return this.reservations.filter((reservation) => reservation.status !== 'cancelled').length
    },
    cancelledCount() {
      return this.reservations.filter((reservation) => reservation.status === 'cancelled').length
    }
  },
  methods: {
    goBack() {
      this.$router.push('/tables')
    },

    async refreshData() {
      try {
        const authenStore = useAuthenStore()
        if (!authenStore.isUserLoggedIn) {
          this.$router.push('/login')
          return
        }

        this.reservations = (await ReservationsService.index()).data
      } catch (error) {
        console.log(error)
      }
    },

    customerName(reservation) {
      if (!reservation.user) {
        return '-'
      }
      return [reservation.user.name, reservation.user.lastname].filter(Boolean).join(' ')
    },

    statusText(status) {
      if (status === 'cancelled') {
        return 'ยกเลิกแล้ว'
      }
      return 'ยืนยันแล้ว'
    },
    
    async cancelReservation(reservation) {
      let confirmCancel = confirm('คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?')
      if (confirmCancel) {
        try {
          await ReservationsService.delete(reservation.id)

          alert('ยกเลิกการจองเรียบร้อยแล้ว!')
          this.refreshData()

        } catch (error) {
          alert(error?.response?.data?.error || 'เกิดข้อผิดพลาดในการยกเลิก')
        }
      }
    }
  }
}
</script>

<style scoped>
.reservation-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.reservation-label {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.86rem;
}

.reservation-top h3 {
  margin: 0.25rem 0 0;
}

.reservation-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.reservation-meta span {
  display: block;
  color: var(--color-muted);
  font-size: 0.88rem;
}

.reservation-meta strong {
  display: block;
  margin-top: 0.25rem;
  color: var(--color-heading);
}

@media (max-width: 700px) {
  .reservation-meta {
    grid-template-columns: 1fr;
  }
}
</style>
