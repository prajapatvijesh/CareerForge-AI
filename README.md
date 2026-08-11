# 🚀 CareerForge AI

> **AI-powered career management platform that helps users build better resumes, analyze ATS performance, track job applications, practice interviews, and receive personalized career guidance.**

CareerForge AI is a full-stack SaaS platform designed to bring the complete job-search workflow into one place. It combines **AI-powered career tools, resume management, job tracking, mock interviews, subscriptions, billing, and administrative analytics** into a single platform.

---

## ✨ Features

### 👤 Profile Management

* Complete professional profile
* Skills with proficiency levels
* Education and experience
* Projects and achievements
* Career preferences and target roles
* Profile completion tracking

### 📄 Resume Builder

* Create and manage professional resumes
* Structured resume sections
* Resume editing
* Resume history/version support
* Resume data integrated with the user's profile

### 🤖 AI Resume Analysis

* AI-powered resume review
* ATS score
* Keyword analysis
* Missing keywords
* Resume strengths and weaknesses
* Actionable improvement suggestions
* Gemini-powered analysis

### 💼 Job Application Tracker

* Track applications through the complete hiring lifecycle
* Kanban-style application board
* Application status management
* Company and position tracking
* Salary information
* Interview tracking
* Application statistics

### 🎤 AI Mock Interviews

* AI-powered interview practice
* Technical and behavioral interviews
* Question and answer workflow
* Interview evaluation
* Performance scoring
* Weak-area identification
* AI-generated feedback

### 🧠 AI Career Assistant

A personalized AI career guidance system that uses the user's CareerForge data to provide actionable recommendations.

It can help with:

* Career direction
* Skill-gap identification
* Resume improvement
* Job-search strategy
* Interview preparation
* Learning priorities
* Career readiness

### 💳 Subscription & AI Usage Management

* FREE and PRO plans
* Server-side usage enforcement
* Atomic MongoDB usage counters
* Monthly AI usage tracking
* AI token telemetry
* Usage progress indicators
* Automatic limit enforcement
* HTTP 429 handling

### 💰 Razorpay Billing

* Razorpay subscription integration
* Secure checkout verification
* Webhook signature verification
* Payment history
* Subscription cancellation
* Subscription state management
* Webhook idempotency protection

### 👨‍💼 Admin Panel

* Admin-only dashboard
* Platform analytics
* User management
* User suspension
* Revenue analytics
* Subscription analytics
* AI usage analytics
* System health monitoring
* Administrative audit logs

### 🔐 Security

* JWT authentication
* Protected routes
* Role-based authorization
* Admin access control
* IDOR protection
* Zod validation
* Request rate limiting
* Authentication rate limiting
* Secure HTTP-only cookies
* Payload size limits
* Secret redaction in logs
* Razorpay HMAC verification
* Atomic AI usage enforcement

---

## 🏗️ Architecture

CareerForge AI follows a **Clean Architecture + Feature-Based Frontend Architecture**.

```text
CareerForge AI
│
├── apps/
│   │
│   ├── web/                         # React Frontend
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── resume/
│   │   │   ├── resume-analysis/
│   │   │   ├── jobs/
│   │   │   ├── mock-interview/
│   │   │   ├── career-assistant/
│   │   │   ├── subscription/
│   │   │   └── admin/
│   │   │
│   │   ├── components/
│   │   ├── lib/
│   │   └── routes/
│   │
│   └── api/                         # Node.js Backend
│       └── src/
│           ├── modules/
│           │   ├── auth/
│           │   ├── profile/
│           │   ├── resume/
│           │   ├── resume-analysis/
│           │   ├── jobs/
│           │   ├── mock-interview/
│           │   ├── career-assistant/
│           │   ├── subscription/
│           │   ├── billing/
│           │   └── admin/
│           │
│           ├── middlewares/
│           ├── config/
│           ├── utils/
│           └── server.ts
│
├── packages/
│   └── shared/
│
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Backend Request Flow

```text
HTTP Request
     │
     ▼
   Route
     │
     ▼
 Middleware
(Auth / Validation / Authorization / Limits)
     │
     ▼
 Controller
     │
     ▼
 Service
     │
     ▼
 Repository
     │
     ▼
 MongoDB
```

For AI-powered functionality:

```text
Client
  │
  ▼
API Route
  │
  ▼
Subscription Limit Check
  │
  ├── Limit Reached → 429
  │
  ▼
AI Service
  │
  ▼
Gemini Provider
  │
  ▼
Structured AI Response
  │
  ▼
AI Usage Telemetry
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui / Radix UI
* React Router
* TanStack Query
* React Hook Form
* Zod
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* Zod
* JWT
* Pino

### AI

* Google Gemini
* `@google/genai`
* Strategy-based AI provider architecture
* Structured AI responses
* AI usage telemetry
* Retry and timeout handling

### Payments

* Razorpay
* Razorpay Subscriptions
* HMAC-SHA256 signature verification
* Webhook idempotency

### Infrastructure & Development

* pnpm
* Git
* GitHub
* ESLint
* TypeScript
* GitHub Actions-ready architecture

---

## 📊 Core Modules

