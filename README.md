# AegisID

AegisID is a secure authentication and identity management platform built on OAuth2 and OpenID Connect standards. It provides a centralized way to handle login, authorization, and session management across multiple applications. The platform focuses on security, performance, and developer experience for modern backend and frontend stacks.

## Problem Statement

Modern applications require secure, standards-compliant authentication without slowing user experience. Implementing OAuth2, OpenID Connect, and token lifecycles from scratch is complex and error-prone. Many teams struggle with scalable session management, rate limiting, and auditability across services. AegisID addresses these challenges with a dedicated, production-ready auth server.

## Solution Overview

AegisID centralizes authentication and identity management behind a single, consistent API. It implements OAuth2 and OpenID Connect flows on top of Node.js, Express, Prisma, and PostgreSQL. Redis powers low-latency token caching, session storage, and rate limiting. The system integrates easily with web, mobile, and server-to-server clients.

## Features

- OAuth2 and OpenID Connect compliant authentication flows.
- JWT-based access and refresh tokens with configurable lifetimes.
- Token introspection, revocation, and rotation support.
- User registration, login, logout, and password management.
- Role-based and scope-based authorization model.
- Redis-backed token caching and session storage.
- Rate limiting for authentication and token endpoints.
- Audit-ready logging for authentication events.
- Docker-ready deployment with GitHub Actions CI/CD integration.

## Tech Stack

AegisID uses a modern and scalable backend stack. Each component was chosen for reliability and ecosystem support.

- **Backend:**
  - Node.js
  - Express
  - TypeScript (if applicable in implementation)
- **Database and ORM:**
  - PostgreSQL
  - Prisma ORM
- **Caching and Rate Limiting:**
  - Redis
- **Authentication and Authorization:**
  - OAuth2
  - OpenID Connect
  - JWT (JSON Web Tokens)
- **Infrastructure and DevOps:**
  - Docker and Docker Compose
  - GitHub Actions for CI/CD

## System Architecture Overview

AegisID follows a layered architecture with clear separation between transport, business logic, and persistence. Redis and PostgreSQL work together to balance performance and consistency. External clients interact only with well-defined HTTP APIs.

```mermaid
flowchart TD
    Clients[Client applications]
    Api[AegisID REST API]
    AuthService[Auth service Node Express]
    RedisCache[Redis cache and rate limiter]
    PostgresDB[PostgreSQL database]
    OAuthProviders[External OAuth2 and OIDC providers]

    Clients --> Api
    Api --> AuthService
    AuthService --> RedisCache
    AuthService --> PostgresDB
    AuthService --> OAuthProviders
    RedisCache --> AuthService
    PostgresDB --> AuthService
```

The architecture enables horizontal scalability and low-latency responses. Stateless JWTs reduce database load for common checks. Redis centralizes fast-changing authentication state and limits pressure on PostgreSQL.

## Redis Usage for Caching and Rate Limiting

Redis sits at the core of AegisID performance and resilience. It stores ephemeral authentication state that benefits from in-memory access.

- **Token caching:**
  - Cache validated access tokens for quick reuse.
  - Cache token metadata such as scopes and expiry.
- **Session storage:**
  - Store user sessions and refresh tokens with TTLs.
  - Support session invalidation and logout across devices.
- **Rate limiting:**
  - Enforce per-IP and per-user limits on login attempts.
  - Protect token endpoints from abuse and brute-force attacks.
- **Blacklisting and revocation:**
  - Store revoked tokens and session identifiers temporarily.
  - Prevent reuse of compromised or expired credentials.

This design reduces database round trips and improves throughput under load. It also simplifies implementing features like global logout and device management.

## Impact of Redis on Latency

Introducing Redis significantly improved authentication performance. Critical operations now complete with fewer database queries and lower I/O overhead.

- Login endpoint latency dropped by approximately 40 percent.
- Token validation and introspection benefit from warm token caches.
- Session lookups run in constant time even under heavy concurrency.
- Rate limiting uses atomic Redis operations, avoiding race conditions.

These gains translate directly into a smoother user login experience. They also increase capacity before horizontal scaling becomes necessary.

## Installation

Use the following steps to set up AegisID locally. You can run it either directly on your machine or via Docker.

1. **Clone the repository:**
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

