import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '.env')
print("Reading .env from:", env_path)
print("File exists:", os.path.exists(env_path))

load_dotenv(env_path)

user = os.getenv("SMTP_USERNAME")
pwd = os.getenv("SMTP_PASSWORD")
print("SMTP_USERNAME:", repr(user))
print("SMTP_PASSWORD:", repr(pwd))

import smtplib
try:
    print("Connecting to smtp.gmail.com:587...")
    server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
    server.ehlo()
    server.starttls()
    server.ehlo()
    print("Attempting login...")
    server.login(user, pwd)
    print("LOGIN SUCCESSFUL!")
    server.quit()
except smtplib.SMTPAuthenticationError as e:
    print("SMTPAuthenticationError:", e.smtp_code, e.smtp_error.decode('utf-8', errors='replace'))
except Exception as e:
    print("Error:", type(e).__name__, str(e))
