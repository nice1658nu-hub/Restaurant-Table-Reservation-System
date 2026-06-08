module.exports = {
  upload (req, res) {
    // Controller ทำหน้าที่แค่ส่ง response เพราะ Middleware จัดการไฟล์เสร็จแล้ว
    if (!req.file) {
        return res.status(400).send({
          error: 'No file uploaded or invalid file type.' 
        })
    }

    // ส่งชื่อไฟล์กลับไปให้ Client เพื่อบันทึกลง DB ต่อไป
    res.json({
      filename: req.file.filename
    })
  }
}