const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')

// Generate random 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ─────────────────────────────
// REGISTER — Create new account
// ─────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body

    // 1. Check if email already exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered!'
      })
    }

    // 2. Check if mobile already exists
    const existingMobile = await User.findOne({ mobile })
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number already registered!'
      })
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // 5. Save user (not verified yet!)
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false
    })

    // 6. Send OTP email
    await sendEmail(
      email,
      'Verify Your Account — E—Comma',
      `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: auto; background: #0a0a0a; padding: 0; border-radius: 4px; overflow: hidden;">
        
        <!-- HEADER -->
        <div style="background: #0a0a0a; padding: 40px 48px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <h1 style="color: #f5f0eb; font-size: 28px; letter-spacing: 8px; text-transform: uppercase; margin: 0; font-weight: 700;">E—COMMA</h1>
          <p style="color: rgba(255,255,255,0.3); font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin: 8px 0 0;">Curated Thrift</p>
        </div>

        <!-- BODY -->
        <div style="padding: 48px; background: #111;">
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin: 0 0 16px;">Hello, ${name}</p>
          <h2 style="color: #f5f0eb; font-size: 24px; font-weight: 700; margin: 0 0 24px; line-height: 1.3;">Verify your<br/><em style="color: rgba(255,255,255,0.4);">account</em></h2>
          <p style="color: rgba(255,255,255,0.4); font-size: 13px; line-height: 1.7; margin: 0 0 36px;">Use the verification code below to complete your registration. This code expires in 10 minutes.</p>
          
          <!-- OTP BOX -->
          <div style="background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); padding: 32px; text-align: center; margin-bottom: 36px;">
            <p style="color: rgba(255,255,255,0.25); font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 0 0 16px;">Your verification code</p>
            <h1 style="color: #f5f0eb; font-size: 48px; letter-spacing: 16px; margin: 0; font-weight: 700;">${otp}</h1>
          </div>

          <p style="color: rgba(255,255,255,0.25); font-size: 12px; line-height: 1.6; margin: 0;">If you didn't create an account with E—Comma, you can safely ignore this email.</p>
        </div>

        <!-- FOOTER -->
        <div style="background: #0a0a0a; padding: 28px 48px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
          <p style="color: rgba(255,255,255,0.2); font-size: 11px; letter-spacing: 2px; margin: 0;">© 2024 E—COMMA. All rights reserved.</p>
          <p style="color: rgba(255,255,255,0.15); font-size: 11px; margin: 8px 0 0;">Sustainable fashion delivered to your door.</p>
        </div>

      </div>
      `
    )

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for OTP!',
      email // send back email so frontend knows where OTP was sent
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────
// VERIFY OTP
// ─────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    // 1. Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      })
    }

    // 2. Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account already verified!'
      })
    }

    // 3. Check if OTP is correct
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP!'
      })
    }

    // 4. Check if OTP is expired
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired! Please request a new one!'
      })
    }

    // 5. Verify the account!
    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    // 6. Give them JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Account verified successfully! Welcome! 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────
// RESEND OTP
// ─────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account already verified!'
      })
    }

    // Generate new OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = otp
    user.otpExpiry = otpExpiry
    await user.save()

    // Send new OTP email
    await sendEmail(
      email,
      'New OTP —  E-comma',
      `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: auto; background: #0a0a0a; padding: 0; border-radius: 4px; overflow: hidden;">
        <div style="background: #0a0a0a; padding: 40px 48px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <h1 style="color: #f5f0eb; font-size: 28px; letter-spacing: 8px; text-transform: uppercase; margin: 0; font-weight: 700;">E—COMMA</h1>
          <p style="color: rgba(255,255,255,0.3); font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin: 8px 0 0;">Curated Thrift</p>
        </div>
        <div style="padding: 48px; background: #111;">
          <h2 style="color: #f5f0eb; font-size: 24px; font-weight: 700; margin: 0 0 24px;">New verification<br/><em style="color: rgba(255,255,255,0.4);">code</em></h2>
          <p style="color: rgba(255,255,255,0.4); font-size: 13px; line-height: 1.7; margin: 0 0 36px;">Here is your new OTP code. This code expires in 10 minutes.</p>
          <div style="background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); padding: 32px; text-align: center; margin-bottom: 36px;">
            <p style="color: rgba(255,255,255,0.25); font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 0 0 16px;">Your verification code</p>
            <h1 style="color: #f5f0eb; font-size: 48px; letter-spacing: 16px; margin: 0; font-weight: 700;">${otp}</h1>
          </div>
          <p style="color: rgba(255,255,255,0.25); font-size: 12px; line-height: 1.6; margin: 0;">If you didn't request this code, ignore this email.</p>
        </div>
        <div style="background: #0a0a0a; padding: 28px 48px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
          <p style="color: rgba(255,255,255,0.2); font-size: 11px; letter-spacing: 2px; margin: 0;">© 2024 E—COMMA. All rights reserved.</p>
        </div>
      </div>
      `
      
    )

    res.json({
      success: true,
      message: 'New OTP sent to your email!'
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────
// LOGIN
// ─────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password!'
      })
    }

    // 2. Check if verified
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first!'
      })
    }

    // 3. Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password!'
      })
    }

    // 4. Give JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { register, verifyOTP, resendOTP, login }