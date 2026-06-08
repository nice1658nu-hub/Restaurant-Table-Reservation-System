const { Reservation, Table, User } = require('../models')

async function markTableAvailability(tableId, status) {
    const table = await Table.findByPk(tableId)
    if (table) {
        await table.update({ status })
    }
}

module.exports = {
    async index(req, res) {
        try {
            const where = req.user.type === 'admin'
                ? {}
                : { user_id: req.user.id }

            const reservations = await Reservation.findAll({
                where,
                include: [
                    {
                        model: Table,
                        as: 'table',
                        attributes: ['id', 'table_number', 'capacity', 'status']
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'lastname', 'email', 'type']
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            res.send(reservations)
        } catch (err) {
            res.status(500).send({ error: 'ไม่สามารถดึงข้อมูลการจองได้' })
        }
    },

    async create(req, res) {
        try {
            const body = req.body || {}
            const tableId = Number(body.table_id)
            const { res_date, res_time } = body

            if (!tableId || !res_date || !res_time) {
                return res.status(400).send({ error: 'กรุณาระบุโต๊ะ วันที่ และเวลาจองให้ครบถ้วน' })
            }

            const table = await Table.findByPk(tableId)
            if (!table) {
                return res.status(404).send({ error: 'ไม่พบโต๊ะที่ต้องการจอง' })
            }
            if (table.status !== 'available') {
                return res.status(400).send({ error: 'โต๊ะนี้ไม่ว่างแล้ว กรุณาเลือกโต๊ะอื่น' })
            }

            const reservation = await Reservation.create({
                user_id: req.user.id,
                table_id: tableId,
                res_date,
                res_time,
                status: 'confirmed'
            })

            await markTableAvailability(tableId, 'unavailable')
            res.send(reservation.toJSON())
        } catch (err) {
            res.status(500).send({ error: 'สร้างการจองไม่สำเร็จ' })
        }
    },

    async put(req, res) {
        try {
            const body = req.body || {}
            const reservation = await Reservation.findByPk(req.params.resId)
            if (!reservation) {
                return res.status(404).send({ error: 'ไม่พบรายการจองนี้ในระบบ' })
            }

            const isOwner = reservation.user_id === req.user.id
            const isAdmin = req.user.type === 'admin'
            if (!isOwner && !isAdmin) {
                return res.status(403).send({ error: 'คุณไม่มีสิทธิ์แก้ไขรายการจองนี้' })
            }

            const nextStatus = body.status || reservation.status
            const allowedStatuses = ['confirmed', 'cancelled']
            if (!allowedStatuses.includes(nextStatus)) {
                return res.status(400).send({ error: 'สถานะการจองไม่ถูกต้อง' })
            }

            await reservation.update({
                res_date: body.res_date || reservation.res_date,
                res_time: body.res_time || reservation.res_time,
                status: nextStatus
            })

            if (nextStatus === 'cancelled') {
                await markTableAvailability(reservation.table_id, 'available')
            }

            res.send(reservation)
        } catch (err) {
            res.status(500).send({ error: 'แก้ไขการจองไม่สำเร็จ' })
        }
    },

    async remove(req, res) {
        try {
            const reservation = await Reservation.findOne({ where: { id: req.params.resId } })
            if (!reservation) {
                return res.status(404).send({ error: 'ไม่มีข้อมูลการจองนี้ในระบบ' })
            }

            const isOwner = reservation.user_id === req.user.id
            const isAdmin = req.user.type === 'admin'
            if (!isOwner && !isAdmin) {
                return res.status(403).send({ error: 'คุณไม่มีสิทธิ์ยกเลิกรายการจองนี้' })
            }

            await reservation.update({ status: 'cancelled' })
            await markTableAvailability(reservation.table_id, 'available')
            res.send(reservation)
        } catch (err) {
            res.status(500).send({ error: 'ลบข้อมูลการจองไม่สำเร็จ' })
        }
    }
}
