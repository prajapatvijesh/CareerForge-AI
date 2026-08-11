# CareerForge AI - Architecture Documentation

This document outlines the architectural patterns and specific sub-system architectures utilized within the CareerForge AI monorepo.

---

## Backend Architecture

The Node.js backend adheres strictly to **Clean Architecture**. This separation of concerns ensures that the application is highly testable, scalable, and independent of external frameworks.

```text
HTTP Request
     ↓
[ Route Layer ]       (Registers endpoints & applies middleware like Auth/Zod)
     ↓
[ Controller Layer ]  (Extracts req/res data, calls Service, sends HTTP response)
     ↓
[ Service Layer ]     (Contains Core Business Logic, independent of HTTP)
     ↓
[ Repository Layer ]  (Abstracts database interactions and queries)
     ↓
[ Database Layer ]    (MongoDB via Mongoose)
```

**Responsibilities:**
- **Routes (`*.route.ts`)**: Purely routing. No business logic.
- **Controllers (`*.controller.ts`)**: Purely request handling. Extracts `req.body` and `req.user.id`, calls the service, handles errors via `next()`.
- **Services (`*.service.ts`)**: The heart of the application. Validates business constraints (e.g. "User cannot apply to same job twice").
- **Repositories (`*.repository.ts`)**: The only layer allowed to import Mongoose models and execute database queries (e.g. `findById`, `updateOne`). Enforces IDOR protection by heavily filtering on `userId`.

---

## AI Architecture

The AI subsystem utilizes a Strategy/Provider pattern to interface with LLMs (Google Gemini).

```text
[ Feature Module ] (e.g. Resume Analysis Service)
        ↓
[ AI Provider Interface ] (e.g. IAIProvider)
        ↓
[ Gemini Provider ] (Implements Interface)
        ↓
[ withRetry Utility ] (Timeout & Resilience wrapper)
        ↓
[ Google GenAI SDK ]
```

**Key Concepts:**
- **Providers**: AI providers implement specific interfaces (e.g. `generateCareerResponse`). This allows seamless switching between `mock` and `gemini` implementations based on the `AI_PROVIDER` environment variable.
- **Structured Outputs**: Prompts enforce JSON outputs, and the provider utilizes Zod to parse and validate the LLM response safely.
- **Resilience (`withRetry`)**: The Gemini API calls are wrapped in a `withRetry` utility that enforces a strict timeout (e.g., 15s) and implements exponential backoff to recover gracefully from Google API transient failures.
- **Usage Telemetry**: Every AI interaction extracts prompt and completion token counts. The service writes this data asynchronously to the `AIUsageTelemetry` collection for administrative review.

---

## Subscription & Usage Architecture

CareerForge AI implements a robust quota system to limit AI usage for FREE tier users, preventing abuse.

```text
[ Feature Action ] (e.g. User starts mock interview)
        ↓
[ Subscription Service ]
        ↓
[ UsageService.checkAndReserveLimit() ]
        ↓
[ Atomic findOneAndUpdate ] -> (Success or 429 Limit Exceeded)
        ↓
[ Feature Proceeds ]
```

**Key Concepts:**
- **Atomic Operations**: To prevent TOCTOU (Time-of-Check to Time-of-Use) race conditions where a user spams an endpoint to bypass limits, usage increments are executed as a single atomic MongoDB operation (`MonthlyUsage.findOneAndUpdate({ usage < limit }, { $inc: 1 })`).
- **Feature Tiers**: Different plans (FREE vs PRO) have different numeric limits. The subscription status determines which limit boundary is passed to the `UsageService`.

---

## Billing Architecture

Billing is handled via Razorpay Subscriptions, utilizing a highly secure, webhook-driven architecture.

```text
[ Frontend ] -> (Clicks Subscribe)
     ↓
[ Billing API ] -> (Creates Subscription via Razorpay Provider)
     ↓
[ Razorpay API ] -> (Returns Subscription ID to Frontend)
     ↓
[ User Completes Payment in Razorpay UI ]
     ↓
[ Razorpay Webhook ] -> (Fires subscription.charged to Backend)
     ↓
[ Billing API / Webhook Handler ]
     ↓
[ Validates Signature & Idempotency ]
     ↓
[ Upgrades Subscription to PRO in DB ]
```

**Key Concepts:**
- **Authoritative Webhooks**: The frontend *never* dictates subscription upgrades. Only cryptographically verified Razorpay webhooks (`verifyWebhookSignature`) are permitted to upgrade a user's plan.
- **Idempotency**: Webhook events are hashed and stored in the `WebhookEvent` collection. If Razorpay retries a webhook, the backend detects the duplicate hash and safely ignores it.
- **Plan Spoofing Prevention**: The webhook handler strictly asserts that the Razorpay `plan_id` precisely matches the backend's expected `RAZORPAY_PRO_PLAN_ID`, preventing users from subscribing to a cheaper, hidden plan.

---

## Admin Architecture

The Admin architecture is heavily isolated to provide analytics and moderation capabilities safely.

**Key Concepts:**
- **Role-Based Access Control (RBAC)**: Protected strictly by the `requireAdmin` middleware, enforcing that `req.user.role === 'ADMIN'`.
- **Analytics Aggregation**: Uses complex MongoDB Aggregation pipelines (`$group`, `$match`, `$project`) to calculate total revenue, active subscriptions, and system health efficiently.
- **Audit Logging**: Any destructive or administrative action (like suspending a user) is written to the `AuditLog` collection, ensuring accountability and traceability.
