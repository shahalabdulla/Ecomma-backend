const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct
} = require('../controllers/productController')
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware')
const { upload } = require('../utils/cloudinary')

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', isLoggedIn, isAdmin, upload.array('images', 5), addProduct)
router.delete('/:id', isLoggedIn, isAdmin, deleteProduct)

module.exports = router