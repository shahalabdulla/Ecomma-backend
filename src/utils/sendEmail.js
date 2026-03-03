const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, html) => {
  try {
    // Create email sender
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    // Send the email
    await transporter.sendMail({
      from: `"My Shop" <${process.env.EMAIL}>`,
      to,
      subject,
      html
    })

    console.log(`✅ Email sent to ${to}`)
    return true

  } catch (error) {
    console.log('❌ Email error:', error)
    return false
  }
}

module.exports = sendEmail