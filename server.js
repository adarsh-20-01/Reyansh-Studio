import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Data directory and file paths
const DATA_DIR = path.join(__dirname, 'data')
const CONSULTATIONS_FILE = path.join(DATA_DIR, 'consultations.json')

// Ensure data directory and consultations file exist
const initStorage = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(CONSULTATIONS_FILE)) {
      const initialSeed = [
        {
          id: 'lead_seed_01',
          name: 'Pooja Sharma',
          email: 'pooja.sharma@example.com',
          phone: '+91 98201 44521',
          service: 'Home Interior',
          message: 'Looking for 3BHK turnkey interior design with modern luxury finishes and custom sofa set in Mumbai.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          formattedDate: 'Recent Inquiry',
          status: 'contacted',
          emailSent: true,
        },
        {
          id: 'lead_seed_02',
          name: 'Vikram Mehta',
          email: 'vikram.mehta@example.com',
          phone: '+91 98920 11234',
          service: 'Custom Sofa',
          message: 'Inquiring about handcrafted L-shaped velvet sofa with brass accents for our living room.',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          formattedDate: 'Today',
          status: 'new',
          emailSent: true,
        },
      ]
      fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8')
      console.log('📁 Initialized consultations database at:', CONSULTATIONS_FILE)
    }
  } catch (err) {
    console.error('Failed to initialize storage:', err)
  }
}

initStorage()

// Helper to read consultations
const getConsultations = () => {
  try {
    if (!fs.existsSync(CONSULTATIONS_FILE)) return []
    const content = fs.readFileSync(CONSULTATIONS_FILE, 'utf-8')
    return JSON.parse(content || '[]')
  } catch (err) {
    console.error('Error reading consultations file:', err)
    return []
  }
}

// Helper to save consultations
const saveConsultations = (list) => {
  try {
    fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify(list, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Error writing consultations file:', err)
    return false
  }
}

// Middleware
app.use(cors())
app.use(express.json())

// Admin Authentication Endpoints
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {}
  const adminEmail = (process.env.ADMIN_EMAIL || 'reyaneshstudio@gmail.com').trim().toLowerCase()
  const adminPassword = (process.env.ADMIN_PASSWORD || 'reyansh@2026').trim()

  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPassword = (password || '').trim()

  const allowedEmails = [adminEmail, 'admin@reyanshstudio.com', 'admin@reyansh.com']

  if (allowedEmails.includes(cleanEmail) && cleanPassword === adminPassword) {
    const token = `adm_token_${Date.now()}_${Buffer.from(cleanEmail).toString('base64')}`
    return res.json({
      success: true,
      message: 'Authentication successful. Welcome to Reyansh Studio Admin Portal.',
      token,
      user: {
        email: adminEmail,
        role: 'admin',
        name: 'Reyansh Studio Administrator',
        authenticatedAt: new Date().toISOString(),
      },
    })
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid email address or password. Access denied.',
  })
})

app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization || ''
  const token = req.query.token || (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '')

  const adminEmail = (process.env.ADMIN_EMAIL || 'reyaneshstudio@gmail.com').trim().toLowerCase()
  if (token && token.includes('adm_token_')) {
    return res.json({
      success: true,
      valid: true,
      user: {
        email: adminEmail,
        role: 'admin',
      },
    })
  }

  return res.status(401).json({ success: false, valid: false, message: 'Invalid or expired session token' })
})


// Health check endpoint
app.get('/api/health', (req, res) => {
  const consultations = getConsultations()
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'Reyansh Studio Backend & Consultation Engine',
    emailConfigured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    receiver: process.env.RECEIVER_EMAIL || 'reyaneshstudio@gmail.com',
    totalConsultations: consultations.length,
    newLeadsCount: consultations.filter(c => c.status === 'new').length,
  })
})

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const list = getConsultations()
  const stats = {
    total: list.length,
    new: list.filter(c => c.status === 'new').length,
    contacted: list.filter(c => c.status === 'contacted').length,
    completed: list.filter(c => c.status === 'completed').length,
  }
  res.json({ success: true, stats })
})

// GET all consultations / leads
app.get('/api/consultations', (req, res) => {
  const { status } = req.query
  let list = getConsultations()
  if (status && status !== 'all') {
    list = list.filter(c => c.status === status)
  }
  // Sort latest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  res.json({
    success: true,
    count: list.length,
    consultations: list,
  })
})

// Helper to create Nodemailer transporter
const createTransporter = async () => {
  const user = process.env.SMTP_USERNAME || process.env.EMAIL_USER
  const pass = (process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || '').replace(/\s+/g, '')
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST

  // 1. Explicit SMTP host
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: { user, pass },
    })
  }

  // 2. Well-known service (e.g. Gmail)
  if (user && pass) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: { user, pass },
    })
  }

  // 3. Fallback to Ethereal test inbox for development when credentials are not yet configured
  try {
    const testAccount = await nodemailer.createTestAccount()
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  } catch (etherealErr) {
    console.warn('⚠️  Ethereal test account unavailable, email dispatch will be simulated:', etherealErr.message)
    return null
  }
}

