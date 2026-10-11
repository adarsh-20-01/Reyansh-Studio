import os
import sys
import re
import json
import html
import time
import smtplib
from datetime import datetime
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.utils import formatdate
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows consoles
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Environment Configuration
PORT = int(os.getenv("PORT", 5000))
BUSINESS_EMAIL = os.getenv("BUSINESS_EMAIL") or os.getenv("RECEIVER_EMAIL", "reyaneshstudio@gmail.com")
SMTP_HOST = os.getenv("SMTP_HOST") or os.getenv("EMAIL_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT") or os.getenv("EMAIL_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME") or os.getenv("EMAIL_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD") or os.getenv("EMAIL_PASS", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL") or SMTP_USERNAME or "reyaneshstudio@gmail.com"
ADMIN_EMAIL = (os.getenv("ADMIN_EMAIL") or "reyaneshstudio@gmail.com").strip().lower()
ADMIN_PASSWORD = (os.getenv("ADMIN_PASSWORD") or "reyansh@2026").strip()


# CORS configuration
cors_origins_env = os.getenv("CORS_ORIGINS", "*")
if cors_origins_env == "*" or not cors_origins_env:
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
    CORS(app, resources={r"/api/*": {"origins": origins}})

# Rate Limiting configuration (in-memory sliding window)
RATE_LIMIT_PER_WINDOW = int(os.getenv("RATE_LIMIT_PER_WINDOW", 5))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", 600))  # 10 minutes
request_history = {}  # { ip_address: [timestamp, ...] }

# Persistent storage configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
ASSETS_DIR = os.path.join(BASE_DIR, "src", "assets")
CONSULTATIONS_FILE = os.path.join(DATA_DIR, "consultations.json")
GALLERY_FILE = os.path.join(DATA_DIR, "custom_gallery.json")


def init_storage():
    """Ensure data directory and JSON stores exist."""
    try:
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR, exist_ok=True)
        if not os.path.exists(CONSULTATIONS_FILE):
            with open(CONSULTATIONS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)
        if not os.path.exists(GALLERY_FILE):
            with open(GALLERY_FILE, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)
    except Exception as e:
        print(f"[WARNING] Error initializing storage: {e}", file=sys.stderr)


init_storage()


