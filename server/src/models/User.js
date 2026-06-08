const bcrypt = require('bcryptjs')

// ฟังก์ชันสำหรับเข้ารหัสผ่านก่อนบันทึกลงฐานข้อมูล
async function hashPassword(user) {
    if (!user.changed('password')) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    user.setDataValue('password', hash)
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,       // ชื่อ (ตรงกับหน้าเว็บ)
        lastname: DataTypes.STRING,   // นามสกุล (ตรงกับหน้าเว็บ)
        email: {
            type: DataTypes.STRING,   // อีเมล (ตรงกับหน้าเว็บ)
            unique: true              // บังคับว่าอีเมลห้ามซ้ำกัน
        },
        password: DataTypes.STRING,   // รหัสผ่าน (ตรงกับหน้าเว็บ)
        status: DataTypes.STRING,     // สถานะ (ตรงกับหน้าเว็บ)
        type: DataTypes.STRING        // ประเภท user/admin (ตรงกับหน้าเว็บ)
    }, {
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword
        }
    })

    // ฟังก์ชันสำหรับเทียบรหัสผ่านตอน Login (Controller ของคุณเรียกใช้ตัวนี้อยู่)
    User.prototype.comparePassword = async function (password) {
        return await bcrypt.compare(password, this.password)
    }

    return User
}