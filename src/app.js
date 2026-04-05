if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const connectDB = require('./config/db')
require('./config/redis')

const subscriptionRoutes = require('./routes/subscriptions')
const eventRoutes = require('./routes/events')
const errorHandler = require('./middleware/errorHandler')
const { startAllListeners } = require('./listeners/listenerManager')

require('./workers/webhookWorker')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'ChainWatch API is running' })
})

app.use('/subscriptions', subscriptionRoutes)
app.use('/events', eventRoutes)

app.use(errorHandler)

const start = async () => {
  await connectDB()

  // start blockchain listeners after DB is connected
  await startAllListeners()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()