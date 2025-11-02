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

# Email (Resend - 推荐)
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=My Gantt
FEEDBACK_EMAIL=f.shera.09@gmail.com
```

