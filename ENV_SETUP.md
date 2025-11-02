# Backend Environment Variables

Copy this file to `.env` and fill in your values.

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5174

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/my_gantt?schema=public"

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT
JWT_SECRET=your-jwt-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for feedback feature)
# Option 1: Use Gmail (recommended for development)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Option 2: Use custom SMTP server
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-smtp-username
# SMTP_PASS=your-smtp-password

# Feedback email recipient
FEEDBACK_EMAIL=f.shera.09@gmail.com

# Email sender (optional, defaults to GMAIL_USER or SMTP_USER)
# EMAIL_FROM="My Gantt App <noreply@example.com>"
```

## Email Setup Instructions

### Option 1: Gmail Setup (Recommended for Development)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Generate a new app password for "Mail"
5. Copy the generated password and use it as `GMAIL_APP_PASSWORD`

### Option 2: Custom SMTP Setup

Configure your SMTP server details:
- `SMTP_HOST`: Your SMTP server hostname
- `SMTP_PORT`: SMTP port (usually 587 for TLS, 465 for SSL)
- `SMTP_SECURE`: Set to `true` for SSL (port 465), `false` for TLS (port 587)
- `SMTP_USER`: Your SMTP username
- `SMTP_PASS`: Your SMTP password
