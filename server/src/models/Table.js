module.exports = (sequelize, DataTypes) => {
    const Table = sequelize.define('Table', {
        table_number: DataTypes.STRING, // หมายเลขโต๊ะ เช่น A1, B2
        capacity: DataTypes.INTEGER,    // จำนวนที่นั่ง เช่น 2, 4, 8
        status: {
            type: DataTypes.STRING,
            defaultValue: 'available'   // สถานะ available (ว่าง), unavailable (ไม่ว่าง)
        }
    })
    return Table
}