# Incident Response & Troubleshooting Guide

This document outlines recovery procedures for expected production failure scenarios in CareerForge AI.

---

## 1. Gemini Outage or API Rate Limiting

**Detection**: 
- Users report the AI Career Assistant or Resume Analyzer is spinning indefinitely or returning immediate errors.
- Admin dashboard shows a spike in "AI Errors" or dropped usage telemetry.

**Investigation**:
1. Check the Google Cloud Platform (GCP) status page for GenAI API outages.
2. Check backend logs for `[Retry 3/3] Operation failed: 429 Too Many Requests`.

**Mitigation**:
- If GCP is down, the backend is configured to `fail fast` after 15 seconds (via `withRetry`). No action required to protect the server, but users should be notified via an in-app banner.
- If it is a `429` (Quota Exceeded), immediately log into GCP and request a quota increase for the Gemini API.
- Alternatively, modify the `AI_PROVIDER` environment variable to `mock` in the hosting dashboard. This will gracefully downgrade the AI features to return mock data, keeping the app alive while you resolve the billing/quota issue.

**Recovery & Verification**:
- Once quota is restored or GCP resolves the outage, ensure `AI_PROVIDER=gemini` is active.
- Verify by using the Career Assistant chat in the application.

---

## 2. MongoDB Outage

**Detection**:
- Entire API returns `500 Internal Server Error`.
- Backend logs show `MongoTimeoutError` or `MongoNetworkError`.
- Admin System Health page shows Database as "unhealthy".

**Investigation**:
- Log into MongoDB Atlas and check cluster metrics (CPU, RAM, Connections).

**Mitigation**:
- Mongoose automatically buffers commands and attempts to reconnect. The backend does *not* need to be restarted manually if the database drops briefly.
- If the cluster is overwhelmed by connections, vertically scale the cluster tier immediately.

**Recovery & Verification**:
- Check the backend logs for `MongoDB Connected: ...`.
- Verify the `/api/v1/health` endpoint returns `200 OK`.

---

## 3. Razorpay Webhook Failure

**Detection**:
- Users complete a payment, but their account remains on the FREE plan.
- Razorpay Dashboard shows webhook delivery failures (retrying).

**Investigation**:
- Check backend logs for `Invalid webhook signature` (indicates mismatched `RAZORPAY_WEBHOOK_SECRET`).
- Check backend logs for `Webhook plan_id mismatch` (indicates a user attempting to spoof a subscription).

**Mitigation**:
- Ensure `RAZORPAY_WEBHOOK_SECRET` exactly matches the Razorpay dashboard.
- If the backend was completely offline, Razorpay will automatically retry the webhook for up to 24 hours. No manual intervention is needed for retry.

**Recovery & Verification**:
- If manual intervention is required, you can manually trigger the webhook payload from the Razorpay dashboard "Webhook Retries" section.
- Alternatively, check the Razorpay Dashboard for the user's payment, and manually update their subscription plan in the database.

---

## 4. Unexpected HTTP 500 Errors

**Detection**:
- Users report crashing pages or failed actions.

**Investigation**:
- Filter production logs (e.g. Datadog or AWS CloudWatch) by `level: "error"`.
- Look for stack traces. 
- *Note: Due to Pino redaction, sensitive payload data (passwords, tokens) will not be visible in these logs.*

**Mitigation**:
- Identify the faulting commit.
- Use your hosting provider's one-click "Rollback" feature to deploy the previous stable release.

**Recovery & Verification**:
- Run local regression testing (`pnpm run typecheck`, `pnpm run test`) to reproduce the 500 error.
- Deploy the hotfix only after local verification.
