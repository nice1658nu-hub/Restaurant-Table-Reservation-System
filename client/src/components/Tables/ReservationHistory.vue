<template>
    <div>
        <h2>จัดการโต๊ะอาหาร (Table Management)</h2>
        <p><button v-on:click="logout">ออกจากระบบ (Logout)</button></p>
        <h4>จำนวนโต๊ะทั้งหมด: {{ tables.length }} โต๊ะ</h4>

        <p>
            <button v-on:click="navigateTo('/table/create')">เพิ่มโต๊ะใหม่</button>
        </p>
        <hr>
        
        <div v-if="tables.length === 0">
            <p>ยังไม่มีข้อมูลโต๊ะในระบบ ลองกดเพิ่มโต๊ะใหม่ดูสิ!</p>
        </div>

        <div v-for="table in tables" v-bind:key="table.id" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
            <p><strong>หมายเลขโต๊ะ:</strong> {{ table.table_number }}</p>
            <p><strong>จำนวนที่นั่ง:</strong> {{ table.capacity }} ที่นั่ง</p>
            <p><strong>สถานะ:</strong> {{ table.status === 'available' ? 'ว่าง' : 'ไม่ว่าง' }}</p>
            <p>
                <button v-if="table.status === 'available'" v-on:click="navigateTo('/reservation/create/' + table.id)">
                    จองโต๊ะนี้
                </button>
                
                <button v-on:click="navigateTo('/table/edit/' + table.id)">แก้ไข</button>
                <button v-on:click="deleteTable(table)">ลบข้อมูล</button>
            </p>
        </div>
    </div>
</template>

<script>
import TablesService from '../../services/TablesService'
import { useAuthenStore } from '../../stores/authen'

export default {
    data() {
        return { tables: [] }
    },
    computed: {
        userType() {
            const authenStore = useAuthenStore()
            return authenStore.user ? authenStore.user.type : null
        }
    },
    async created() {
        this.refreshData()
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route)
        },
        async deleteTable(table) {
            let result = confirm("คุณต้องการลบโต๊ะ " + table.table_number + " ใช่หรือไม่?")
            if (result) {
                try {
                    await TablesService.delete(table)
                    this.refreshData()
                } catch (err) {
                    console.log(err)
                }
            }
        },
        async refreshData() {
            try {
                this.tables = (await TablesService.index()).data
            } catch (err) {
                console.log(err)
            }
        },
        logout() {
            const authenStore = useAuthenStore()
            authenStore.logout()
            this.$router.push({ name: 'login' })
        }
    }
}
</script>