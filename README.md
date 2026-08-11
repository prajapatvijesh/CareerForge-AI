# CareerForge AI

CareerForge AI is a comprehensive, production-ready SaaS platform designed to assist users in their career journeys. It leverages advanced Artificial Intelligence (Google Gemini) to provide personalized career coaching, resume analysis, mock interviews, and job tracking. The platform operates on a freemium model with Razorpay integrated for PRO subscription billing.

## Main Features

- **Advanced Authentication**: JWT-based authentication with robust security (HTTP-only cookies, suspension enforcement, mass-assignment protection).
- **Profile Management**: Detailed user career profiles containing skills, education, experience, and projects.
- **Resume Builder & Analysis**: Interactive resume builder with AI-powered ATS scoring, keyword analysis, and actionable improvement suggestions.
- **Job Tracker**: Kanban-style job application tracking with status, salary, and interview tracking.
- **AI Mock Interviews**: Dynamic, AI-generated technical and behavioral mock interviews with detailed feedback and scoring.
- **Career Assistant (AI Chat)**: Context-aware AI career coach that utilizes the user's profile and resume data to provide personalized advice.
- **Subscription & Billing**: Tiered access (FREE/PRO) with usage limits, powered by Razorpay subscriptions and secure webhook processing.
- **Admin Panel**: Comprehensive administrative dashboard for managing users, monitoring AI usage, reviewing billing transactions, and tracking system health.

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui, React Router, Redux Toolkit, TanStack Query, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Pino, Zod.
- **AI Integration**: Google Gemini API (`@google/genai`).
- **Billing Integration**: Razorpay API.
- **Tools**: pnpm (monorepo), Docker, GitHub Actions.

## Monorepo Structure

CareerForge AI utilizes a `pnpm` workspace monorepo to separate concerns while allowing for shared tooling.

- `apps/api/`: Express/TypeScript backend API.
- `apps/web/`: React/Vite frontend application.
- `docs/`: Comprehensive project documentation.

## Architecture Overview

### Backend Architecture
Follows a strict **Clean Architecture** pattern:
- **Routes**: Define HTTP endpoints and apply middleware (auth, validation, rate limiting).
- **Controllers**: Handle HTTP requests/responses and extract parameters.
- **Services**: Contain the core business logic.
- **Repositories**: Handle all direct database interactions with MongoDB (Mongoose).

### Frontend Architecture
Follows a **Feature-Based Architecture**:
- Features are encapsulated in `apps/web/src/features/` (e.g., `auth`, `resume-builder`, `admin`).
- Each feature contains its own `components`, `pages`, `hooks`, `store`, and `api` logic.
- Routing utilizes `React.lazy()` for aggressive code-splitting and performance optimization.

### AI Architecture
- **Gemini Provider**: Uses `@google/genai` to communicate with Google's Gemini models.
- **Resilience**: Implements exponential backoff, automated retries, and strict timeouts (via `withRetry`).
- **Telemetry**: Records prompt/completion tokens, latency, and estimated costs in MongoDB for administrative monitoring.

### Subscription & Usage Architecture
- **Usage Limits**: Free and Pro users have distinct feature limits (e.g., mock interviews per month).
- **Atomic Operations**: Usage limits are enforced using atomic MongoDB `findOneAndUpdate` operations, strictly preventing Time-of-Check to Time-of-Use (TOCTOU) race conditions.

### Billing Architecture
- **Razorpay**: Handles recurring subscriptions.
- **Webhooks**: Subscriptions are exclusively activated or deactivated via secure backend webhook processing.
- **Idempotency**: Webhook events are hashed and stored to prevent duplicate processing of the same event.
- **Security**: Strict cryptographic signature verification (`crypto.timingSafeEqual`) ensures authenticity.

### Admin Architecture
- Dedicated, role-protected routes (`/api/v1/admin`) and a separate frontend layout.
- Provides extensive aggregate analytics for revenue, AI usage, and user growth.
- Includes a robust audit log for tracking administrative actions.

## Local Development Setup

### Prerequisites
- Node.js >= 22
- pnpm >= 9
- MongoDB instance (local or Atlas)
- Razorpay Test Account
- Google Gemini API Key

### Installation

1. Install dependencies across the monorepo:
   ```bash
   pnpm install
   ```

2. Environment Configuration:
   - Copy `apps/api/.env.example` to `apps/api/.env` and populate the required secrets.
   - Copy `apps/web/.env.example` to `apps/web/.env` and populate the required frontend variables.
   - **Important**: See the [Environment Configuration](#environment-configuration) section below.

### Development Commands

Start both the frontend and backend concurrently in development mode:
```bash
pnpm run dev
```

### Typecheck, Lint, and Build

The monorepo provides scripts to validate the entire codebase:

- **Typecheck**:
  ```bash
  pnpm run typecheck
  ```
- **Lint**:
  ```bash
  pnpm run lint
  ```
- **Build**:
  ```bash
  pnpm run build
  ```

### Testing
*(If automated tests are configured, run them via `pnpm run test`. Manual QA and regression testing should follow the provided checklists in the `docs/` directory.)*

## Environment Configuration

Strict validation (using Zod) is enforced on application startup for both the frontend and backend.

### Backend (`apps/api/.env`)
Contains sensitive credentials that must **never** be committed or exposed to the client.
- `MONGODB_URI`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `GEMINI_API_KEY`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

### Frontend (`apps/web/.env`)
Contains public configuration safe for the browser.
- `VITE_API_URL`
- `VITE_RAZORPAY_KEY_ID`

## Security Considerations

CareerForge AI has undergone rigorous security hardening:
- **No Hardcoded Secrets**: Secrets are exclusively managed via `.env` files.
- **Strict Validation**: All API inputs are validated and stripped of unexpected fields using Zod to prevent mass-assignment attacks.
- **Rate Limiting**: Tiered rate limiting protects against DoS and brute-force credential stuffing.
- **IDOR Prevention**: All database queries strictly scope document access by `userId`.
- **Log Redaction**: Pino logger is configured to redact sensitive headers, cookies, and passwords from production logs.
- **CORS & Helmet**: Secure HTTP headers and explicit CORS origins are enforced.

For detailed security policies and implementation details, please see `docs/security.md`.

---
*For comprehensive documentation regarding APIs, Architecture, Deployment, and Incident Response, please refer to the `docs/` directory.*
