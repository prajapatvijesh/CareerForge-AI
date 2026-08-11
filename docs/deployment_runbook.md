# Deployment Runbook

This document outlines the standard operating procedure for deploying CareerForge AI to a production environment.

**Disclaimer:** CareerForge AI supports any standard Node.js and static hosting infrastructure (e.g., AWS, Vercel, Render, Railway, DigitalOcean). The steps below are generic and provider-agnostic.

---

## 1. Pre-Deployment Checklist

Before initiating a deployment, execute the following locally to ensure build integrity:

```bash
# 1. Ensure all dependencies are fresh
pnpm install

# 2. Run TypeScript compiler check
pnpm run typecheck

# 3. Run Linter
pnpm run lint

# 4. Perform a local production build
pnpm run build
```

If any step fails, **halt the deployment** and resolve the issues.

---

## 2. Infrastructure Configuration

### MongoDB Configuration
1. Provision a MongoDB cluster (e.g., MongoDB Atlas).
2. Ensure network access (IP Whitelist) permits connections from your backend hosting provider.
3. Obtain the connection string.

### Environment Variables
Inject the following variables securely into your backend and frontend hosting platforms (do NOT use `.env` files in production deployments unless running bare-metal/Docker).

**Backend (e.g., Render/Railway/AWS Secrets):**
```text
NODE_ENV=production
PORT=5000
MONGODB_URI=<production_mongodb_connection_string>
JWT_SECRET=<64_char_random_hex_string>
JWT_REFRESH_SECRET=<64_char_random_hex_string>
FRONTEND_URL=https://careerforge.ai
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
GEMINI_API_KEY=<production_gemini_key>
GEMINI_MODEL=gemini-1.5-pro # Or preferred production model
AI_PROVIDER=gemini
RAZORPAY_KEY_ID=<live_razorpay_key_id>
RAZORPAY_KEY_SECRET=<live_razorpay_key_secret>
RAZORPAY_PRO_PLAN_ID=<live_pro_plan_id>
RAZORPAY_WEBHOOK_SECRET=<live_webhook_secret>
```

**Frontend (e.g., Vercel/Netlify):**
```text
VITE_API_URL=https://api.careerforge.ai/api/v1
VITE_RAZORPAY_KEY_ID=<live_razorpay_key_id>
```

---

## 3. Webhook Configuration (Razorpay)
1. Navigate to the Razorpay Dashboard -> Webhooks.
2. Add a new webhook.
3. Webhook URL: `https://api.careerforge.ai/api/v1/billing/webhook`
4. Secret: Paste the identical string used for `RAZORPAY_WEBHOOK_SECRET`.
5. Active Events:
   - `subscription.charged`
   - `subscription.halted`
   - `subscription.cancelled`

---

## 4. Backend Deployment
1. Connect your backend hosting provider to the `main` branch.
2. Set the build command:
   ```bash
   pnpm install && pnpm build --filter api
   ```
3. Set the start command:
   ```bash
   pnpm start --filter api
   ```
4. Deploy the backend.

---

## 5. Frontend Deployment
1. Connect your frontend hosting provider to the `main` branch.
2. Ensure the Framework Preset is set to **Vite**.
3. Set the build command:
   ```bash
   pnpm install && pnpm build --filter web
   ```
4. Output directory: `apps/web/dist`
5. Deploy the frontend.

---

## 6. Health Checks & Smoke Tests

Once both deployments finish, perform the following verifications:

1. **Backend Health:** Navigate to `https://api.careerforge.ai/api/v1/health`
   - Expected response: `200 OK` `{"status":"ok"}`
2. **Frontend Load:** Navigate to `https://careerforge.ai`.
   - Ensure no console errors appear.
3. **Authentication:** Register a test account.
4. **Subscription Bypass:** Attempt to access a PRO feature (e.g., Unlimited Mock Interviews) and ensure it displays the pricing modal.
5. **AI Connectivity:** Start a conversation with the Career Assistant to verify the Gemini API key is functional.

---

## 7. Rollback Procedure

If the deployment introduces severe regressions (e.g., API 500s on login):
1. Navigate to your hosting provider's dashboard.
2. Select the previous successful deployment.
3. Click **"Rollback"** or **"Redeploy"** on the previous commit.
4. Verify the application stabilizes.
5. Investigate the failure locally before attempting a new deployment.
