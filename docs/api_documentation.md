# CareerForge AI - API Documentation

Base URL: `/api/v1`

All requests should include `Content-Type: application/json` unless otherwise specified (e.g. multipart/form-data for uploads).
All protected routes require a valid JWT token via an HTTP-Only cookie.

## Authentication (`/auth`)

### `POST /auth/register`
Register a new user.
- **Auth Required:** No
- **Body:** `{ "name": "...", "email": "...", "password": "..." }`
- **Success Response:** `201 Created` with JWT in HttpOnly cookie.

### `POST /auth/login`
Authenticate a user.
- **Auth Required:** No
- **Body:** `{ "email": "...", "password": "..." }`
- **Success Response:** `200 OK` with JWT in HttpOnly cookie.

### `POST /auth/refresh`
Refresh access token.
- **Auth Required:** No (Uses refresh token cookie)
- **Success Response:** `200 OK` with new access token cookie.

### `POST /auth/logout`
Logout current user.
- **Auth Required:** Yes
- **Success Response:** `200 OK`, clears cookies.

### `GET /auth/me`
Get current user info.
- **Auth Required:** Yes
- **Success Response:** `200 OK` `{ "data": { "user": { ... } } }`

---

## Profile (`/profile`)

### `GET /profile`
Get the user's detailed profile.
- **Auth Required:** Yes
- **Success Response:** `200 OK` `{ "data": { "profile": { ... } } }`

### `PUT /profile`
Update the user's profile.
- **Auth Required:** Yes
- **Body:** `{ "headline": "...", "bio": "...", "skills": [...], ... }`
- **Success Response:** `200 OK`

### `POST /profile/avatar`
Upload a new avatar.
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Body:** `avatar` (file)
- **Success Response:** `200 OK` `{ "data": { "avatarUrl": "..." } }`

---

## Resume (`/resumes`)

### `GET /resumes`
List user's resumes.
- **Auth Required:** Yes
- **Success Response:** `200 OK` `{ "data": { "resumes": [...] } }`

### `POST /resumes`
Create a new resume.
- **Auth Required:** Yes
- **Body:** `{ "title": "...", "templateId": "..." }`
- **Success Response:** `201 Created`

### `GET /resumes/:id`
Get a specific resume.
- **Auth Required:** Yes
- **Success Response:** `200 OK`

### `PUT /resumes/:id`
Update a specific resume.
- **Auth Required:** Yes
- **Body:** `{ "sections": [...], "theme": {...} }`
- **Success Response:** `200 OK`

### `DELETE /resumes/:id`
Delete a specific resume.
- **Auth Required:** Yes
- **Success Response:** `200 OK`

---

## Job Tracker (`/jobs`)

### `GET /jobs`
List job applications.
- **Auth Required:** Yes
- **Success Response:** `200 OK` `{ "data": { "jobs": [...] } }`

### `POST /jobs`
Add a new job application.
- **Auth Required:** Yes
- **Body:** `{ "companyName": "...", "jobTitle": "...", "status": "...", ... }`
- **Success Response:** `201 Created`

### `PUT /jobs/:id`
Update an existing job application.
- **Auth Required:** Yes
- **Body:** `{ "status": "...", "notes": "...", ... }`
- **Success Response:** `200 OK`

### `DELETE /jobs/:id`
Delete a job application.
- **Auth Required:** Yes
- **Success Response:** `200 OK`

---

## Mock Interview (`/mock-interview`)

### `POST /mock-interview/start`
Start a new mock interview.
- **Auth Required:** Yes
- **Body:** `{ "role": "...", "difficulty": "..." }`
- **Success Response:** `201 Created` `{ "data": { "interviewId": "...", "questions": [...] } }`

### `GET /mock-interview/:id`
Get an existing interview session.
- **Auth Required:** Yes
- **Success Response:** `200 OK`

### `POST /mock-interview/:id/submit`
Submit answers and finish the interview.
- **Auth Required:** Yes
- **Body:** `{ "answers": [{ "questionId": "...", "answerText": "..." }] }`
- **Success Response:** `200 OK` `{ "data": { "result": { ... } } }`

---

## Career Assistant (`/career-assistant`)

### `GET /career-assistant/conversations`
List previous conversations.
- **Auth Required:** Yes
- **Success Response:** `200 OK`

### `GET /career-assistant/conversations/:id`
Get a specific conversation history.
- **Auth Required:** Yes
- **Success Response:** `200 OK`

### `POST /career-assistant/chat`
Send a message to the AI career coach.
- **Auth Required:** Yes
- **Body:** `{ "message": "...", "conversationId": "..." }` (omit `conversationId` for a new session)
- **Success Response:** `200 OK` `{ "data": { "reply": "...", "recommendations": [...] } }`

---

## Subscription (`/subscription`)

### `GET /subscription/current`
Get current subscription and usage.
- **Auth Required:** Yes
- **Success Response:** `200 OK` `{ "data": { "subscription": {...}, "usage": {...} } }`

### `GET /subscription/plans`
Get available subscription plans.
- **Auth Required:** Yes
- **Success Response:** `200 OK`

---

## Billing (`/billing`)

### `POST /billing/checkout`
Initialize a Razorpay checkout for PRO subscription.
- **Auth Required:** Yes
- **Success Response:** `200 OK` `{ "data": { "subscriptionId": "...", "keyId": "..." } }`

### `POST /billing/verify`
Verify successful frontend checkout.
- **Auth Required:** Yes
- **Body:** `{ "razorpay_payment_id": "...", "razorpay_signature": "...", "razorpay_subscription_id": "..." }`
- **Success Response:** `200 OK`

### `POST /billing/cancel`
Cancel active PRO subscription.
- **Auth Required:** Yes
- **Success Response:** `200 OK`

### `POST /billing/webhook`
Razorpay Webhook endpoint.
- **Auth Required:** No (Uses cryptographic signature validation)
- **Success Response:** `200 OK`

---

## Admin (`/admin`)

*All admin endpoints require authentication and an administrative role (`role === 'ADMIN'`).*

### `GET /admin/dashboard`
Aggregate analytics dashboard (user count, active subscriptions, total revenue).
- **Success Response:** `200 OK`

### `GET /admin/users`
List users with pagination and filtering.
- **Success Response:** `200 OK`

### `GET /admin/users/:id`
Detailed user profile, subscription, and usage data.
- **Success Response:** `200 OK`

### `PUT /admin/users/:id/status`
Suspend or activate a user account.
- **Body:** `{ "status": "ACTIVE" | "SUSPENDED" }`
- **Success Response:** `200 OK`

### `GET /admin/audit-logs`
Administrative action audit trails.
- **Success Response:** `200 OK`

### `GET /admin/system`
System health status (DB, Gemini, Razorpay).
- **Success Response:** `200 OK`
