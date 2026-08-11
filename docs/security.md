# CareerForge AI - Security Architecture

This document details the security mitigations, architectures, and hardening practices implemented across the CareerForge AI monorepo.

---

## Authentication & Session Management

- **JWT Authentication**: The application utilizes JSON Web Tokens for stateless authentication.
- **HTTP-Only Cookies**: JWT Access and Refresh tokens are exclusively transmitted via HTTP-Only, Secure, `SameSite=Strict` cookies. They are strictly inaccessible to client-side JavaScript, eliminating XSS token theft vectors.
- **Role-Based Access Control (RBAC)**: All administrative endpoints are guarded by a `requireAdmin` middleware that strictly checks `req.user.role === 'ADMIN'`.
- **Suspended User Protection**: The `requireAuth` middleware and login/refresh services actively verify the `status` of a user. If a user is marked `SUSPENDED` by an administrator, their active tokens are immediately invalidated across the system (`403 Forbidden`).

---

## Authorization & Data Integrity

- **Insecure Direct Object Reference (IDOR) Prevention**: Every repository method retrieving, updating, or deleting sensitive data (Resumes, Job Applications, Interviews, Profiles) strictly scopes the MongoDB query using the authenticated `userId` (e.g., `Resume.find({ _id, userId })`). It is mathematically impossible for a user to access another user's documents.
- **Mass-Assignment Protection**: Input validation utilizes strict `Zod` schemas. The `validateRequest` middleware actively overrides `req.body`, `req.query`, and `req.params` with the *parsed and stripped* Zod object, discarding any malicious or unexpected properties sent by the client.

---

## Denial of Service (DoS) & Abuse Protection

- **Global Rate Limiting**: The Express API enforces a global limit of 1000 requests per 15 minutes per IP to absorb legitimate traffic spikes (like autosaving resumes) while dropping malicious traffic floods.
- **Authentication Rate Limiting**: A highly restrictive `authLimiter` limits `/api/v1/auth/login` and `/api/v1/auth/register` to 10 attempts per 15 minutes to defeat brute-force credential stuffing attacks.
- **Request Size Limiting**: `express.json` and `express.urlencoded` are strictly capped at `5mb` to prevent large payload memory exhaustion attacks.
- **Usage Limit Enforcement**: Free-tier feature limits (e.g., number of Mock Interviews) are strictly enforced. To prevent concurrency bypass (Time-of-Check to Time-of-Use), usage is incremented via a single atomic MongoDB operation (`findOneAndUpdate` with a boundary condition).

---

## External Integration Security

### Gemini API
- **Timeout Protection**: The `withRetry` wrapper strictly bounds LLM API connections to 15 seconds. If the Google GenAI API hangs, the backend fails fast, freeing up the thread instead of causing connection pooling exhaustion.
- **API Key Protection**: The API key is securely managed via `GEMINI_API_KEY` and never exposed to the frontend browser.

### Razorpay Billing
- **Signature Verification**: Webhooks and checkout success callbacks are cryptographically verified using `crypto.timingSafeEqual`. This prevents timing attacks against the signature comparison loop.
- **Idempotency**: Webhook payloads are hashed using SHA-256 and stored in the database. Duplicate webhook deliveries from Razorpay are instantly identified and dropped.
- **Plan Spoofing Protection**: The webhook handler strictly asserts that the Razorpay `plan_id` in the webhook matches the expected `RAZORPAY_PRO_PLAN_ID`, entirely preventing users from subscribing to an unauthorized cheaper plan.

---

## Infrastructure Security

- **Environment Secrets**: Secrets are verified synchronously on server boot using Zod (`src/config/env.ts`). The server will crash and refuse to start if production secrets are missing or fall back to insecure defaults.
- **Log Redaction**: The Pino HTTP logger is configured to aggressively redact sensitive properties. Properties such as `req.headers.authorization`, `req.headers.cookie`, `res.headers["set-cookie"]`, `body.password`, and `body.token` are replaced with `[REDACTED]`.
- **CORS Configuration**: Cross-Origin Resource Sharing is strictly pinned to the `FRONTEND_URL` environment variable.
- **Security Headers**: `Helmet.js` is employed globally to enforce HSTS, prevent MIME-sniffing, block clickjacking (X-Frame-Options), and harden XSS protections.

---

## Critical Repository Hygiene

The following files or contents must **NEVER** be committed to version control:
- `.env`
- `.env.local`
- `.env.production`
- AWS Credentials / Private Keys
- Database Dumps
- Logs containing raw unredacted data

*An automated credential sweep is recommended before every production release to ensure no API keys or MongoDB URIs have been accidentally hardcoded.*
