require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/blog', require('./routes/blog'))
app.use('/api/news', require('./routes/news'))

// Server Start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})

// Graceful Shutdown for Prisma
// process.on('SIGINT', async () => {
//   await prisma.$disconnect()
//   console.log('Prisma disconnected. Server shutting down.')
//   process.exit(0)
// })

// process.on('SIGTERM', async () => {
//   await prisma.$disconnect()
//   console.log('Prisma disconnected. Server shutting down.')
//   process.exit(0)
// })

// module.exports = prisma // Export Prisma instance if needed in other files
