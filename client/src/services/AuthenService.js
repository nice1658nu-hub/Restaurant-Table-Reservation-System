import Api from './Api'

export default {
    // ฟังก์ชันสมัครสมาชิก (แนบ credentials ไปให้ Server ด้วย)
    register (credentials) {
        return Api().post('register', credentials)
    },
    
    // ฟังก์ชันเข้าสู่ระบบ
    login (credentials) {
        return Api().post('login', credentials)
    }
}