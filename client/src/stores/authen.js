import { defineStore } from 'pinia'

export const useAuthenStore = defineStore('authen', {
  state: () => ({
    token: null,
    user: null
  }),
  getters: {
    isUserLoggedIn: (state) => !!state.token
  },
  actions: {
    setToken(token) {
      this.token = token
    },
    setUser(user) {
      this.user = user
    },
    logout() {
      this.token = null
      this.user = null
      // ปลั๊กอินเวอร์ชันใหม่ พอเราเซ็ตค่าเป็น null มันจะไปอัปเดตลบข้อมูลใน localStorage ให้เองอัตโนมัติครับ
    }
  },
  // เปลี่ยนมาใช้แค่คำว่า true สั้นๆ แบบนี้เลยครับ!
  persist: true 
})