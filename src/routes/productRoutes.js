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
router.post('/', isLoggedIn, isAdmin, (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.log('Upload error:', err.message, err.stack)
      return res.status(500).json({ success: false, message: 'Image upload failed: ' + err.message })
    }
    next()
  })
}, addProduct)
router.delete('/:id', isLoggedIn, isAdmin, deleteProduct)

module.exports = router