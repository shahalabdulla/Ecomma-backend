const express = require('express')
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController')
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware')

// 🔐 Customer routes
router.post('/', isLoggedIn, createOrder)
router.get('/myorders', isLoggedIn, getMyOrders)
router.get('/:id', isLoggedIn, getOrderById)

// 👑 Admin routes
router.get('/', isLoggedIn, isAdmin, getAllOrders)
router.put('/:id/status', isLoggedIn, isAdmin, updateOrderStatus)

module.exports = router
