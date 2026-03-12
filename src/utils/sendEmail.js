const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: 'E—Comma <onboarding@resend.dev>',
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
