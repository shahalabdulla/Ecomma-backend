const Product = require('../models/Product')

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found!' })
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body

    // Get uploaded image URLs from Cloudinary
    const imageUrls = req.files ? req.files.map(file => file.path) : []
    const mainImage = imageUrls[0] || ''

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      image: mainImage,
      images: imageUrls
    })

    res.status(201).json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found!' })
    res.json({ success: true, message: 'Product deleted!' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getProducts, getProduct, addProduct, deleteProduct }