import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import dns from 'dns'
import { fileURLToPath } from 'url'

// Force IPv4 DNS resolution first to prevent IPv6 connection hangs in cloud/container environments (e.g. Render)
if (dns && dns.setDefaultResultOrder) {
  try {
    dns.setDefaultResultOrder('ipv4first')
  } catch (_) {}
}

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Data directory and file paths
const DATA_DIR = path.join(__dirname, 'data')
const ASSETS_DIR = path.join(__dirname, 'src', 'assets')
const CONSULTATIONS_FILE = path.join(DATA_DIR, 'consultations.json')
const GALLERY_FILE = path.join(DATA_DIR, 'custom_gallery.json')

// Escape HTML helper
const escapeHtml = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Ensure data directory and files exist
const initStorage = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(ASSETS_DIR)) {
      fs.mkdirSync(ASSETS_DIR, { recursive: true })
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
    if (!fs.existsSync(GALLERY_FILE)) {
      fs.writeFileSync(GALLERY_FILE, JSON.stringify([], null, 2), 'utf-8')
      console.log('📁 Initialized custom gallery database at:', GALLERY_FILE)
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

// Helper to read custom gallery
const getCustomGallery = () => {
  try {
    if (!fs.existsSync(GALLERY_FILE)) return []
    const content = fs.readFileSync(GALLERY_FILE, 'utf-8')
    return JSON.parse(content || '[]')
  } catch (err) {
    console.error('Error reading gallery file:', err)
    return []
  }
}

// Helper to save custom gallery
const saveCustomGallery = (list) => {
  try {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(list, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Error writing gallery file:', err)
    return false
  }
}

// Deduplication helper: Check if an identical enquiry was submitted within the last 10 minutes
const findRecentDuplicateLead = (email, message, product_title, windowMs = 10 * 60 * 1000) => {
  const list = getConsultations()
  const now = Date.now()
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanMessage = (message || '').trim().toLowerCase()
  const cleanTitle = (product_title || '').trim().toLowerCase()

  return list.find((lead) => {
    const leadTime = new Date(lead.createdAt).getTime()
    if (now - leadTime > windowMs) return false // Outside time window

    const leadEmail = (lead.email || '').trim().toLowerCase()
    const leadMessage = (lead.message || '').trim().toLowerCase()
    const leadTitle = (lead.product_title || '').trim().toLowerCase()

    const emailMatches = leadEmail === cleanEmail
    const contentMatches =
      (cleanMessage && leadMessage === cleanMessage) || (cleanTitle && leadTitle === cleanTitle)

    return emailMatches && contentMatches
  })
}

// Configure Multer for in-memory file uploads (15MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
})

// Middleware to conditionally process multipart/form-data for photo enquiries
const handleContactUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || ''
  if (contentType.includes('multipart/form-data')) {
    upload.single('photo')(req, res, (err) => {
      if (err) {
        console.error('Multer file parsing error:', err)
        return res.status(400).json({
          success: false,
          message:
            err.code === 'LIMIT_FILE_SIZE'
              ? 'Uploaded photo is too large (maximum size is 15MB).'
              : `File upload error: ${err.message}`,
        })
      }
      next()
    })
  } else {
    next()
  }
}

// Core Express Middleware with generous payload limit for base64 photo data
app.use(cors())
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

// Static asset delivery for uploaded / existing gallery images
app.use('/assets', express.static(ASSETS_DIR))

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
  const gallery = getCustomGallery()
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'Reyansh Studio Backend & Enquiry Engine',
    emailConfigured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    receiver: process.env.RECEIVER_EMAIL || 'reyaneshstudio@gmail.com',
    totalConsultations: consultations.length,
    newLeadsCount: consultations.filter(c => c.status === 'new').length,
    customGalleryCount: gallery.length,
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
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  res.json({
    success: true,
    count: list.length,
    consultations: list,
  })
})

/**
 * Dispatch an enquiry email with explicit timeouts and connection fallback.
 * Prevents SMTP from hanging indefinitely and returns a clean result object.
 * Does NOT log passwords, tokens, or private customer data.
 */
