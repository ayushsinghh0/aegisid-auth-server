# 🔐 AegisID — Production-Grade Authentication & Identity Platform

AegisID is a **fully functional OAuth 2.0 and OpenID Connect (OIDC) identity provider** built from scratch using Node.js, TypeScript, Prisma, and PostgreSQL.

It implements the same core architecture used by systems like **Auth0, Clerk, and Okta**, and is designed to demonstrate deep understanding of modern authentication, security engineering, and distributed system design.

---

## 🚀 Why AegisID?

Most developers rely on authentication libraries without understanding how they work internally.

AegisID was built to:

- Understand OAuth 2.0 & OIDC at protocol level
- Design secure token systems
- Implement PKCE and token rotation
- Build distributed JWT verification
- Practice production-grade backend engineering

This project treats authentication as **infrastructure**, not a feature.

---

## ✨ Features

### Authentication
- User registration and password login
- Secure password hashing (bcrypt)
- Multiple credential support (password + OAuth ready)

### OAuth 2.0
- Authorization Code Flow
- PKCE (S256)
- Client validation
- Redirect URI whitelisting
- Secure authorization code storage

### OpenID Connect (OIDC)
- ID Token issuance (RS256)
- `/userinfo` endpoint
- OIDC discovery endpoint
- Standard claims and scopes

### Token System
- JWT access tokens (RS256)
- Refresh tokens (hashed + rotated)
- Token revocation support
- Audience and issuer validation

### Security
- Rate limiting on auth endpoints
- Brute-force protection
- Secure cookies
- HTTPS-ready design
- No sensitive logging

### Observability
- OpenTelemetry integration
- Structured logging
- Health check endpoint

### Infrastructure
- Prisma ORM + PostgreSQL
- TypeScript-first design
- Clean layered architecture
- Environment-based configuration

---

## 🏗️ Architecture Overview

┌────────────────────────────┐
│        Client Apps         │
│   (Web / Mobile / Backend) │
└─────────────┬──────────────┘
              │ OAuth Redirect (PKCE)
              ▼
┌────────────────────────────┐
│          AegisID           │
│   Authorization Server     │
│                            │
│ • User Authentication      │
│ • OAuth / OIDC Engine      │
│ • JWT Issuer (RS256)       │
│ • JWKS Publisher           │
│ • Token Rotation           │
│ • Rate Limiting (Redis)    │
│ • Observability            │
└─────────────┬──────────────┘
              │ JWT
              ▼
┌────────────────────────────┐
│     Resource Servers       │
│     (Protected APIs)       │
└────────────────────────────┘


---

## 🔁 Authentication & Authorization Flow

### 1️⃣ OAuth + OIDC Login

```txt
Client  →  /authorize  →  User Login  →  Redirect (code)
Client  →  /token      →  Access + ID + Refresh Tokens


Client  →  API (Bearer Token)
API     →  JWKS  →  Verify Signature  →  Allow
```
This project demonstrates how real-world identity providers such as **Auth0**, **Clerk**, and **Google Identity** work internally, moving beyond simple "login with password" tutorials to enterprise-grade architecture.

---

## ✨ Key Highlights

| Feature | Description |
| :--- | :--- |
| **🚀 OAuth 2.0 & OIDC** | Full implementation of Authorization Code Flow with PKCE for public clients. |
| **🔐 RS256 Signing** | Asymmetric JWT signing using RSA key pairs (Private key signs, Public key verifies). |
| **🪪 Token Management** | Issues ID Tokens, Access Tokens, and Opaque Refresh Tokens. |
| **🔑 JWKS Endpoint** | Public endpoint (`/.well-known/jwks.json`) for automatic key discovery. |
| **⚡ Distributed Limits** | Redis-backed sliding window rate limiting to protect authentication endpoints. |
| **🧠 Secure Rotation** | Reuse detection and rotation for Refresh Tokens to prevent replay attacks. |
| **🛡️ Security First** | Brute-force protection, HTTP-only cookies, and Argon2 hashing. |
| **📊 Observability** | OpenTelemetry integration for tracing complex authentication flows. |

---

## 🏗️ System Architecture

AegisID acts as the centralized trust anchor, handling identity verification and issuing cryptographic tokens to client applications.

```mermaid
graph TD
    subgraph Client Layer
        User((User))
        ClientApp[Client App\n(Web / Mobile)]
    end
    

    subgraph AegisID Identity Platform
        LB[Load Balancer]
        AuthServer[🛡️ Authorization Server]
        Redis[(Redis Cache\nRate Limits & Sessions)]
        DB[(PostgreSQL\nUsers & Grants)]
    end

    subgraph Resource Layer
        API[Protected API]
    end

    User -->|1. Login Credentials| ClientApp
    ClientApp -->|2. Redirect (PKCE)| LB
    LB --> AuthServer
    AuthServer -->|3. Verify & Hash| DB
    AuthServer -->|4. Check Limits| Redis
    AuthServer -->|5. Issue Tokens (RS256)| ClientApp
    ClientApp -->|6. Access Token| API
    API -.->|7. Fetch Public Key (JWKS)| AuthServer





---
```

## 🔁 Authentication & Authorization Flow

### 1️⃣ OAuth + OIDC Login
Client → /authorize → User Login → Redirect(code)
Client → /token → Access + ID + Refresh Tokens

### 2️⃣ API Access

Client → API (Bearer Token)
API → JWKS → Verify → Allow




---

## 📡 OIDC Endpoints

| Endpoint | Purpose |
|----------|----------|
| /.well-known/openid-configuration | Discovery |
| /.well-known/jwks.json | Public Keys |
| /oauth/authorize | Authorization |
| /oauth/token | Token Exchange |
| /userinfo | Profile |
| /health | Liveness |

---

## 🔐 Security Model

- Passwords hashed with bcrypt/argon2
- RSA-based JWT signing (RS256)
- PKCE enforced for public clients
- Refresh tokens stored as hashes
- Token rotation enabled
- Secure cookies (HttpOnly, Secure)
- Distributed rate limiting (Redis)

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js + TypeScript |
| API | Express |
| Database | PostgreSQL + Prisma |
| Cache | Redis |
| Auth | JOSE |
| Observability | OpenTelemetry |
| Security | bcrypt, PKCE |

---

## 🚀 Local Development

### 1. Clone

```bash
git clone https://github.com/<username>/aegisid-auth-server
cd aegisid-auth-server
```
### 2. Setup Enviorment

DATABASE_URL=
REDIS_URL=
PORT=4000


### 3. Install & Run

npm install
npx prisma migrate dev
npm run dev

## Example OAuth Flow
### Step 1 — Authorize
GET /oauth/authorize?
client_id=test-client
&redirect_uri=http://localhost:3000/callback
&response_type=code
&code_challenge=XYZ

### Step 2 — Token Exchange
POST /oauth/token
{
  "grant_type": "authorization_code",
  "code": "...",
  "code_verifier": "...",
  "client_id": "test-client"
}

### Step 3 — Use Token
Authorization: Bearer <access_token>

# Deployment Guide

## Requirements

- Node.js 18+
- PostgreSQL
- Redis

## Steps

1. Set env variables
2. Run migrations
3. Start server
4. Setup reverse proxy
5. Enable HTTPS

## Scaling

- Stateless servers
- Shared Redis
- Central DB



# OAuth + OIDC Flows

## Login Flow

1. Client → /authorize
2. User login
3. Redirect(code)
4. Token exchange

## Refresh Flow

1. Send refresh token
2. Rotate
3. Issue new tokens