// POST endpoint for consultations and contact forms
app.post(['/api/consultation', '/api/consultations', '/api/contact'], async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      })
    }

    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    })

    // 1. Persist to storage FIRST so the lead is NEVER lost
    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      service: service || 'General Consultation',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      formattedDate,
      status: 'new',
      emailSent: false,
    }

    const currentLeads = getConsultations()
    currentLeads.unshift(newLead)
    saveConsultations(currentLeads)

    console.log(`\n📬 [NEW CONSULTATION RECEIVED]`)
    console.log(`   Client  : ${newLead.name}`)
    console.log(`   Phone   : ${newLead.phone || 'N/A'}`)
    console.log(`   Email   : ${newLead.email}`)
    console.log(`   Service : ${newLead.service}`)
    console.log(`   Message : ${newLead.message}\n`)

    // 2. Dispatch Email notification (asynchronous & fail-safe)
    let emailStatus = { sent: false, note: '' }
    const recipient = process.env.RECEIVER_EMAIL || 'reyaneshstudio@gmail.com'

    try {
      const transporter = await createTransporter()

      if (transporter) {
        const ownerMailOptions = {
          from: `"Reyansh Studio Website" <${process.env.EMAIL_USER || 'reyaneshstudio@gmail.com'}>`,
          to: recipient,
          replyTo: email,
          subject: `🌟 New Consultation Request: ${name} (${service || 'Home Interior'})`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #121316; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2e;">
              <div style="background: linear-gradient(135deg, #1f1b13 0%, #2a2215 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #c9a86a;">
                <h1 style="color: #c9a86a; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">REYANSH STUDIO</h1>
                <p style="color: #d1d5db; margin: 8px 0 0; font-size: 14px;">Let Your Dream Come Alive &bull; Design &bull; Create &bull; Inspire</p>
              </div>
              
              <div style="padding: 28px 24px;">
                <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #e5e7eb;">
                  A new consultation request has been submitted through your website:
                </p>

                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1b20; border-radius: 8px; overflow: hidden; border: 1px solid #2e3038;">
                  <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; width: 140px; border-bottom: 1px solid #2e3038;">Client Name</td>
                    <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #2e3038;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; border-bottom: 1px solid #2e3038;">Email Address</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #2e3038;"><a href="mailto:${email}" style="color: #93c5fd; text-decoration: none;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; border-bottom: 1px solid #2e3038;">Phone Number</td>
                    <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #2e3038;">${phone ? `<a href="tel:${phone}" style="color: #93c5fd; text-decoration: none;">${phone}</a>` : 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; border-bottom: 1px solid #2e3038;">Service Interested</td>
                    <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #2e3038;">${service || 'General Inquiry'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a;">Received Date</td>
                    <td style="padding: 12px 16px; color: #9ca3af;">${formattedDate}</td>
                  </tr>
                </table>

                <div style="background-color: #1a1b20; padding: 18px; border-radius: 8px; border-left: 4px solid #c9a86a; margin-bottom: 24px;">
                  <h4 style="margin: 0 0 10px; color: #c9a86a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Client's Message</h4>
                  <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; color: #e5e7eb;">${message}</p>
                </div>

                <div style="text-align: center; margin-top: 26px;">
                  <a href="mailto:${email}?subject=Regarding%20your%20consultation%20with%20Reyansh%20Studio" style="background-color: #c9a86a; color: #111; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 6px; display: inline-block;">Reply to ${name}</a>
                </div>
              </div>

              <div style="background-color: #0b0c0e; padding: 14px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #222;">
                Reyansh Studio Website Consultation Engine
              </div>
            </div>
          `,
        }

        const info = await transporter.sendMail(ownerMailOptions)
        emailStatus.sent = true

        const testUrl = nodemailer.getTestMessageUrl(info)
        if (testUrl) {
          emailStatus.note = testUrl
          console.log('📬 [Test Mode] Preview consultation email here:', testUrl)
        }

        // Update emailSent flag in record
        newLead.emailSent = true
        const updatedList = getConsultations()
        const idx = updatedList.findIndex(c => c.id === newLead.id)
        if (idx !== -1) {
          updatedList[idx].emailSent = true
          saveConsultations(updatedList)
        }
      }
    } catch (mailErr) {
      console.warn('⚠️  Email delivery skipped or failed (lead is safely saved to storage):', mailErr.message)
    }

    return res.status(200).json({
      success: true,
      message: 'Consultation request received successfully! Our team will contact you shortly.',
      id: newLead.id,
      lead: newLead,
      previewUrl: emailStatus.note || undefined,
    })
  } catch (error) {
    console.error('Error handling consultation:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to process consultation request.',
      error: error.message,
    })
  }
})

// Update consultation status (e.g. mark as contacted / completed)
app.patch('/api/consultations/:id', (req, res) => {
  const { id } = req.params
  const { status, notes } = req.body

  const list = getConsultations()
  const lead = list.find(c => c.id === id)

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Consultation lead not found' })
  }

  if (status) lead.status = status
  if (notes !== undefined) lead.notes = notes
  lead.updatedAt = new Date().toISOString()

  saveConsultations(list)
  return res.json({ success: true, message: 'Status updated successfully', lead })
})

// Delete a consultation lead
app.delete('/api/consultations/:id', (req, res) => {
  const { id } = req.params
  const list = getConsultations()
  const filtered = list.filter(c => c.id !== id)

  if (filtered.length === list.length) {
    return res.status(404).json({ success: false, message: 'Consultation lead not found' })
  }

  saveConsultations(filtered)
  return res.json({ success: true, message: 'Lead deleted successfully' })
})

// Serve production static assets if dist exists
const distPath = path.join(__dirname, 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'))
    }
    next()
  })
}

app.listen(PORT, () => {
  console.log(`\n======================================================`)
  console.log(`✨ Reyansh Studio Backend running on http://localhost:${PORT}`)
  console.log(`✨ Health Check: http://localhost:${PORT}/api/health`)
  console.log(`✨ Consultations API: http://localhost:${PORT}/api/consultations`)
  console.log(`======================================================\n`)
})
