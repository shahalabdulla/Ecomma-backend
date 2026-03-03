const express = require('express')
const router = express.Router()
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController')
const { isLoggedIn } = require('../middleware/authMiddleware')

// All cart routes require login!
router.get('/', isLoggedIn, getCart)
router.post('/', isLoggedIn, addToCart)
router.put('/:productId', isLoggedIn, updateCartItem)
router.delete('/:productId', isLoggedIn, removeFromCart)
router.delete('/', isLoggedIn, clearCart)

module.exports = router