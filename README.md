<div align="center">
  <br />
    <a href="https://github.com/ayushsinghh0/aegisid-auth-server" target="_blank">
      <img src="https://img.shields.io/badge/AegisID-Security_Protocol-blue?style=for-the-badge&logo=shield" alt="AegisID Badge">
    </a>
  <br />

  <h1 align="center">🛡️ AegisID Auth Server</h1>

  <p align="center">
    <strong>Production-Grade Identity & Access Management System</strong>
    <br />
    Built for scale, security, and developer experience.
  </p>

  <p align="center">
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://redis.io/"><img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" /></a>
    <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" /></a>
    <a href="https://oauth.net/2/"><img src="https://img.shields.io/badge/OAuth_2.0-EB5424?style=for-the-badge&logo=auth0&logoColor=white" alt="OAuth 2.0" /></a>
  </p>
</div>

---

## ⚡ Overview

**AegisID** is a high-performance, stateless authentication backend designed to mimic enterprise-grade identity providers (IdPs). Unlike simple tutorials, this project implements a complete **OAuth 2.0** and **OIDC-compliant** architecture from scratch without relying on "black box" auth libraries.

It handles the full lifecycle of digital identity: **Registration**, **Secure Login**, **Token Rotation**, **Session Management**, and **Role-Based Access Control**.

### 🎯 Core Capabilities

| Feature | Description | Tech |
| :--- | :--- | :--- |
| **🔐 Stateless Auth** | Secure access/refresh token rotation with RS256 signing. | JWT, OpenSSL |
| **🌍 OAuth 2.0** | Social login integration (Google/GitHub) via Auth Code flow. | OAuth Standards |
| **🚀 High Performance** | In-memory session tracking and blacklisting. | Redis |
| **🛡️ Type Safety** | End-to-end type safety from DB to API response. | TypeScript, Zod |
| **🐘 Data Integrity** | ACID-compliant relational data modeling. | Prisma, PostgreSQL |
| **📡 Telemetry** | Structured logging and observability patterns. | Winston/Morgan |

---



## 🔧 Tech Stack

This project focuses on core backend authentication concepts using a modern Node.js stack.

- 🟢 **Node.js** – Runtime for the HTTP server and async IO.
- 📘 **TypeScript** – Static typing, safer refactors, and clearer contracts between layers.
- 🚏 **Express** – Lightweight HTTP routing and middleware pipeline.
- 🧩 **Prisma** – Type-safe ORM over PostgreSQL with migrations and generated types.
- 🐘 **PostgreSQL** – Primary data store for users, sessions, and OAuth identities.
- 🚀 **Redis** – Fast in-memory store for sessions, token metadata, and blacklists.
- 🔐 **JWT (JSON Web Tokens)** – Stateless auth for access and refresh tokens.
- 🌐 **OAuth 2.0** – Social login integration (for example Google GitHub style flows).
- ✅ **Zod / Validators** – Request validation for predictable, safe API contracts.
- ⚙️ **Dotenv / Environment variables** – Configuration for secrets, DB, and providers.

---

## 🧠 What It Is & Why It Matters

AegisID is a complete authentication backend that implements registration, login, refresh tokens, OAuth login, and protected routes. It aims to model how real-world auth servers work internally rather than hide everything behind libraries. The project demonstrates backend engineering skills around architecture, security, data modeling, and state management.

It is built as a focused portfolio project in about 20 days. The emphasis is on clarity of code, realistic patterns, and demonstrating understanding of modern auth workflows.

---

## 🏗️ Architecture Overview

AegisID uses a layered architecture with clear separation between HTTP, middleware, services, and persistence.

- Express handles routing and plugs in middleware.
- Middleware performs validation, authentication, and error handling.
- Services implement domain logic like registration, login, and OAuth.
- Prisma talks to PostgreSQL; Redis accelerates token and session checks.
- Utility modules handle hashing, JWT, and shared helpers.

**Request flow (simplified):**

```text
Client
  ↓
Express Route
  ↓
Middleware (validation, auth)
  ↓
Service (business logic)
  ↓
Prisma / Redis (PostgreSQL, cache)
  ↓
Response JSON
```

---

## 🚦 Auth Workflows

Each workflow is designed to be explicit and easy to follow in code.

### 📝 Registration

- Client sends email, password, and optional profile data.
- Request body passes through Zod validation.
- Service checks for existing user in PostgreSQL via Prisma.
- Password is hashed and stored with user record.
- Response returns a minimal user object and success message.

### 🔑 Login

- Client sends email and password.
- Credentials are validated and normalized.
- Service checks user existence and verifies password hash.
- Access and refresh JWTs are generated.
- Refresh token metadata may be stored or tracked in Redis.

