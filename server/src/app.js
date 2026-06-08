const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

const { sequelize, User } = require('./models') 
const config = require('./config/config')

async function ensureDefaultAdmin() {
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@restaurant.local'
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin1234'

    const adminCount = await User.count({
        where: { type: 'admin' }
    })

    if (adminCount === 0) {
        await User.create({
            name: 'Restaurant',
            lastname: 'Admin',
            email: defaultAdminEmail,
            password: defaultAdminPassword,
            status: 'active',
            type: 'admin'
        })
        console.log(`Default admin created: ${defaultAdminEmail}`)
    }
}

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, '../public')))

// เรียกใช้ Routes
require('./userPassport') 
require('./routes')(app)

sequelize.sync({ alter: true }).then(() => {
    return ensureDefaultAdmin()
}).then(() => {
    app.listen(config.port, function () {
        console.log('Server started on port ' + config.port)
    })
}).catch((err) => {
    console.error('Unable to connect to the database:', err)
})