const dispatchEnquiryEmail = async (mailOptions) => {
  const user = (process.env.SMTP_USERNAME || process.env.EMAIL_USER || '').trim()
  const pass = (process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || '').replace(/\s+/g, '').trim()
  const host = (process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com').trim()
  const explicitPort = process.env.SMTP_PORT || process.env.EMAIL_PORT

  if (!user || !pass) {
    console.warn('⚠️ [SMTP Diagnostic] EMAIL_USER or EMAIL_PASS not configured. Skipping email dispatch.')
    return { sent: false, error: 'Email credentials not configured on server' }
  }

  // Common transporter factory with explicit timeouts & forced IPv4
  const createTransportForPort = (port, secure) => {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      family: 4,               // Force IPv4 to prevent cloud IPv6 black-hole connection hangs
      connectionTimeout: 6000, // 6s max to establish TCP connection
      greetingTimeout: 4000,   // 4s max to receive SMTP banner
      socketTimeout: 8000,     // 8s max socket inactivity timeout
      dnsTimeout: 3000,        // 3s max DNS resolution timeout
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      },
    })
  }

  // Determine primary port and security mode
  const primaryPort = explicitPort ? Number(explicitPort) : 465
  const primarySecure = process.env.EMAIL_SECURE === 'true' || primaryPort === 465

  console.log(`📡 [SMTP Diagnostic] Attempting delivery: host=${host}, port=${primaryPort}, secure=${primarySecure}, family=IPv4`)

  // Primary attempt
  try {
    const transporter = createTransportForPort(primaryPort, primarySecure)
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`SMTP connection timed out after 7s on port ${primaryPort}`)), 7000)
      ),
    ])

    console.log(`✅ [SMTP Diagnostic] Email delivered successfully. Message ID: ${info.messageId || 'confirmed'}`)
    return { sent: true, messageId: info.messageId }
  } catch (primaryErr) {
    const safeErrorMsg = primaryErr.message || primaryErr.code || 'Connection error'
    console.warn(`⚠️ [SMTP Diagnostic] Primary attempt failed on port ${primaryPort}: code=${primaryErr.code || 'N/A'}, message=${safeErrorMsg}`)

    // If port was explicitly specified in environment, do not attempt fallback port
    if (explicitPort) {
      return { sent: false, error: safeErrorMsg }
    }

    // Attempt alternate standard port (587 STARTTLS if 465 timed out, or 465 SSL if 587 timed out)
    const fallbackPort = primaryPort === 465 ? 587 : 465
    const fallbackSecure = fallbackPort === 465
    console.log(`🔄 [SMTP Diagnostic] Retrying via alternate port: port=${fallbackPort}, secure=${fallbackSecure}...`)

    try {
      const fallbackTransporter = createTransportForPort(fallbackPort, fallbackSecure)
      const info = await Promise.race([
        fallbackTransporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`SMTP connection timed out after 6s on fallback port ${fallbackPort}`)), 6000)
        ),
      ])

      console.log(`✅ [SMTP Diagnostic] Email delivered via fallback port ${fallbackPort}. Message ID: ${info.messageId || 'confirmed'}`)
      return { sent: true, messageId: info.messageId }
    } catch (fallbackErr) {
      const fallbackSafeMsg = fallbackErr.message || fallbackErr.code || 'Fallback timeout'
      console.warn(`⚠️ [SMTP Diagnostic] Fallback attempt also failed on port ${fallbackPort}: code=${fallbackErr.code || 'N/A'}, message=${fallbackSafeMsg}`)
      return { sent: false, error: fallbackSafeMsg }
    }
  }
}