### 🪪 JWT Creation

- Payload contains user id and basic claims (email, roles, etc).
- Token is signed using keys or secrets from environment / `keys`.
- Access tokens have short lifetimes for security.
- Refresh tokens have longer lifetimes for session continuity.

### 🧾 Token Validation

- Middleware extracts `Authorization: Bearer <token>` from headers.
- JWT is verified and decoded using the configured key and algorithm.
- Expiry, issuer, and audience checks run.
- Optional Redis lookup checks for revocation or blacklisting.
- Valid token attaches `req.user` context for downstream handlers.

### 🌐 OAuth Login

- Client is redirected to provider’s OAuth consent page.
- Provider redirects back with an authorization code.
- OAuth service exchanges code for tokens with the provider.
- Provider profile is mapped to a local user in PostgreSQL.
- Local JWT access and refresh tokens are issued to the client.

### 🔁 Refresh Tokens

- Client sends a refresh token to the refresh endpoint.
- Token is validated and checked against Redis or DB.
- New access (and optionally new refresh) tokens are generated.
- Old refresh tokens may be rotated or invalidated.

### 🚪 Logout

- Client calls logout with the current refresh token.
- Service invalidates the refresh token in Redis or DB.
- Optionally blacklists the access token until expiry.
- Future use of those tokens is rejected as unauthorized.

---

## 📡 APIs

APIs are JSON-based and designed to be predictable and easy to integrate. Below are a few core endpoints.

### POST /api/v1/auth/register

```api
{
  "title": "Register User",
  "description": "Create a new user with email and password.",
  "method": "POST",
  "baseUrl": "http://localhost:3000",
  "endpoint": "/api/v1/auth/register",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "json",
  "requestBody": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"StrongPass123!\",\n  \"name\": \"Ayush\"\n}",
  "formData": [],
  "responses": {
    "201": {
      "description": "User registered successfully.",
      "body": "{\n  \"user\": {\n    \"id\": \"uuid\",\n    \"email\": \"user@example.com\"\n  }\n}"
    },
    "400": {
      "description": "Validation or uniqueness error.",
      "body": "{\n  \"error\": {\n    \"code\": \"VALIDATION_ERROR\",\n    \"message\": \"Email is already registered.\",\n    \"details\": []\n  }\n}"
    }
  }
}
```

### POST /api/v1/auth/login

```api
{
  "title": "Login",
  "description": "Authenticate a user and return JWT access and refresh tokens.",
  "method": "POST",
  "baseUrl": "http://localhost:3000",
  "endpoint": "/api/v1/auth/login",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "json",
  "requestBody": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"StrongPass123!\"\n}",
  "formData": [],
  "responses": {
    "200": {
      "description": "Login successful.",
      "body": "{\n  \"accessToken\": \"jwt-access-token\",\n  \"refreshToken\": \"jwt-refresh-token\",\n  \"user\": {\n    \"id\": \"uuid\",\n    \"email\": \"user@example.com\"\n  }\n}"
    },
    "401": {
      "description": "Invalid credentials.",
      "body": "{\n  \"error\": {\n    \"code\": \"INVALID_CREDENTIALS\",\n    \"message\": \"Email or password is incorrect.\"\n  }\n}"
    }
  }
}
```

### GET /api/v1/me

```api
{
  "title": "Get Current User",
  "description": "Return the profile of the authenticated user.",
  "method": "GET",
  "baseUrl": "http://localhost:3000",
  "endpoint": "/api/v1/me",
  "headers": [
    {
      "key": "Authorization",
      "value": "Bearer <accessToken>",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "none",
  "requestBody": "",
  "formData": [],
  "responses": {
    "200": {
      "description": "User profile returned.",
      "body": "{\n  \"user\": {\n    \"id\": \"uuid\",\n    \"email\": \"user@example.com\",\n    \"name\": \"Ayush\"\n  }\n}"
    },
    "401": {
      "description": "Token missing or invalid.",
      "body": "{\n  \"error\": {\n    \"code\": \"UNAUTHORIZED\",\n    \"message\": \"Access token is invalid or expired.\"\n  }\n}"
    }
  }
}
```

---

## 🧩 Folder Structure

High-level structure of the project and what each part does.