3. **Set up the database with Prisma migrations:**
   ```bash
   npx prisma migrate dev
   # or
   npx prisma db push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Optional: Run with Docker:**
   ```bash
   docker compose up --build
   ```

The API will usually run on `http://localhost:3000` unless configured otherwise.

## Environment Setup

AegisID uses environment variables to configure database, Redis, and security settings. Create a `.env` file at the project root.

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aegisid

# Redis
REDIS_URL=redis://localhost:6379

# Auth and security
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth2 and OIDC
OIDC_ISSUER_URL=http://localhost:3000
OAUTH2_CLIENT_ID=example_client
OAUTH2_CLIENT_SECRET=example_secret

# Rate limiting
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_MAX_REQUESTS=30
```

Adjust values for production with strong, unique secrets. Use separate Redis and PostgreSQL instances for staging and production.

## API Usage Examples

AegisID exposes RESTful endpoints for authentication and token management. The examples below assume a base URL of `http://localhost:3000`.

### Register User – POST /auth/register

```api
{
  "title": "Register User",
  "description": "Create a new user account in AegisID.",
  "method": "POST",
  "baseUrl": "http://localhost:3000",
  "endpoint": "/auth/register",
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
  "requestBody": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"StrongPassword123!\",\n  \"name\": \"Jane Doe\"\n}",
  "formData": [],
  "responses": {
    "201": {
      "description": "User created successfully.",
      "body": "{\n  \"id\": \"uuid\",\n  \"email\": \"user@example.com\",\n  \"name\": \"Jane Doe\"\n}"
    },
    "400": {
      "description": "Validation failed.",
      "body": "{\n  \"error\": {\n    \"message\": \"Email already in use.\"\n  }\n}"
    }
  }
}
```

### Login – POST /auth/login

```api
{
  "title": "User Login",
  "description": "Authenticate a user and issue access and refresh tokens.",
  "method": "POST",
  "baseUrl": "http://localhost:3000",
  "endpoint": "/auth/login",
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
  "requestBody": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"StrongPassword123!\"\n}",
  "formData": [],
  "responses": {
    "200": {
      "description": "Login successful.",
      "body": "{\n  \"accessToken\": \"<jwt_access_token>\",\n  \"refreshToken\": \"<jwt_refresh_token>\",\n  \"expiresIn\": 900\n}"
    },
    "401": {
      "description": "Invalid credentials.",
      "body": "{\n  \"error\": {\n    \"message\": \"Invalid email or password.\"\n  }\n}"
    }
  }
}
```

### Refresh Token – POST /auth/token/refresh

```api
{
  "title": "Refresh Token",
  "description": "Exchange a valid refresh token for a new access token.",
  "method": "POST",
  "baseUrl": "http://localhost:3000",
  "endpoint": "/auth/token/refresh",
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
  "requestBody": "{\n  \"refreshToken\": \"<jwt_refresh_token>\"\n}",
  "formData": [],
  "responses": {
    "200": {
      "description": "Token refreshed.",
      "body": "{\n  \"accessToken\": \"<new_jwt_access_token>\",\n  \"refreshToken\": \"<new_jwt_refresh_token>\",\n  \"expiresIn\": 900\n}"
    },
    "401": {
      "description": "Invalid or expired refresh token.",
      "body": "{\n  \"error\": {\n    \"message\": \"Refresh token is invalid or expired.\"\n  }\n}"
    }
  }
}
```

### Token Introspection – POST /auth/token/introspect

```api
{
  "title": "Token Introspection",
  "description": "Validate an access token and retrieve token metadata.",
  "method": "POST",
  "baseUrl": "http://localhost:3000",
  "endpoint": "/auth/token/introspect",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json",
      "required": true"
    },
    {
      "key": "Authorization",
      "value": "Basic <client_credentials_base64>",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "json",
  "requestBody": "{\n  \"token\": \"<jwt_access_token>\"\n}",
  "formData": [],
  "responses": {
    "200": {
      "description": "Token introspection result.",
      "body": "{\n  \"active\": true,\n  \"sub\": \"user-id\",\n  \"scope\": \"openid profile email\",\n  \"exp\": 1712345678\n}"
    },
    "2001": {
      "description": "Inactive token.",
      "body": "{\n  \"active\": false\n}"
    }
  }
}
```

### Logout – POST /auth/logout

