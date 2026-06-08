module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
        user_id: DataTypes.INTEGER,     // ID ของลูกค้าที่จอง (ดึงจาก User)
        table_id: DataTypes.INTEGER,    // ID ของโต๊ะที่ถูกจอง (ดึงจาก Table)
        res_date: DataTypes.DATEONLY,   // วันที่จอง เช่น 2024-05-20
        res_time: DataTypes.STRING,     // เวลาที่จอง เช่น 18:30
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'     // สถานะ pending (รอยืนยัน), confirmed (ยืนยันแล้ว), cancelled (ยกเลิก)
        }
    })
    return Reservation
}