```text
AegisID-Auth-Server/
├── dist/           # Compiled JavaScript output from TypeScript
├── keys/           # JWT keys / crypto material (local only, env-specific)
├── node_modules/   # Dependencies
├── prisma/         # Prisma schema and migrations
├── src/
│   ├── cache/       # 🚀 Redis client & cache strategies
│   ├── config/      # ⚙️ Environment variables & constants
│   ├── db/          # 🐘 Prisma client singleton
│   ├── middleware/  # 🛡️ Auth guards, error handling, rate limiting
│   ├── routes/      # 🚏 API route definitions
│   ├── services/    # 🧠 Business logic (Auth, User, OAuth)
│   ├── utils/       # 🔧 Hashing, Tokenizers, Helpers
│   ├── validators/  # ✅ Zod schemas for request validation
│   ├── app.ts       # 🏗️ App entry point
│   └── index.ts     # 🏁 Server startup
├── .env            # Local environment config (not committed)
├── package.json    # Scripts and dependencies
├── prisma.config.ts
├── tsconfig.json   # TypeScript configuration
└── README.md


```

- **Services** depend on `db`, `cache`, `utils`, and validators.
- **Routes** wire HTTP paths to services via middleware.
- **Middleware** enforces security, validations, and consistent error responses.

---

## 🔐 Security Design

Security choices aim to mirror real-world practices in a learning-friendly way.

- **Password hashing**  
  - Uses a strong hashing algorithm (for example bcrypt or argon2).  
  - Raw passwords are never stored.

- **JWT signing**  
  - Access and refresh tokens signed with strong keys.  
  - Expirations configured via environment variables.

- **Key usage**  
  - Keys live in `keys/` or env, not hard-coded.  
  - Private keys restricted; public keys used for verification.

- **Redis-backed session data**  
  - Stores refresh token metadata or revocation information.  
  - Enables token invalidation and rotation strategies.

- **Middleware guards**  
  - Auth middleware protects private endpoints.  
  - Optional role checks can be added for advanced scenarios.

- **Validation layer**  
  - All important inputs validated with Zod schemas.  
  - Reduces attack surface from malformed or malicious payloads.

- **Environment protection**  
  - `.env` holds secrets like DB URL, client secrets, and JWT config.  
  - Different values per environment without code changes.

---

## ⚡ Quick Start

Minimal steps to run AegisID locally for review or experimentation.

1. **Clone the repo:**
   ```bash
   git clone https://github.com/ayushsinghh0/aegisid-auth-server.git
   cd aegisid-auth-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment:**
   - Copy `.env.example` if present or create `.env`.
   - Set PostgreSQL, Redis, JWT, and OAuth variables.

4. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Generate local JWT keys (example):**
   ```bash
   mkdir -p keys
   openssl genrsa -out keys/jwt-private.pem 2048
   openssl rsa -in keys/jwt-private.pem -pubout -out keys/jwt-public.pem
   ```

6. **Start development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

## 📌 Example Usage

Basic flow using `curl` for quick verification.

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"StrongPass123!","name":"Ayush"}'
```

### Login and call a protected route

```bash
# login
ACCESS_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"StrongPass123!"}' \
  | jq -r '.accessToken')

# call /me
curl -X GET http://localhost:3000/api/v1/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## 📈 Learning Outcomes

This project demonstrates practical backend engineering and auth understanding.

- Implemented **end-to-end auth** with registration, login, refresh, and logout.
- Understood **JWT internals**, claims, expiry, and verification.
- Built **OAuth flows** and mapped external identities to local users.
- Practiced layered **backend architecture** with services, middleware, and persistence.
- Learned **Prisma + PostgreSQL** modeling and migration workflows.
- Used **Redis** for token-related state and performance.

---

## 🧪 Testing / Debugging

AegisID is designed to be debuggable and easy to reason about.

- **Unit-level verification**  
  - Services are isolated and testable with mocked Prisma and Redis.  
  - Validation schemas tested with representative payloads.

- **Manual API testing**  
  - Use tools like Postman or curl against local server.  
  - Common flows: register → login → /me → refresh → logout.

- **Logging and telemetry**  
  - Central logging utilities under `telemetry/`.  
  - Logs important decisions without leaking secrets.

- **TypeScript as a safety net**  
  - Types catch many integration errors at compile time.  
  - Clear interfaces between layers reduce runtime surprises.

---

## ✏️ Future Improvements

Potential improvements to deepen learning and realism.

- Role-based access control with fine-grained permissions.
- Multi-factor authentication (TOTP or email codes).
- Rate limiting for login and registration endpoints.
- Audit logging for security-critical events.
- More comprehensive automated tests (unit and integration).
- Basic metrics and dashboards for latency and error rates.

---

## 📍 Author / Contact

- **Author:** Ayush Raj  
- **Project:** AegisID Auth Server  
- **Focus:** Modern authentication, backend architecture, and security fundamentals  
- **GitHub:** [@ayushsinghh0](https://github.com/ayushsinghh0)
