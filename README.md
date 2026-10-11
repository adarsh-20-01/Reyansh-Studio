# ✨ Reyansh Studio — Luxury Interior Design & Custom Sofas

> **Let Your Dream Come Alive • Design • Create • Inspire**

A high-end, full-stack web application designed for **Reyansh Studio** (Tilekar Nagar, Pune, Maharashtra). The platform features an interactive portfolio, handcrafted luxury sofa collection showcases, an inquiry & consultation booking portal with automated email notifications, a private administrative control center, dynamic four-palette theme customization, and direct Google Maps navigation.

---

## 🌟 Key Features

### 🎨 1. Dynamic Four-Palette Design System
- **Classic Gold (`dark`)**: Obsidian background with champagne gold accents.
- **Sky Blue (`skyblue`)**: Deep midnight navy canvas with electric azure highlights.
- **Slate Grey (`grey`)**: Modern minimalist charcoal backdrop with titanium silver accents.
- **Warm Light (`light`)**: Clean daylight mode with ivory surfaces and bronze accents.
- Real-time swatch selector with instant switching and `localStorage` persistence.

### 🛋️ 2. Comprehensive Service & Portfolio Showcase
- **8 Dedicated Interior Craft Disciplines**:
  - Home Interior & Turnkey Execution
  - Custom Handcrafted Sofas & Loungers
  - Modular Kitchen Cabinets
  - Designer T.V. Entertainment Units
  - Luxury Custom Beds & Headboards
  - Wardrobes, Walk-in Closets & Lofts
  - Handcrafted Solid Wood Dining Tables
  - Window Dressing, Curtains & Soft Furnishings
- Interactive service detail modals with high-resolution imagery and direct consultation booking.

### 🖼️ 3. Gallery with Real-Time Admin Management
- Filterable gallery showcasing completed living rooms, kitchens, bedrooms, custom sofas, and workshop manufacturing craftsmanship.
- Full-screen lightbox preview with responsive zoom and navigation.
- In-browser image upload capability with automatic metadata generation (restricted to studio administrators).

### 📬 4. Consultation & Lead Management Engine
- Interactive multi-field inquiry submission form supporting design and floor plan image attachments.
- Automatic email notifications powered by Nodemailer and Python SMTP with HTML email templates and client confirmations.
- Local JSON database fallback (`data/consultations.json`) ensuring 0 lost inquiries even during offline operations.

### 🔒 5. Private Administrative Portal
- Secure email & password authenticated dashboard (`/admin`) for authorized studio staff.
- Real-time lead tracker (view, filter, update inquiry status, inspect attachments).
- Dedicated gallery manager to upload new project photos dynamically.

### 📍 6. Studio Navigation & Digital Business Card
- Direct Google Maps routing to Reyansh Studio (Tilekar Nagar, Kondhwa Budruk, Pune 411048).
- One-tap WhatsApp chat buttons and digital business card with QR scanner.

---

## 📁 Repository Structure

```
Reyansh-Studio/
├── data/                      # Local JSON storage for leads & gallery additions
│   ├── consultations.json
│   └── custom_gallery.json
├── src/                       # Frontend application (React 19 + Vite 6)
│   ├── assets/                # High-res photography, project imagery & branding
│   ├── components/            # Reusable UI elements (Navbar, Footer, Modals, Forms)
│   │   ├── AdminLogin.jsx
│   │   ├── ContactForm.jsx
│   │   ├── CTASection.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── ServiceDetailModal.jsx
│   │   ├── TestimonialSlider.jsx
│   │   ├── ThemeSelector.jsx
│   │   └── WhatsAppButton.jsx
│   ├── context/               # Global state (Authentication, Role control)
│   │   └── AuthContext.jsx
│   ├── pages/                 # Route views
│   │   ├── About.jsx
│   │   ├── Admin.jsx
│   │   ├── Contact.jsx
│   │   ├── Gallery.jsx
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   └── Services.jsx
│   ├── App.jsx                # Application root with routing & layout
│   ├── index.css              # Design tokens, themes & animations
│   └── main.jsx               # React entry point
├── .env.example               # Template for environment configuration
├── .gitignore                 # Excludes node_modules, build artifacts & secrets
├── app.py                     # Python Flask backend (SMTP, API & file uploads)
├── index.html                 # HTML5 document template
├── package.json               # Node.js project manifest & scripts
├── requirements.txt           # Python backend dependencies
├── server.js                  # Express.js backend alternative
├── test-email.js              # Diagnostic script to test email delivery
└── vite.config.js             # Vite development & build configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0 or later) and **npm**
- **Python** (v3.9 or later, optional if using Flask backend)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/adarsh-20-01/Reyansh-Studio.git
cd Reyansh-Studio

# Install frontend dependencies
npm install

# (Optional) Install Python backend dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the root directory by copying the example template:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
PORT=5000
RECEIVER_EMAIL=reyaneshstudio@gmail.com
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-google-app-password
ADMIN_EMAIL=reyaneshstudio@gmail.com
ADMIN_PASSWORD=your-secure-admin-password
```

### 4. Running the Development Server
```bash
# Run both frontend & backend concurrently:
npm run dev

# Or run frontend only:
npm run client
```
The website will be live at `http://localhost:5173`.

### 5. Building for Production
```bash
npm run build
npm run preview
```

---

## 📍 Studio Contact Information
- **Studio Address**: Reyansh Studio, Tilekar Nagar, Kondhwa Budruk, Pune, Maharashtra 411048
- **Directions**: [Open Google Maps Directions](https://www.google.com/maps/dir/18.4416735,73.8690576/REYANSH+STUDIO,+Yewalewadi,+TILAKER+NAGER,+Kondhwa+Budruk,+Pune,+Maharashtra+411048/@18.4458178,73.8651758,15z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3bc2ebee32ac5f73:0x271d6320ebfc173c!2m2!1d73.8864756!2d18.4404281)
- **Phone**: +91 78875 56060 / +91 94044 66587
- **Email**: reyaneshstudio@gmail.com

---

## 📄 License
This project is licensed under the MIT License.
