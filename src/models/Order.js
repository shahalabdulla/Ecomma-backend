const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  // Who placed the order?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // What did they order?
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],

  // Where to deliver?
  shippingAddress: {

    houseName:   { type: String, required: true },
    apartmentNo:{type: String, required: false },
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    postNo:     { type: String, required: true },
    country: { type: String, required: true }
  },

  // How much total?
  totalPrice: {
    type: Number,
    required: true
  },

  // Payment info
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'online'
  },

  // Delivery status
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }

}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)