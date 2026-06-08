const { Op } = require('sequelize')
const { Table, Reservation } = require('../models')

function normalizeTablePayload(body = {}) {
    return {
        table_number: String(body.table_number || '').trim().toUpperCase(),
        capacity: Number(body.capacity),
        status: body.status === 'unavailable' ? 'unavailable' : 'available'
    }
}

module.exports = {
    async index(req, res) {
        try {
            const tables = await Table.findAll({
                order: [
                    ['status', 'ASC'],
                    ['table_number', 'ASC']
                ]
            })
            res.send(tables)
        } catch (err) {
            res.status(500).send({ error: 'ไม่สามารถดึงข้อมูลโต๊ะได้' })
        }
    },
    async create(req, res) {
        try {
            const payload = normalizeTablePayload(req.body)
            if (!payload.table_number || !Number.isInteger(payload.capacity) || payload.capacity <= 0) {
                return res.status(400).send({ error: 'กรุณากรอกหมายเลขโต๊ะและจำนวนที่นั่งให้ถูกต้อง' })
            }

            const existingTable = await Table.findOne({
                where: { table_number: payload.table_number }
            })
            if (existingTable) {
                return res.status(400).send({ error: 'หมายเลขโต๊ะนี้มีอยู่แล้วในระบบ' })
            }

            const table = await Table.create(payload)
            res.send(table.toJSON())
        } catch (err) {
            res.status(500).send({ error: 'สร้างโต๊ะไม่สำเร็จ' })
        }
    },
    async put(req, res) {
        try {
            const table = await Table.findByPk(req.params.tableId)
            if (!table) {
                return res.status(404).send({ error: 'ไม่พบโต๊ะที่ต้องการแก้ไข' })
            }

            const payload = normalizeTablePayload(req.body)
            if (!payload.table_number || !Number.isInteger(payload.capacity) || payload.capacity <= 0) {
                return res.status(400).send({ error: 'กรุณากรอกหมายเลขโต๊ะและจำนวนที่นั่งให้ถูกต้อง' })
            }

            const duplicatedTable = await Table.findOne({
                where: {
                    table_number: payload.table_number,
                    id: { [Op.ne]: table.id }
                }
            })
            if (duplicatedTable) {
                return res.status(400).send({ error: 'หมายเลขโต๊ะนี้มีอยู่แล้วในระบบ' })
            }

            await table.update(payload)
            res.send(table)
        } catch (err) {
            res.status(500).send({ error: 'แก้ไขข้อมูลโต๊ะไม่สำเร็จ' })
        }
    },
    async remove(req, res) {
        try {
            const table = await Table.findOne({ where: { id: req.params.tableId } })
            if (!table) {
                return res.status(404).send({ error: 'ไม่มีโต๊ะนี้ในระบบ' })
            }

            const activeReservation = await Reservation.findOne({
                where: {
                    table_id: table.id,
                    status: { [Op.not]: 'cancelled' }
                }
            })
            if (activeReservation) {
                return res.status(400).send({
                    error: 'ไม่สามารถลบโต๊ะที่มีรายการจองค้างอยู่ได้'
                })
            }

            await table.destroy()
            res.send(table)
        } catch (err) {
            res.status(500).send({ error: 'ลบโต๊ะไม่สำเร็จ' })
        }
    },
    async show(req, res) {
        try {
            const table = await Table.findByPk(req.params.tableId)
            if (!table) {
                return res.status(404).send({ error: 'ไม่พบข้อมูลโต๊ะนี้' })
            }
            res.send(table)
        } catch (err) {
            res.status(500).send({ error: 'ไม่พบข้อมูลโต๊ะนี้' })
        }
    }
}
