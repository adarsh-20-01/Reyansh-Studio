import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

console.log('\n========================================================')
console.log('🔍 Testing .env Configuration for Reyansh Studio')
console.log('========================================================')

const port = process.env.PORT || 5000
const receiver = process.env.RECEIVER_EMAIL || 'reyaneshstudio@gmail.com'
const service = process.env.EMAIL_SERVICE || 'gmail'
const user = process.env.EMAIL_USER || ''
const pass = process.env.EMAIL_PASS || ''

console.log(`• PORT            : ${port}`)
console.log(`• RECEIVER_EMAIL  : ${receiver}`)
console.log(`• EMAIL_SERVICE   : ${service}`)
console.log(`• EMAIL_USER      : ${user || '(not set)'}`)
console.log(`• EMAIL_PASS      : ${pass ? '●●●●●●●●●●●●●●●● (' + pass.length + ' chars)' : '(not set - using local fallback)'}`)
console.log('--------------------------------------------------------')

async function runTest() {
  if (!user || !pass) {
    console.log('\n⚠️  EMAIL_PASS is currently empty in .env.')
    console.log('👉 To connect your live Gmail account:')
    console.log('   1. Go to https://myaccount.google.com/security')
    console.log('   2. Enable "2-Step Verification" (if not already on)')
    console.log('   3. Go to https://myaccount.google.com/apppasswords')
    console.log('   4. Create an App password (select app: Mail)')
    console.log('   5. Paste the 16-character code into EMAIL_PASS= in .env')
    console.log('\n✨ Note: Your website backend and consultation form are ALREADY fully')
    console.log('   functional even without this password. All leads are automatically saved')
    console.log('   to data/consultations.json and visible in the Admin Portal (/admin).\n')
    return
  }

  console.log('\n📡 Verifying SMTP connection with Gmail...')

  const transporter = nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  })

  try {
    await transporter.verify()
    console.log('✅ SMTP Connection verified successfully! Credentials are valid.\n')

    console.log(`✉️ Sending test verification email to: ${receiver}...`)
    const info = await transporter.sendMail({
      from: `"Reyansh Studio Test" <${user}>`,
      to: receiver,
      subject: '✅ Reyansh Studio — Email Backend Test Successful',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #121316; color: #fff; border-radius: 8px;">
          <h2 style="color: #c9a96e;">Email Configuration Verified!</h2>
          <p>Your Reyansh Studio website backend is successfully connected to your Gmail account.</p>
          <p>Consultation requests submitted by clients will now arrive directly in this inbox.</p>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      `,
    })

    console.log('🎉 Test email sent successfully! Message ID:', info.messageId)
    console.log(`📬 Check inbox at ${receiver} to view the test email.\n`)
  } catch (err) {
    console.error('\n❌ SMTP Verification failed:', err.message)
    if (err.code === 'EAUTH') {
      console.log('\n💡 Tip: Gmail rejected the login. Please ensure you are using a Google "App Password"')
      console.log('   (16 letters without spaces), NOT your normal Gmail login password.')
      console.log('   Generate one here: https://myaccount.google.com/apppasswords\n')
    }
  }
}

runTest()
