const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

// 🛒 Place order from cart
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body

    // 1. Get customer's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')

    // 2. Check cart is not empty
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty!'
      })
    }

    // 3. Build order items and calculate total
    let totalPrice = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = item.product

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}!`
        })
      }

      // Add to order items
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      })

      // Add to total
      totalPrice += product.price * item.quantity

      // Reduce stock
      product.stock -= item.quantity
      await product.save()
    }

    // 4. Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice
    })

    // 5. Clear the cart after order placed
    await Cart.findOneAndDelete({ user: req.user._id })

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 📦 Get my orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 }) // newest first

    res.json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 🔍 Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price image')
      .populate('user', 'name email')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found!'
      })
    }

    // Customer can only see their own orders
    if (order.user._id.toString() !== req.user._id.toString()
        && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied!'
      })
    }

    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 👑 Admin — get ALL orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    res.json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 👑 Admin — update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found!'
      })
    }

    res.json({
      success: true,
      message: 'Order status updated!',
      order
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
}