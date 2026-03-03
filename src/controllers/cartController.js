const Cart = require('../models/Cart')
const Product = require('../models/Product')

// 👀 View my cart
const getCart = async (req, res) => {
  try {
    // Find cart and fill in product details
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image stock')

    // If no cart yet — return empty cart
    if (!cart) {
      return res.json({
        success: true,
        cart: { items: [], totalPrice: 0 }
      })
    }

    // Calculate total price
    let totalPrice = 0
    for (const item of cart.items) {
      totalPrice += item.product.price * item.quantity
    }

    res.json({
      success: true,
      cart: {
        items: cart.items,
        totalPrice
      }
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ➕ Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    // 1. Check product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found!'
      })
    }

    // 2. Check enough stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items left in stock!`
      })
    }

    // 3. Find or create cart
    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      // Create new cart for user
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      })
    } else {
      // Cart exists — check if product already in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      )

      if (existingItem) {
        // Product already in cart — increase quantity
        existingItem.quantity += quantity
      } else {
        // New product — add to cart
        cart.items.push({ product: productId, quantity })
      }

      await cart.save()
    }

    // Return updated cart with product details
    cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image')

    // Calculate total
    let totalPrice = 0
    for (const item of cart.items) {
      totalPrice += item.product.price * item.quantity
    }

    res.json({
      success: true,
      message: `${product.name} added to cart!`,
      cart: { items: cart.items, totalPrice }
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 🔄 Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    const productId = req.params.productId

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found!'
      })
    }

    // Find the item in cart
    const item = cart.items.find(
      item => item.product.toString() === productId
    )

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart!'
      })
    }

    // Update quantity
    item.quantity = quantity
    await cart.save()

    res.json({
      success: true,
      message: 'Cart updated!',
      cart
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ❌ Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found!'
      })
    }

    // Remove the item
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    )

    await cart.save()

    res.json({
      success: true,
      message: 'Item removed from cart!',
      cart
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 🗑️ Clear entire cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id })

    res.json({
      success: true,
      message: 'Cart cleared!'
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
}