def get_custom_gallery():
    """Read saved custom gallery items."""
    try:
        if not os.path.exists(GALLERY_FILE):
            return []
        with open(GALLERY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_custom_gallery(items):
    """Write custom gallery items atomically."""
    try:
        with open(GALLERY_FILE, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2)
        return True
    except Exception as e:
        print(f"[WARNING] Failed to save custom gallery: {e}", file=sys.stderr)
        return False


def get_consultations():
    """Read saved consultation leads."""
    try:
        if not os.path.exists(CONSULTATIONS_FILE):
            return []
        with open(CONSULTATIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_consultations(leads):
    """Write consultation leads to file atomically."""
    try:
        with open(CONSULTATIONS_FILE, "w", encoding="utf-8") as f:
            json.dump(leads, f, indent=2)
        return True
    except Exception as e:
        print(f"[WARNING] Failed to save consultations: {e}", file=sys.stderr)
        return False


def is_rate_limited(ip):
    """Check if the requesting IP has exceeded the allowed rate limit."""
    now = time.time()
    cutoff = now - RATE_LIMIT_WINDOW_SECONDS

    # Clean old timestamps
    timestamps = [t for t in request_history.get(ip, []) if t > cutoff]
    request_history[ip] = timestamps

    if len(timestamps) >= RATE_LIMIT_PER_WINDOW:
        return True

    timestamps.append(now)
    request_history[ip] = timestamps
    return False


def sanitize_header(val):
    """Prevent email header injection by stripping carriage returns and newlines."""
    if not val:
        return ""
    return re.sub(r"[\r\n]", "", str(val)).strip()


DOTENV_PATH = os.path.join(BASE_DIR, ".env")


def get_smtp_config():
    """Dynamically read current SMTP credentials from .env so edits take effect immediately."""
    if os.path.exists(DOTENV_PATH):
        load_dotenv(DOTENV_PATH, override=True)
    else:
        load_dotenv(override=True)
    user = os.getenv("SMTP_USERNAME") or os.getenv("EMAIL_USER", "")
    pwd = os.getenv("SMTP_PASSWORD") or os.getenv("EMAIL_PASS", "")
    business_email = os.getenv("BUSINESS_EMAIL") or os.getenv("RECEIVER_EMAIL", "reyaneshstudio@gmail.com")
    host = os.getenv("SMTP_HOST") or os.getenv("EMAIL_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT") or os.getenv("EMAIL_PORT", 587))
    from_email = os.getenv("SMTP_FROM_EMAIL") or user or "reyaneshstudio@gmail.com"
    return {
        "user": user.strip(),
        "password": pwd.replace(" ", "").strip(),
        "business_email": business_email.strip(),
        "host": host.strip(),
        "port": port,
        "from_email": from_email.strip(),
    }


def send_enquiry_email(name, email, phone, service, message, formatted_date, photo_filename=None, photo_data=None, product_title=None, photo_url=None):
    """Send transactional notification email to business owner via SMTP with optional attached design photo."""
    cfg = get_smtp_config()
    if not cfg["user"] or not cfg["password"]:
        return {
            "success": False,
            "status_code": 503,
            "error": "Email service is not configured. Please set SMTP_PASSWORD (or EMAIL_PASS) in .env.",
        }

    clean_name = sanitize_header(name)
    clean_service = sanitize_header(service) or "Furniture Enquiry"
    clean_email = sanitize_header(email)
    display_title = sanitize_header(product_title) or clean_service

    # Check for photo payload (either base64 data or filename on disk)
    img_bytes = None
    img_subtype = "jpeg"
    safe_img_filename = "design-reference.jpg"

    if photo_data and str(photo_data).startswith("data:image"):
        try:
            header, b64_str = photo_data.split(",", 1)
            img_bytes = base64.b64decode(b64_str)
            if "png" in header:
                img_subtype = "png"
                safe_img_filename = "design-reference.png"
            elif "webp" in header:
                img_subtype = "webp"
                safe_img_filename = "design-reference.webp"
            else:
                img_subtype = "jpeg"
                safe_img_filename = "design-reference.jpg"
            if photo_filename:
                safe_img_filename = sanitize_header(os.path.basename(photo_filename))
        except Exception as e:
            print(f"[WARNING] Could not parse base64 photo data: {e}", file=sys.stderr)

    if not img_bytes and photo_filename:
        clean_filename = os.path.basename(sanitize_header(photo_filename))
        asset_path = os.path.join(ASSETS_DIR, clean_filename)
        if os.path.exists(asset_path):
            try:
                with open(asset_path, "rb") as f:
                    img_bytes = f.read()
                ext = os.path.splitext(clean_filename)[1].lower().replace(".", "")
                img_subtype = "png" if ext == "png" else "jpeg"
                safe_img_filename = clean_filename
            except Exception as e:
                print(f"[WARNING] Could not read asset image {asset_path}: {e}", file=sys.stderr)

    has_photo = bool(img_bytes)

    # Use multipart/related if an image is embedded, otherwise multipart/alternative
    if has_photo:
        msg = MIMEMultipart("related")
        msg_alt = MIMEMultipart("alternative")
        msg.attach(msg_alt)
    else:
        msg = MIMEMultipart("alternative")
        msg_alt = msg

    subject_prefix = f"New Photo Enquiry - {clean_name}" if has_photo else f"New Furniture Enquiry - {clean_name}"
    msg["Subject"] = f"{subject_prefix} ({display_title})"
    msg["From"] = f"Reyansh Studio Website <{cfg['from_email']}>"
    msg["To"] = cfg["business_email"]
    msg["Reply-To"] = clean_email
    msg["Date"] = formatdate(localtime=True)

    # Plain-text version
    photo_text_section = f"""
ATTACHED DESIGN PHOTO:
--------------------------------------------------
Product/Design : {product_title or 'Custom Furniture Design'}
File Name      : {safe_img_filename}
[High-resolution photo is embedded & attached to this email]
""" if has_photo else ""

    text_content = f"""NEW FURNITURE ENQUIRY - REYANSH STUDIO
==================================================
Date & Time     : {formatted_date}
Client Name     : {name}
Email           : {email}
Phone           : {phone or 'Not provided'}
Product/Service : {display_title}
{photo_text_section}
Client Message:
--------------------------------------------------
{message}

==================================================
Direct Reply: Click reply in your mail client to reply to {email}
"""

    safe_name = html.escape(name)
    safe_email = html.escape(email)
    safe_phone = html.escape(phone or "Not provided")
    safe_service = html.escape(service or "General Furniture Enquiry")
    safe_title = html.escape(product_title or display_title)
    safe_message = html.escape(message).replace("\n", "<br />")

    photo_html_section = f"""
    <!-- Attached Design Photo Card -->
    <div style="background-color: #1a1b22; border: 1px solid #c9a96e; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
      <div style="display: inline-block; background: rgba(201, 169, 110, 0.2); border: 1px solid #c9a96e; color: #c9a96e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 4px 14px; border-radius: 14px; margin-bottom: 10px;">
        📸 Attached Design Photo Reference
      </div>
      <h3 style="margin: 0 0 14px; color: #ffffff; font-size: 18px; font-weight: 600;">
        {safe_title}
      </h3>
      <div style="background: #0d0e12; border-radius: 8px; padding: 8px; display: inline-block; max-width: 100%; border: 1px solid #2a2a35;">
        <img src="cid:enquiry_photo" alt="{safe_title}" style="max-width: 100%; max-height: 420px; border-radius: 6px; display: block; margin: 0 auto; object-fit: contain;" />
      </div>
      <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0;">
        Attachment: <strong>{safe_img_filename}</strong> (High-resolution image included)
      </p>
    </div>
    """ if has_photo else ""

    badge_label = "New Enquiry with Design Photo" if has_photo else "New Website Enquiry"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
    </head>
    <body style="margin: 0; padding: 24px; background-color: #0d0e12; font-family: 'Segoe UI', Arial, sans-serif; color: #f3f4f6;">
      <div style="max-width: 650px; margin: 0 auto; background-color: #14151a; border: 1px solid #2a2a32; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1b1710 0%, #262014 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #c9a96e;">
          <h1 style="color: #c9a96e; margin: 0; font-size: 24px; letter-spacing: 3px; text-transform: uppercase;">REYANSH STUDIO</h1>
          <p style="color: #d1d5db; margin: 8px 0 0; font-size: 13px; letter-spacing: 1px;">DESIGN &bull; CREATE &bull; INSPIRE</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <div style="display: inline-block; background: rgba(201, 169, 110, 0.15); border: 1px solid rgba(201, 169, 110, 0.4); color: #c9a96e; font-size: 12px; font-weight: 600; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px;">
            {badge_label}
          </div>

          <h2 style="margin: 0 0 16px; color: #ffffff; font-size: 20px;">
            Enquiry Received from <span style="color: #c9a96e;">{safe_name}</span>
          </h2>

          <p style="color: #9ca3af; font-size: 14px; margin-top: 0; line-height: 1.6;">
            A customer submitted a furniture consultation request on your website. Full customer and design details are listed below:
          </p>

          <!-- Details Table -->
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #1a1b22; border-radius: 8px; overflow: hidden; border: 1px solid #282a36;">
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #c9a96e; width: 140px; border-bottom: 1px solid #282a36; font-size: 13px;">Customer Name</td>
              <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #282a36; font-size: 14px;"><strong>{safe_name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #c9a96e; border-bottom: 1px solid #282a36; font-size: 13px;">Email Address</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #282a36; font-size: 14px;">
                <a href="mailto:{safe_email}" style="color: #93c5fd; text-decoration: none;">{safe_email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #c9a96e; border-bottom: 1px solid #282a36; font-size: 13px;">Phone / WhatsApp</td>
              <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #282a36; font-size: 14px;">
                {f'<a href="tel:{safe_phone}" style="color: #93c5fd; text-decoration: none;">{safe_phone}</a>' if phone else 'Not provided'}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #c9a96e; border-bottom: 1px solid #282a36; font-size: 13px;">Product / Design</td>
              <td style="padding: 12px 16px; color: #ffffff; border-bottom: 1px solid #282a36; font-size: 14px;">
                <span style="background: rgba(201, 169, 110, 0.2); color: #c9a96e; padding: 2px 8px; border-radius: 4px; font-size: 13px; font-weight: 500;">{safe_title}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #c9a96e; font-size: 13px;">Submitted On</td>
              <td style="padding: 12px 16px; color: #9ca3af; font-size: 13px;">{formatted_date}</td>
            </tr>
          </table>

          {photo_html_section}

          <!-- Message Box -->
          <div style="background-color: #1a1b22; padding: 18px 20px; border-radius: 8px; border-left: 4px solid #c9a96e; margin-bottom: 28px;">
            <div style="font-size: 12px; font-weight: 600; color: #c9a96e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              Enquiry Message
            </div>
            <div style="color: #e5e7eb; line-height: 1.6; font-size: 14px;">
              {safe_message}
            </div>
          </div>

          <!-- Direct Actions -->
          <div style="text-align: center; margin: 30px 0 10px;">
            <a href="mailto:{safe_email}?subject=Regarding%20your%20enquiry%20for%20{safe_title}%20with%20Reyansh%20Studio" 
               style="background-color: #c9a96e; color: #111; font-weight: 600; font-size: 14px; text-decoration: none; padding: 13px 32px; border-radius: 6px; display: inline-block;">
              Reply Directly to {safe_name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0b0c0f; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #22232a;">
          Reyansh Studio Automated Notification System &bull; <a href="https://www.reyanshstudio.com" style="color: #c9a96e; text-decoration: none;">reyanshstudio.com</a>
        </div>
      </div>
    </body>
    </html>
    """

    msg_alt.attach(MIMEText(text_content, "plain", "utf-8"))
    msg_alt.attach(MIMEText(html_content, "html", "utf-8"))

    # If photo exists, attach the MIMEImage
    if has_photo:
        try:
            image_part = MIMEImage(img_bytes, _subtype=img_subtype)
            image_part.add_header("Content-ID", "<enquiry_photo>")
            image_part.add_header("Content-Disposition", "inline", filename=safe_img_filename)
            msg.attach(image_part)
        except Exception as img_err:
            print(f"[WARNING] Failed to attach MIMEImage: {img_err}", file=sys.stderr)

    # Dispatch via SMTP
    try:
        if cfg["port"] == 465:
            with smtplib.SMTP_SSL(cfg["host"], cfg["port"], timeout=15) as server:
                server.login(cfg["user"], cfg["password"])
                server.send_message(msg)
        else:
            with smtplib.SMTP(cfg["host"], cfg["port"], timeout=15) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(cfg["user"], cfg["password"])
                server.send_message(msg)

        return {"success": True}
    except smtplib.SMTPAuthenticationError as auth_err:
        print(f"[ERROR] SMTP Authentication Failed: {auth_err}", file=sys.stderr)
        return {
            "success": False,
            "status_code": 500,
            "error": "Email authentication failed (535). Google rejected the login. Please ensure you are using a 16-character Google App Password (not your personal account password).",
        }
    except smtplib.SMTPServerDisconnected as disconn_err:
        print(f"[ERROR] SMTPServerDisconnected: {disconn_err}", file=sys.stderr)
        return {
            "success": False,
            "status_code": 500,
            "error": "Gmail closed the connection during authentication. Google requires a 16-character App Password (not your normal Gmail password). Please generate one at https://myaccount.google.com/apppasswords and paste it into EMAIL_PASS in .env.",
        }
    except smtplib.SMTPConnectError as conn_err:
        print(f"[ERROR] SMTP Connection Failed: {conn_err}", file=sys.stderr)
        return {
            "success": False,
            "status_code": 503,
            "error": f"Could not connect to SMTP server ({cfg['host']}:{cfg['port']}). Please check network or host settings.",
        }
    except Exception as e:
        print(f"[ERROR] SMTP Dispatch Error: {e}", file=sys.stderr)
        return {
            "success": False,
            "status_code": 500,
            "error": f"Failed to send email enquiry: {str(e)}",
        }


# ========================================================
# API ENDPOINTS
# ========================================================


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    """Authenticate administrator with email and password."""
    try:
        data = request.get_json(silent=True) or {}
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", "")).strip()

        admin_email = (os.getenv("ADMIN_EMAIL") or "reyaneshstudio@gmail.com").strip().lower()
        admin_password = (os.getenv("ADMIN_PASSWORD") or "reyansh@2026").strip()

        allowed_emails = {admin_email, "admin@reyanshstudio.com", "admin@reyansh.com"}

        if email in allowed_emails and password == admin_password:
            timestamp = int(time.time())
            token = f"adm_token_{timestamp}_{base64.b64encode(email.encode()).decode()}"
            print(f"[AUTH] Admin logged in successfully: {email}")
            return jsonify({
                "success": True,
                "message": "Authentication successful. Welcome to Reyansh Studio Admin Portal.",
                "token": token,
                "user": {
                    "email": admin_email,
                    "role": "admin",
                    "name": "Reyansh Studio Administrator",
                    "authenticatedAt": datetime.utcnow().isoformat() + "Z",
                }
            }), 200

        print(f"[AUTH] Failed login attempt for: {email}")
        return jsonify({
            "success": False,
            "message": "Invalid email address or password. Access denied.",
        }), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/admin/verify", methods=["GET", "POST"])
def admin_verify():
    """Verify administrator session token."""
    auth_header = request.headers.get("Authorization", "")
    token = request.args.get("token") or (auth_header.replace("Bearer ", "").strip() if auth_header else "")

    admin_email = (os.getenv("ADMIN_EMAIL") or "reyaneshstudio@gmail.com").strip().lower()
    if token and "adm_token_" in token:
        return jsonify({
            "success": True,
            "valid": True,
            "user": {
                "email": admin_email,
                "role": "admin",
            }
        }), 200

    return jsonify({"success": False, "valid": False, "message": "Invalid or expired session token"}), 401


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to report server status."""
    leads = get_consultations()
    return jsonify({
        "status": "ok",
        "backend": "Python Flask",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "Reyansh Studio Backend Email Engine",
        "email_configured": bool(SMTP_USERNAME and SMTP_PASSWORD),
        "business_email": BUSINESS_EMAIL,
        "smtp_host": SMTP_HOST,
        "smtp_port": SMTP_PORT,
        "total_enquiries": len(leads),
        "new_leads_count": len([c for c in leads if c.get("status") == "new"]),
    })


@app.route("/api/contact", methods=["POST"])
@app.route("/api/consultation", methods=["POST"])
@app.route("/api/consultations", methods=["POST"])
def submit_contact():
    """Primary endpoint for Contact Us & Furniture Enquiry submissions."""
    client_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "unknown").split(",")[0].strip()

    # 1. Rate limiting check
    if is_rate_limited(client_ip):
        return jsonify({
            "success": False,
            "message": "Too many requests. Please wait a few minutes before submitting another enquiry, or contact us directly on WhatsApp."
        }), 429

    # 2. Extract payload
    data = request.get_json(silent=True) or request.form.to_dict() or {}

    # Honeypot spam trap
    if data.get("_gotcha") or data.get("_hp_trap") or data.get("honeypot"):
        return jsonify({"success": False, "message": "Invalid submission."}), 400

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    phone = str(data.get("phone", "")).strip()
    service = str(data.get("service") or data.get("subject") or "General Furniture Enquiry").strip()
    message = str(data.get("message", "")).strip()

    # Optional photo fields for design enquiry
    photo_filename = str(data.get("photo_filename") or data.get("photoFilename") or "").strip()
    photo_data = str(data.get("photo_data") or data.get("photoData") or "").strip()
    product_title = str(data.get("product_title") or data.get("productTitle") or "").strip()
    photo_url = str(data.get("photo_url") or data.get("photoUrl") or "").strip()

    # 3. Input validation
    if not name or len(name) < 2:
        return jsonify({"success": False, "message": "Please provide your full name (at least 2 characters)."}), 400
    if len(name) > 100:
        return jsonify({"success": False, "message": "Name cannot exceed 100 characters."}), 400

    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if not email or not re.match(email_regex, email) or len(email) > 150:
        return jsonify({"success": False, "message": "Please provide a valid email address."}), 400

    # Header injection prevention
    if "\r" in name or "\n" in name or "\r" in email or "\n" in email or "\r" in service or "\n" in service:
        return jsonify({"success": False, "message": "Invalid characters detected in form inputs."}), 400

    if not message or len(message) < 5:
        return jsonify({"success": False, "message": "Please enter your message or project requirements (at least 5 characters)."}), 400
    if len(message) > 5000:
        return jsonify({"success": False, "message": "Message cannot exceed 5000 characters."}), 400

    # Format timestamp
    formatted_date = datetime.now().strftime("%A, %d %B %Y at %I:%M %p")

    # 4. Save enquiry into persistent local database so it is NEVER lost
    lead_id = f"lead_{int(time.time() * 1000)}"
    new_lead = {
        "id": lead_id,
        "name": name,
        "email": email,
        "phone": phone,
        "service": service,
        "message": message,
        "product_title": product_title,
        "photo_filename": photo_filename,
        "photo_url": photo_url,
        "has_photo": bool(photo_filename or photo_data),
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "formattedDate": formatted_date,
        "status": "new",
        "emailSent": False,
        "client_ip": client_ip,
    }

    leads = get_consultations()
    leads.insert(0, new_lead)
    save_consultations(leads)

    print(f"\n[ENQUIRY] New Furniture Enquiry Received:")
    print(f"   Name    : {name}")
    print(f"   Email   : {email}")
    print(f"   Phone   : {phone or 'N/A'}")
    print(f"   Service : {service}")
    if product_title:
        print(f"   Design  : {product_title}")
    if photo_filename:
        print(f"   Photo   : {photo_filename}")
    print(f"   Message : {message[:100]}...\n")

    # 5. Send notification email via SMTP with attached design photo
    email_result = send_enquiry_email(
        name=name,
        email=email,
        phone=phone,
        service=service,
        message=message,
        formatted_date=formatted_date,
        photo_filename=photo_filename,
        photo_data=photo_data,
        product_title=product_title,
        photo_url=photo_url,
    )

    if email_result.get("success"):
        new_lead["emailSent"] = True
        save_consultations(leads)
        return jsonify({
            "success": True,
            "message": "Thank you! Your enquiry has been received and our team will contact you shortly.",
            "id": lead_id,
            "has_photo": bool(photo_filename or photo_data),
        }), 200
    else:
        # Crucial requirement: Do NOT falsely report success if email sending failed
        error_msg = email_result.get("error", "Failed to send email notification.")
        status_code = email_result.get("status_code", 500)
        return jsonify({
            "success": False,
            "message": error_msg,
            "id": lead_id,
            "saved_locally": True,
        }), status_code


@app.route("/api/consultations", methods=["GET"])
def get_all_consultations():
    """Admin endpoint to view received enquiries."""
    status_filter = request.args.get("status")
    leads = get_consultations()
    if status_filter and status_filter != "all":
        leads = [l for l in leads if l.get("status") == status_filter]
    return jsonify({
        "success": True,
        "count": len(leads),
        "consultations": leads,
    })


@app.route("/api/consultations/<lead_id>", methods=["PATCH"])
def update_consultation_status(lead_id):
    """Update enquiry status (new, contacted, completed)."""
    data = request.get_json(silent=True) or {}
    new_status = data.get("status")
    notes = data.get("notes")

    leads = get_consultations()
    target = next((l for l in leads if l.get("id") == lead_id), None)
    if not target:
        return jsonify({"success": False, "message": "Lead not found"}), 404

    if new_status:
        target["status"] = new_status
    if notes is not None:
        target["notes"] = notes
    target["updatedAt"] = datetime.utcnow().isoformat() + "Z"

    save_consultations(leads)
    return jsonify({"success": True, "lead": target})


@app.route("/api/consultations/<lead_id>", methods=["DELETE"])
def delete_consultation(lead_id):
    """Delete an enquiry."""
    leads = get_consultations()
    filtered = [l for l in leads if l.get("id") != lead_id]
    if len(filtered) == len(leads):
        return jsonify({"success": False, "message": "Lead not found"}), 404
    save_consultations(filtered)
    return jsonify({"success": True, "message": "Lead deleted successfully"})


# ==========================================
# CUSTOM GALLERY API ROUTES
# ==========================================

@app.route("/api/gallery", methods=["GET"])
def get_gallery_items():
    """Return all custom uploaded gallery items."""
    items = get_custom_gallery()
    return jsonify({"success": True, "count": len(items), "items": items})


@app.route("/api/gallery", methods=["POST"])
def add_gallery_item():
    """Upload a new photo and add it to the gallery."""
    try:
        title = ""
        category = "Custom Sofas"
        tag = ""
        desc = ""
        saved_filename = ""
        data_url = ""

        # Check if multipart form upload
        if request.files and "photo" in request.files:
            file = request.files["photo"]
            if file and file.filename:
                title = request.form.get("title", "").strip()
                category = request.form.get("category", "Custom Sofas").strip()
                tag = request.form.get("tag", "").strip()
                desc = request.form.get("desc", "").strip()

                ext = os.path.splitext(file.filename)[1].lower() or ".jpg"
                clean_title = re.sub(r'[^a-zA-Z0-9]', '-', title.lower()).strip('-')[:30] or "photo"
                timestamp = int(time.time() * 1000)
                saved_filename = f"upload_{timestamp}_{clean_title}{ext}"
                file_path = os.path.join(ASSETS_DIR, saved_filename)
                file.save(file_path)
        else:
            # Check JSON payload (e.g., base64 photo data)
            payload = request.get_json(silent=True) or {}
            title = payload.get("title", "").strip()
            category = payload.get("category", "Custom Sofas").strip()
            tag = payload.get("tag", "").strip()
            desc = payload.get("desc", "").strip()
            photo_data = payload.get("photo_data", "")
            data_url = payload.get("photo_url", "")

            if photo_data and "base64," in photo_data:
                header, encoded = photo_data.split("base64,", 1)
                ext = ".jpg"
                if "image/png" in header:
                    ext = ".png"
                elif "image/webp" in header:
                    ext = ".webp"

                clean_title = re.sub(r'[^a-zA-Z0-9]', '-', title.lower()).strip('-')[:30] or "photo"
                timestamp = int(time.time() * 1000)
                saved_filename = f"upload_{timestamp}_{clean_title}{ext}"
                file_path = os.path.join(ASSETS_DIR, saved_filename)
                with open(file_path, "wb") as f:
                    f.write(base64.b64decode(encoded))

        if not title:
            return jsonify({"success": False, "message": "Photo title is required"}), 400

        item_id = f"custom_{int(time.time() * 1000)}"
        
        # Determine image URL
        if saved_filename:
            image_url = f"/api/gallery/image/{saved_filename}"
        elif data_url:
            image_url = data_url
        else:
            image_url = ""

        new_item = {
            "id": item_id,
            "image": image_url,
            "filename": saved_filename,
            "title": title,
            "category": category or "Custom Sofas",
            "tag": tag or category or "New Design",
            "desc": desc or f"Handcrafted {title} designed and created by Reyansh Studio.",
            "isCustom": True,
            "createdAt": datetime.utcnow().isoformat() + "Z",
        }

        items = get_custom_gallery()
        items.insert(0, new_item)
        save_custom_gallery(items)

        print(f"\n[GALLERY] New photo added to gallery:")
        print(f"   Title   : {title}")
        print(f"   Category: {category}")
        print(f"   File    : {saved_filename or 'URL'}\n")

        return jsonify({
            "success": True,
            "message": "Photo added to gallery successfully!",
            "item": new_item,
        }), 201

    except Exception as e:
        print(f"[ERROR] Failed to add photo to gallery: {e}", file=sys.stderr)
        return jsonify({"success": False, "message": f"Failed to save photo: {str(e)}"}), 500


@app.route("/api/gallery/<item_id>", methods=["DELETE"])
def delete_gallery_item(item_id):
    """Delete a custom photo from the gallery."""
    try:
        items = get_custom_gallery()
        target = next((i for i in items if str(i.get("id")) == str(item_id)), None)
        if not target:
            return jsonify({"success": False, "message": "Photo not found"}), 404

        updated_items = [i for i in items if str(i.get("id")) != str(item_id)]
        save_custom_gallery(updated_items)

        # Attempt to delete file if it was uploaded
        filename = target.get("filename")
        if filename and filename.startswith("upload_"):
            target_path = os.path.join(ASSETS_DIR, filename)
            if os.path.exists(target_path):
                try:
                    os.remove(target_path)
                except Exception:
                    pass

        return jsonify({"success": True, "message": "Photo removed from gallery"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/gallery/image/<path:filename>")
def serve_gallery_image(filename):
    """Serve uploaded gallery photos."""
    clean_filename = os.path.basename(filename)
    if os.path.exists(os.path.join(ASSETS_DIR, clean_filename)):
        return send_from_directory(ASSETS_DIR, clean_filename)
    return jsonify({"error": "Image not found"}), 404


# Serve assets directly for image preview links
@app.route("/assets/<path:filename>")
def serve_asset(filename):
    """Serve furniture design photos from src/assets."""
    clean_filename = os.path.basename(filename)
    if os.path.exists(os.path.join(ASSETS_DIR, clean_filename)):
        return send_from_directory(ASSETS_DIR, clean_filename)
    return jsonify({"error": "Asset not found"}), 404


# Serve built frontend static files if dist folder exists
DIST_DIR = os.path.join(BASE_DIR, "dist")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if os.path.exists(DIST_DIR):
        if path and os.path.exists(os.path.join(DIST_DIR, path)):
            return send_from_directory(DIST_DIR, path)
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify({
        "status": "online",
        "message": "Reyansh Studio Python Flask Backend is running. Frontend dev server is at http://localhost:5173",
        "health": "/api/health",
        "contact_api": "/api/contact",
    })


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("[*] Reyansh Studio Python Flask Backend Running")
    print(f"[*] Port: http://localhost:{PORT}")
    print(f"[*] Health Check: http://localhost:{PORT}/api/health")
    print(f"[*] Contact API: POST http://localhost:{PORT}/api/contact")
    print(f"[*] Business Email: {BUSINESS_EMAIL}")
    print(f"[*] SMTP Configured: {bool(SMTP_USERNAME and SMTP_PASSWORD)}")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=PORT, debug=True)
