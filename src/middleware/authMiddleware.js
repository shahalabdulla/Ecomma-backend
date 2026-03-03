const jwt = require('jsonwebtoken')
const User = require('../models/User')

// 🛡️ Guard 1 — is the user logged in?
const isLoggedIn = async (req, res, next) => {
  try {
    // 1. Check if token exists
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied! Please login first!'
      })
    }

    // 2. Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3. Find the user in database
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found!'
      })
    }

    // 4. Attach user to request
    req.user = user
    next() // ✅ let them through!

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token! Please login again!'
    })
  }
}

// 👑 Guard 2 — is the user an admin?
const isAdmin = (req, res, next) => {
  // isLoggedIn must run first before this!
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied! Admins only!'
    })
  }
  next() // ✅ admin confirmed, let them through!
}

module.exports = { isLoggedIn, isAdmin }