| Module           | Purpose                             |
| ---------------- | ----------------------------------- |
| Authentication   | Secure user registration and login  |
| Profile          | Professional career profile         |
| Resume           | Resume creation and management      |
| Resume Analysis  | AI-powered ATS analysis             |
| Job Tracker      | Application lifecycle management    |
| Mock Interview   | AI-powered interview practice       |
| Career Assistant | Personalized AI career guidance     |
| Subscription     | FREE/PRO plans and usage limits     |
| Billing          | Razorpay payments and subscriptions |
| Admin            | Platform management and analytics   |

---

## 🔒 Security Architecture

Security is enforced primarily on the backend.

### Authentication

JWT-based authentication with protected API routes and secure cookie handling.

### Authorization

```text
USER
 ├── Own Profile
 ├── Own Resumes
 ├── Own Jobs
 ├── Own Interviews
 └── Own AI Conversations

ADMIN
 └── Platform Administration
```

### IDOR Protection

User-owned resources are scoped using the authenticated user's ID rather than trusting client-provided ownership information.

### AI Usage Protection

AI requests are protected by an atomic MongoDB reservation mechanism:

```text
Request
   │
   ▼
Check Current Plan
   │
   ▼
Atomic findOneAndUpdate()
   │
   ├── Limit Available → Reserve Usage → Gemini
   │
   └── Limit Reached → HTTP 429
```

This prevents concurrent requests from bypassing monthly AI limits.

### Payment Security

Razorpay signatures are verified server-side using HMAC-SHA256.

Webhook events use a unique provider/event ID combination to prevent duplicate processing.

---

## 📁 Environment Variables

Create environment files based on the provided examples.

### Backend

```env
NODE_ENV=
PORT=
MONGODB_URI=

JWT_SECRET=
JWT_REFRESH_SECRET=

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_PRO_PLAN_ID=
```

### Frontend

```env
VITE_API_URL=
VITE_RAZORPAY_KEY_ID=
```

> ⚠️ **Never commit real `.env` files or production credentials to GitHub.**

---

## 🚀 Local Development

### Prerequisites

Make sure you have:

* Node.js
* pnpm
* MongoDB / MongoDB Atlas
* Gemini API credentials
* Cloudinary credentials
* Razorpay credentials for billing functionality

### Clone Repository

```bash
git clone https://github.com/prajapatvijesh/CareerForge-AI.git

cd CareerForge-AI
```

### Install Dependencies

```bash
pnpm install
```

### Configure Environment

Create the required environment files using:

```text
apps/api/.env.example
apps/web/.env.example
```

Copy them to the appropriate `.env` files and configure your local credentials.

### Start Development

```bash
pnpm dev
```

---

## 🧪 Verification

Run type checking:

```bash
pnpm run typecheck
```

Run linting:

```bash
pnpm run lint
```

Build the project:

```bash
pnpm run build
```

The project should pass all three checks before being considered ready for release.

---

## 📚 Documentation

Additional technical and operational documentation is available in the `docs/` directory.

Recommended documents include:

```text
docs/
├── api_documentation.md
├── architecture.md
├── security.md
├── production_release_checklist.md
├── deployment_runbook.md
├── incident_response.md
├── backup_and_recovery.md
├── release_readiness_report.md
├── production_hardening_qa_report.md
└── launch_day_simulation_report.md
```

These documents cover API architecture, security, deployment procedures, incident handling, backups, recovery, and release-readiness checks.

---

## 🧭 Product Workflow

```text
Signup / Login
      │
      ▼
Complete Profile
      │
      ▼
Build Resume
      │
      ▼
AI Resume Analysis
      │
      ├───────────────┐
      ▼               ▼
Job Tracker      Mock Interviews
      │               │
      └───────┬───────┘
              ▼
       AI Career Assistant
              │
              ▼
      Career Improvement
              │
              ▼
        PRO Subscription
              │
              ▼
      Advanced AI Usage
```

---

## 🎯 Key Engineering Highlights

### 1. Atomic AI Usage Enforcement

MongoDB atomic operations prevent concurrent AI requests from bypassing subscription limits.

### 2. Provider Abstraction

AI and payment integrations are isolated behind provider interfaces, making future provider changes easier without rewriting business logic.

### 3. Clean Architecture

The backend follows:

```text
Route
 → Controller
 → Service
 → Repository
 → Database
```

This keeps business logic independent from HTTP and database concerns.

### 4. AI Reliability

AI integrations include:

* Timeout handling
* Retry mechanisms
* Structured responses
* Validation
* Usage telemetry
* Safe error handling

### 5. Secure Payments

Razorpay integration includes:

* Server-controlled plans
* Signature verification
* Webhook verification
* Idempotent webhook processing
* Payment history
* Subscription state management

---

## 📈 Future Roadmap

Potential future improvements:

* Advanced AI career planning
* More AI providers
* Advanced resume templates
* Job recommendation engine
* Email notifications
* Subscription analytics improvements
* Automated database reconciliation
* Advanced admin controls
* CI/CD deployment pipeline
* Automated production monitoring

---

## 👨‍💻 Author

**Vijesh Prajapat**

B.Tech — Artificial Intelligence & Machine Learning

CareerForge AI was developed as a full-stack SaaS project demonstrating modern web development, AI integration, authentication, subscription management, payment processing, security engineering, and scalable application architecture.

---

## 📄 License

This project is currently maintained as a personal portfolio/project repository.

---

## ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

**CareerForge AI — Build your career. Improve your resume. Prepare smarter. Get hired.**