// POST endpoint for contact forms, photo enquiries, and consultation bookings
app.post(
  ['/api/contact', '/api/contact/', '/api/consultation', '/api/consultations', '/api/enquiry', '/api/enquiries'],
  handleContactUpload,
  async (req, res) => {
    try {
      const body = req.body || {}

      // Honeypot spam trap
      if (body._gotcha || body._hp_trap || body.honeypot) {
        return res.status(400).json({ success: false, message: 'Invalid submission.' })
      }

      const name = (body.name || '').trim()
      const email = (body.email || '').trim()
      const phone = (body.phone || '').trim()
      const service = (body.service || body.subject || 'Custom Furniture Enquiry').trim()
      const message = (body.message || '').trim()

      // Optional design & photo fields
      const product_title = (body.product_title || body.productTitle || '').trim()
      const photo_url = (body.photo_url || body.photoUrl || '').trim()
      const photo_filename = (
        body.photo_filename ||
        body.photoFilename ||
        (req.file ? req.file.originalname : '')
      ).trim()
      const photo_data = (body.photo_data || body.photoData || '').trim()

      // Input Validation
      if (!name || name.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your full name (at least 2 characters).',
        })
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        })
      }

      if (!message || message.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Please enter your message or project requirements.',
        })
      }

      // 1. Prevent duplicate leads when retrying after a client-side timeout
      const existingLead = findRecentDuplicateLead(email, message, product_title)
      if (existingLead) {
        console.log(`ℹ️ [Deduplication] Recognized duplicate enquiry within 10-min window from ${email}. Reusing lead ID: ${existingLead.id}`)
        return res.status(200).json({
          success: true,
          saved: true,
          id: existingLead.id,
          emailSent: existingLead.emailSent,
          duplicatePrevented: true,
          message: 'Your enquiry is already safely received and recorded in our studio database. Our team will contact you shortly.',
          notice: existingLead.emailSent
            ? undefined
            : 'Email notification may be delayed, but your enquiry is safely logged in our system.',
        })
      }

      const formattedDate = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'medium',
      })

      // 2. Persist to storage FIRST so lead is guaranteed never to be lost
      const newLead = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name,
        email,
        phone: phone || '',
        service: service || 'General Consultation',
        message,
        product_title: product_title || '',
        photo_filename: photo_filename || '',
        photo_url: photo_url || '',
        has_photo: Boolean(req.file || photo_data || photo_filename),
        createdAt: new Date().toISOString(),
        formattedDate,
        status: 'new',
        emailSent: false,
      }

      const currentLeads = getConsultations()
      currentLeads.unshift(newLead)
      saveConsultations(currentLeads)

      console.log(`\n📬 [NEW ENQUIRY RECEIVED]`)
      console.log(`   Client  : ${newLead.name}`)
      console.log(`   Phone   : ${newLead.phone || 'N/A'}`)
      console.log(`   Email   : ${newLead.email}`)
      console.log(`   Service : ${newLead.service}`)
      if (product_title) console.log(`   Design  : ${product_title}`)
      if (photo_filename) console.log(`   Photo   : ${photo_filename}`)
      console.log(`   Message : ${newLead.message.slice(0, 100)}...\n`)

      // 3. Prepare Email Notification with attachments and rich HTML
      const recipient = process.env.RECEIVER_EMAIL || 'reyaneshstudio@gmail.com'
      const attachments = []
      let photoSectionHtml = ''

      if (req.file && req.file.buffer) {
        attachments.push({
          filename: req.file.originalname || 'enquiry-photo.jpg',
          content: req.file.buffer,
          contentType: req.file.mimetype || 'image/jpeg',
          cid: 'enquiry_photo',
        })
        photoSectionHtml = `
          <div style="background-color: #1a1b22; padding: 18px; border-radius: 8px; border: 1px solid #282a36; margin: 20px 0; text-align: center;">
            <div style="font-size: 12px; font-weight: 600; color: #c9a96e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Attached Design Photo</div>
            <img src="cid:enquiry_photo" alt="Customer Photo Reference" style="max-width: 100%; max-height: 420px; border-radius: 8px; border: 1px solid #333;" />
            <div style="color: #9ca3af; font-size: 12px; margin-top: 8px;">${escapeHtml(req.file.originalname || 'Uploaded Photo')}</div>
          </div>
        `
      } else if (photo_data && photo_data.includes('base64,')) {
        try {
          const parts = photo_data.split('base64,')
          const mimeMatch = parts[0].match(/:(.*?);/)
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
          const buffer = Buffer.from(parts[1], 'base64')
          attachments.push({
            filename: photo_filename || 'enquiry-photo.jpg',
            content: buffer,
            contentType: mimeType,
            cid: 'enquiry_photo',
          })
          photoSectionHtml = `
            <div style="background-color: #1a1b22; padding: 18px; border-radius: 8px; border: 1px solid #282a36; margin: 20px 0; text-align: center;">
              <div style="font-size: 12px; font-weight: 600; color: #c9a96e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Attached Design Photo</div>
              <img src="cid:enquiry_photo" alt="Customer Photo Reference" style="max-width: 100%; max-height: 420px; border-radius: 8px; border: 1px solid #333;" />
              <div style="color: #9ca3af; font-size: 12px; margin-top: 8px;">${escapeHtml(photo_filename || 'Uploaded Reference Photo')}</div>
            </div>
          `
        } catch (attachErr) {
          console.warn('Failed to parse base64 photo for attachment:', attachErr.message)
        }
      } else if (photo_url) {
        photoSectionHtml = `
          <div style="background-color: #1a1b22; padding: 18px; border-radius: 8px; border: 1px solid #282a36; margin: 20px 0; text-align: center;">
            <div style="font-size: 12px; font-weight: 600; color: #c9a96e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Gallery Reference Photo</div>
            <p style="margin: 0; font-size: 13px;">
              <a href="${escapeHtml(photo_url)}" target="_blank" style="color: #93c5fd; text-decoration: underline;">View Full Resolution Photo: ${escapeHtml(photo_url)}</a>
            </p>
          </div>
        `
      }

      const subjectTag = product_title ? ` [${product_title}]` : ''
      const ownerMailOptions = {
        from: `"Reyansh Studio Website" <${process.env.EMAIL_USER || 'reyaneshstudio@gmail.com'}>`,
        to: recipient,
        replyTo: email,
        subject: `🌟 New Furniture Enquiry: ${name}${subjectTag} (${service})`,
        attachments,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #121316; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2e;">
            <div style="background: linear-gradient(135deg, #1f1b13 0%, #2a2215 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #c9a86a;">
              <h1 style="color: #c9a86a; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">REYANSH STUDIO</h1>
              <p style="color: #d1d5db; margin: 8px 0 0; font-size: 14px;">Let Your Dream Come Alive &bull; Design &bull; Create &bull; Inspire</p>
            </div>
            
            <div style="padding: 28px 24px;">
              <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #e5e7eb;">
                A customer has submitted a furniture enquiry through your website:
              </p>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1b20; border-radius: 8px; overflow: hidden; border: 1px solid #2e3038;">
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; width: 140px; border-bottom: 1px solid #2e3038;">Client Name</td>
                  <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #2e3038;"><strong>${escapeHtml(name)}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; border-bottom: 1px solid #2e3038;">Email Address</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #2e3038;"><a href="mailto:${escapeHtml(email)}" style="color: #93c5fd; text-decoration: none;">${escapeHtml(email)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; border-bottom: 1px solid #2e3038;">Phone Number</td>
                  <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #2e3038;">${phone ? `<a href="tel:${escapeHtml(phone)}" style="color: #93c5fd; text-decoration: none;">${escapeHtml(phone)}</a>` : 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; border-bottom: 1px solid #2e3038;">Service Interested</td>
                  <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #2e3038;">${escapeHtml(service)}</td>
                </tr>
                ${
                  product_title
                    ? `
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a; border-bottom: 1px solid #2e3038;">Design Reference</td>
                  <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #2e3038;">
                    <span style="background: rgba(201, 169, 110, 0.2); color: #c9a86a; padding: 3px 10px; border-radius: 4px; font-weight: 600; font-size: 13px;">${escapeHtml(product_title)}</span>
                  </td>
                </tr>
                `
                    : ''
                }
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #c9a86a;">Received Date</td>
                  <td style="padding: 12px 16px; color: #9ca3af;">${formattedDate}</td>
                </tr>
              </table>

              ${photoSectionHtml}

              <div style="background-color: #1a1b20; padding: 18px; border-radius: 8px; border-left: 4px solid #c9a86a; margin-bottom: 24px;">
                <h4 style="margin: 0 0 10px; color: #c9a86a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Customer's Message</h4>
                <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; color: #e5e7eb;">${escapeHtml(message)}</p>
              </div>

              <div style="text-align: center; margin-top: 26px;">
                <a href="mailto:${escapeHtml(email)}?subject=Regarding%20your%20furniture%20enquiry%20with%20Reyansh%20Studio" style="background-color: #c9a86a; color: #111; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 6px; display: inline-block;">Reply to ${escapeHtml(name)}</a>
              </div>
            </div>

            <div style="background-color: #0b0c0e; padding: 14px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #222;">
              Reyansh Studio Notification Engine &bull; <a href="https://reyanshstudio.com" style="color: #c9a86a; text-decoration: none;">reyanshstudio.com</a>
            </div>
          </div>
        `,
      }

      // 4. Dispatch Email with fast timeout - NEVER wait indefinitely
      const emailResult = await dispatchEnquiryEmail(ownerMailOptions)

      if (emailResult.sent) {
        newLead.emailSent = true
        const updatedList = getConsultations()
        const idx = updatedList.findIndex(c => c.id === newLead.id)
        if (idx !== -1) {
          updatedList[idx].emailSent = true
          saveConsultations(updatedList)
        }
      } else {
        newLead.emailSent = false
        newLead.emailNote = emailResult.error || 'Email delayed or skipped'
        const updatedList = getConsultations()
        const idx = updatedList.findIndex(c => c.id === newLead.id)
        if (idx !== -1) {
          updatedList[idx].emailSent = false
          updatedList[idx].emailNote = newLead.emailNote
          saveConsultations(updatedList)
        }
      }

      // 5. Always return a timely, valid JSON response with HTTP 200
      return res.status(200).json({
        success: true,
        saved: true,
        message: emailResult.sent
          ? 'Enquiry received successfully! Our team will contact you shortly.'
          : 'Thank you! Your enquiry has been received and safely saved in our studio database. Our team will contact you shortly.',
        id: newLead.id,
        lead: newLead,
        emailSent: Boolean(emailResult.sent),
        has_photo: Boolean(req.file || photo_data || photo_filename),
        notice: emailResult.sent
          ? undefined
          : 'Email notification to studio is delayed, but your enquiry is safely logged in our database.',
      })
    } catch (error) {
      console.error('Error handling enquiry:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to process enquiry request.',
        error: error.message,
      })
    }
  }
)

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

// Gallery Endpoints
app.get('/api/gallery', (req, res) => {
  const items = getCustomGallery()
  res.json({
    success: true,
    count: items.length,
    items,
  })
})

app.post('/api/gallery', upload.single('photo'), (req, res) => {
  try {
    let title = ''
    let category = 'Custom Sofas'
    let tag = ''
    let desc = ''
    let savedFilename = ''
    let imageUrl = ''

    if (req.file) {
      title = (req.body.title || '').trim()
      category = (req.body.category || 'Custom Sofas').trim()
      tag = (req.body.tag || '').trim()
      desc = (req.body.desc || '').trim()

      const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg'
      const cleanTitle = (title || 'photo').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)
      savedFilename = `upload_${Date.now()}_${cleanTitle}${ext}`
      const filePath = path.join(ASSETS_DIR, savedFilename)
      fs.writeFileSync(filePath, req.file.buffer)
      imageUrl = `/api/gallery/image/${savedFilename}`
    } else {
      const payload = req.body || {}
      title = (payload.title || '').trim()
      category = (payload.category || 'Custom Sofas').trim()
      tag = (payload.tag || '').trim()
      desc = (payload.desc || '').trim()
      const photoData = payload.photo_data || payload.photoData || ''
      const photoUrl = payload.photo_url || payload.photoUrl || ''

      if (photoData && photoData.includes('base64,')) {
        const parts = photoData.split('base64,')
        const header = parts[0]
        let ext = '.jpg'
        if (header.includes('image/png')) ext = '.png'
        else if (header.includes('image/webp')) ext = '.webp'

        const cleanTitle = (title || 'photo').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)
        savedFilename = `upload_${Date.now()}_${cleanTitle}${ext}`
        const filePath = path.join(ASSETS_DIR, savedFilename)
        fs.writeFileSync(filePath, Buffer.from(parts[1], 'base64'))
        imageUrl = `/api/gallery/image/${savedFilename}`
      } else if (photoUrl) {
        imageUrl = photoUrl
      }
    }

    if (!title) {
      return res.status(400).json({ success: false, message: 'Photo title is required' })
    }

    const newItem = {
      id: `custom_${Date.now()}`,
      image: imageUrl,
      filename: savedFilename,
      title,
      category: category || 'Custom Sofas',
      tag: tag || category || 'New Design',
      desc: desc || `Handcrafted ${title} designed and created by Reyansh Studio.`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    }

    const items = getCustomGallery()
    items.unshift(newItem)
    saveCustomGallery(items)

    console.log(`\n🖼️ [GALLERY] New photo added: "${title}" (${savedFilename || 'URL'})\n`)

    return res.status(201).json({
      success: true,
      message: 'Photo added to gallery successfully!',
      item: newItem,
    })
  } catch (err) {
    console.error('Failed to add photo to gallery:', err)
    return res.status(500).json({ success: false, message: `Failed to save photo: ${err.message}` })
  }
})

app.delete('/api/gallery/:id', (req, res) => {
  try {
    const { id } = req.params
    const items = getCustomGallery()
    const target = items.find(i => String(i.id) === String(id))

    if (!target) {
      return res.status(404).json({ success: false, message: 'Photo not found' })
    }

    const updated = items.filter(i => String(i.id) !== String(id))
    saveCustomGallery(updated)

    if (target.filename && target.filename.startsWith('upload_')) {
      const filePath = path.join(ASSETS_DIR, target.filename)
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
        } catch (_) {}
      }
    }

    return res.json({ success: true, message: 'Photo removed from gallery' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.get('/api/gallery/image/:filename', (req, res) => {
  const cleanFilename = path.basename(req.params.filename)
  const filePath = path.join(ASSETS_DIR, cleanFilename)
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath)
  }
  return res.status(404).json({ success: false, message: 'Image not found' })
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
  console.log(`✨ Contact / Photo Enquiry: http://localhost:${PORT}/api/contact`)
  console.log(`✨ Gallery API: http://localhost:${PORT}/api/gallery`)
  console.log(`======================================================\n`)
})
