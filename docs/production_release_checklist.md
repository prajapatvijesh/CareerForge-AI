# Production Release Checklist

Before performing a production deployment of CareerForge AI, ensure every item on this checklist is strictly verified. Do **NOT** proceed with deployment until all boxes are checked.

## 1. Backend Configuration
- [ ] **Production MongoDB Isolated:** Verified that `MONGODB_URI` points to a secure, production-isolated database (e.g. MongoDB Atlas cluster) and NOT a local or staging database.
- [ ] **Strong JWT Secrets Configured:** Verified `JWT_SECRET` and `JWT_REFRESH_SECRET` are securely generated, highly entropic (e.g. 64-character random strings), and stored securely in the production environment.
- [ ] **Gemini Production API Key:** Verified `GEMINI_API_KEY` is a valid production key and `AI_PROVIDER` is set to `gemini` (not `mock`).
- [ ] **Razorpay Production Credentials:** Verified `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are Live Mode credentials (not Test Mode).
- [ ] **Razorpay Webhook Secret:** Verified `RAZORPAY_WEBHOOK_SECRET` exactly matches the secret configured in the Razorpay Dashboard Webhook settings.
- [ ] **CORS Production Origin:** Verified `FRONTEND_URL` is set to the exact production domain (e.g. `https://careerforge.ai`) without trailing slashes.
- [ ] **Secure Cookies Enabled:** Verified that the environment is accessed via HTTPS so that `Secure` cookies function correctly.
- [ ] **Rate Limits Reviewed:** Verified the global rate limit (1000 req/15m) and auth rate limit (10 req/15m) are appropriate for the expected production traffic.
- [ ] **Logging Configured:** Verified `NODE_ENV=production` is set, ensuring Pino logger correctly redacts sensitive data and outputs in a JSON structure suitable for log aggregators (e.g. Datadog, CloudWatch).
- [ ] **Health Checks Verified:** Verified `/api/v1/health` and `/api/v1/admin/system` are operational and reporting healthy status for MongoDB and providers.

## 2. Frontend Configuration
- [ ] **Production API URL Configured:** Verified `VITE_API_URL` points directly to the production backend (e.g. `https://api.careerforge.ai/api/v1`).
- [ ] **Razorpay Public Key Configured:** Verified `VITE_RAZORPAY_KEY_ID` contains the Live Mode public key.
- [ ] **No Backend Secrets Exposed:** Verified `apps/web/.env.production` does NOT contain any variables without the `VITE_` prefix (especially MongoDB URIs or JWT secrets).
- [ ] **Production Build Successful:** Verified `pnpm run build` succeeds locally with zero TypeScript or Vite errors.

## 3. Database Readiness
- [ ] **Production Database Provisioned:** Database provisioned with appropriate RAM and Storage.
- [ ] **Required Indexes Verified:** Verified Mongoose compound indexes exist (e.g. `{ userId: 1, status: 1, updatedAt: -1 }` on `resumes`).
- [ ] **Backup Strategy Configured:** Verified automated point-in-time backups are enabled on the database cluster.
- [ ] **Restore Procedure Tested:** Verified the team understands how to perform a database restoration.

## 4. Security
- [ ] **Secret Scan Completed:** Verified no secrets or private keys were accidentally committed to the `main` branch.
- [ ] **`.env` Ignored:** Verified `.env` and `.env.production` are strictly present in `.gitignore`.
- [ ] **Admin Access Verified:** Verified initial administrative accounts are configured or a secure script exists to promote the first user to `ADMIN`.
- [ ] **IDOR Protection Verified:** Code review confirmed that all repository queries enforce `userId` filtering.
- [ ] **Webhook Signature Verification Verified:** Confirmed `crypto.timingSafeEqual` is deployed in the Razorpay provider.