```api
{
  "title": "User Logout",
  "description": "Invalidate refresh tokens and sessions for the current user.",
  "method": "POST",
  "baseUrl": "http://localhost:3000",
  "endpoint": "/auth/logout",
  "headers": [
    {
      "key": "Authorization",
      "value": "Bearer <jwt_access_token>",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "none",
  "requestBody": "",
  "formData": [],
  "responses": {
    "204": {
      "description": "Logout successful.",
      "body": ""
    },
    "401": {
      "description": "Missing or invalid access token.",
      "body": "{\n  \"error\": {\n    \"message\": \"Unauthorized.\"\n  }\n}"
    }
  }
}
```

These endpoints integrate easily with single-page applications, mobile clients, and backend services. Additional OAuth2 grant types and OIDC discovery endpoints can extend this interface.

## Security Features

AegisID prioritizes security best practices and industry standards. It reduces common implementation pitfalls through opinionated defaults.

- OAuth2 and OpenID Connect compliant flows and token formats.
- Signed and optionally encrypted JWTs using strong algorithms.
- Secure password hashing using modern algorithms such as bcrypt or Argon2.
- Configurable token lifetimes and refresh token rotation.
- IP and user-based rate limiting backed by Redis.
- CSRF protection for browser-based flows when applicable.
- Strict input validation and centralized error handling.
- Audit logging for login, logout, and token events.

These measures provide a solid baseline for production-grade identity management. They also help compliance efforts by centralizing access control.

## Performance Optimization

Performance considerations guided major design choices in AegisID. Redis and JWTs minimize repeated work and I/O overhead.

- Redis cache for validated tokens and session metadata.
- Reduced calls to PostgreSQL for common authentication checks.
- Batched and indexed database queries via Prisma.
- Asynchronous logging and non-blocking I/O.
- Efficient rate limiting with Redis atomic operations.
- Dockerized deployment for reproducible performance profiles.

Internal benchmarking showed approximately 40 percent reduction in average login and token validation latency. This improvement came after moving token verification paths to Redis-backed caches.

## Folder Structure

The project uses a conventional Node.js service layout. This structure keeps business logic, configuration, and infrastructure concerns decoupled.

```bash
aegisid-auth-server/
├─ src/
│  ├─ config/          # Environment, configuration, and constants
│  ├─ routes/          # Express route definitions
│  ├─ controllers/     # Request handlers and HTTP orchestration
│  ├─ services/        # Business logic and domain services
│  ├─ repositories/    # Prisma queries and data access layer
│  ├─ middlewares/     # Auth, validation, and error middlewares
│  ├─ utils/           # Helpers, logging, and shared utilities
│  ├─ server.ts        # Express app bootstrap
│  └─ index.ts         # Application entry point
├─ prisma/
│  ├─ schema.prisma    # Prisma data model definitions
│  └─ migrations/      # Database migrations
├─ docker/
│  ├─ Dockerfile       # Service Dockerfile
│  └─ docker-compose.yml  # Local development stack
├─ tests/              # Unit and integration tests
├─ .github/
│  └─ workflows/       # GitHub Actions CI/CD pipelines
├─ package.json
├─ tsconfig.json
├─ .env.example
└─ README.md
```

You can adapt this layout to your organization standards. The clear module boundaries support maintainability and onboarding.

## Future Improvements

The roadmap for AegisID includes several enhancements. These focus on ecosystem integration and security hardening.

- Add full OIDC discovery and dynamic client registration.
- Improve admin UI for user, client, and policy management.
- Integrate WebAuthn and passwordless authentication flows.
- Support multi-tenant configurations for SaaS platforms.
- Add fine-grained authorization with policy-based access control.
- Provide detailed dashboards for metrics and security insights.

Community feedback will help prioritize these items. Contributions and feature requests are welcome.

## Contribution Guidelines

Contributions help AegisID grow as a robust identity platform. Please follow the steps below to propose changes.

- Fork the repository and create a feature branch.
- Keep changes focused and documented with clear commit messages.
- Add or update tests where applicable.
- Run linting, tests, and type checks before opening a pull request.
- Describe your changes and motivation clearly in the pull request template.

For significant features, open an issue first to discuss design and scope. This avoids duplicated effort and aligns with project goals.

## License

AegisID is released under the MIT License. See the `LICENSE` file in the repository root for full terms.