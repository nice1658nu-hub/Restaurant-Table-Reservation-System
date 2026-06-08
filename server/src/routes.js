const isAuthenController = require('./controllers/isAuthenController')
const isAdmin = require('./controllers/isAdmin')
const UserController = require('./controllers/UserController')
const UserAuthenController = require('./controllers/UserAuthenController')

// นำเข้า Controller สำหรับระบบจองโต๊ะ
const TableController = require('./controllers/TableController')
const ReservationController = require('./controllers/ReservationController')

module.exports = (app) => {
    // --- ระบบผู้ใช้งาน (User) ---
    app.get('/users', isAuthenController, UserController.index)
    app.post('/user', isAuthenController, UserController.create)
    app.put('/user/:userId', isAuthenController, UserController.put)
    app.delete('/user/:userId', isAuthenController, UserController.remove)
    app.get('/user/:userId', isAuthenController, UserController.show)

    // --- ระบบ Login / สมัครสมาชิก ---
    app.post('/login', UserAuthenController.login)
    app.post('/register', UserAuthenController.register)

    // --- ระบบจัดการโต๊ะอาหาร (Table) ---
    app.get('/tables', TableController.index)
    
    // *** เพิ่มบรรทัดนี้แล้ว (ดึงข้อมูลโต๊ะ 1 ตัว เพื่อใช้ในหน้าจอง) ***
    app.get('/table/:tableId', TableController.show)
    
    app.post('/table', isAuthenController, isAdmin, TableController.create)
    app.put('/table/:tableId', isAuthenController, isAdmin, TableController.put)
    app.delete('/table/:tableId', isAuthenController, isAdmin, TableController.remove)

    // --- ระบบการจอง (Reservation) ---
    app.get('/reservations', isAuthenController, ReservationController.index)
    app.post('/reservation', isAuthenController, ReservationController.create)
    app.put('/reservation/:resId', isAuthenController, ReservationController.put)
    app.delete('/reservation/:resId', isAuthenController, ReservationController.remove)
}
