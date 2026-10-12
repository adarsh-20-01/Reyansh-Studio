import dotenv from 'dotenv'
import { Resend } from 'resend'

dotenv.config()

console.log('\n========================================================')
console.log('🔍 Testing Resend HTTPS Configuration for Reyansh Studio')
console.log('========================================================')

const apiKey = (process.env.RESEND_API_KEY || '').trim()
const receiver = (process.env.RECEIVER_EMAIL || 'reyaneshstudio@gmail.com').trim()
const sender = (process.env.VERIFIED_SENDER_EMAIL || 'onboarding@resend.dev').trim()

console.log(`• Destination (RECEIVER_EMAIL) : ${receiver}`)
console.log(`• Sender (VERIFIED_SENDER_EMAIL) : ${sender}`)
console.log(`• RESEND_API_KEY                : ${apiKey ? apiKey.slice(0, 7) + '...' + apiKey.slice(-4) : '(not configured yet)'}`)
console.log('--------------------------------------------------------')

if (!apiKey) {
  console.log('\nℹ️  RESEND_API_KEY is not set in .env yet.')
  console.log('👉 Quick 2-Minute Setup for Render:')
  console.log('   1. Sign up for free at https://resend.com')
  console.log('   2. Create an API Key at https://resend.com/api-keys')
  console.log('   3. Add RESEND_API_KEY in your Render Dashboard (Environment tab)')
  console.log('   4. (Optional) Set VERIFIED_SENDER_EMAIL to onboarding@resend.dev (or your verified domain)\n')
  console.log('✨ Note: The backend saves all customer leads safely to database even before an API key is set.\n')
  process.exit(0)
}

async function run() {
  console.log('\n📡 Sending test email via Resend HTTPS API (Port 443)...')

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: `Reyansh Studio Test <${sender}>`,
      to: [receiver],
      subject: '✅ Reyansh Studio — Resend HTTPS Email Test Successful',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #121316; color: #fff; border-radius: 8px;">
          <h2 style="color: #c9a86a;">Resend HTTPS Email Configured!</h2>
          <p>Your Reyansh Studio website backend is now sending emails via Resend HTTPS API.</p>
          <p>This works seamlessly on Render Free web services because it uses standard HTTPS port 443 instead of blocked SMTP ports.</p>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">Sent at: ${new Date().toISOString()}</p>
        </div>
      `,
    })

    if (error) {
      console.error('\n❌ Resend API Error:', error.message)
      console.log('💡 Tip:', error.name)
      return
    }

    console.log(`\n🎉 Test email accepted successfully by Resend! Message ID: ${data?.id}`)
    console.log(`📬 Check your inbox at ${receiver} to confirm delivery.\n`)
  } catch (err) {
    console.error('\n❌ Request error:', err.message)
  }
}

run()
