module.exports = (req, res, next) => {
    // ตรวจสอบว่ามีข้อมูลผู้ใช้ใน req และมี type เป็น admin หรือไม่
    if (req.user && req.user.type === 'admin') {
        next();
    } else {
        // หากไม่ใช่ admin ส่งสถานะ 403 Forbidden กลับไป
        res.status(403).send({ 
            error: 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ เฉพาะผู้ดูแลร้าน (Admin) เท่านั้น' 
        }); //
    }
}