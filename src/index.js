const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')

dotenv.config()

const app = express()

// Allow frontend to talk to backend!
app.use(cors({
  origin: 'http://localhost:3000'
}))

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.get('/', (req, res) => {
  res.json({ message: '🛒 My Shop API is running!' })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((error) => console.log('❌ MongoDB connection failed:', error))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})