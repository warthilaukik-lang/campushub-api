# CampusHub API

![CI](https://github.com/warthilaukik-lang/campushub-api/actions/workflows/ci.yml/badge.svg)

**Live:** https://campushub-api-b2xp.onrender.com/health

REST API for college notes and previous-year question papers.
JWT authentication with refresh tokens, role-based access, file upload and search.

## Status
- [x] Project skeleton, Prisma schema, health endpoint
- [x] JWT auth: register, login, refresh tokens
- [x] Notes CRUD with file upload and search
- [x] Roles and bookmarks
- [x] Tests and CI pipeline
- [x] Live deployment

## Screenshots

![Health endpoint](docs/health.webp)
![CI pipeline](docs/ci.webp)

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /health | none | Health check |
| POST | /auth/register | none | Create an account |
| POST | /auth/login | none | Get access + refresh tokens |
| POST | /auth/refresh | none | Exchange a refresh token |
| GET | /me | Bearer | Current user |
| GET | /notes | none | List and search notes |
| GET | /notes/:id | none | Get one note |
| POST | /notes | Bearer | Upload a note (multipart, field `file`) |
| PATCH | /notes/:id | Bearer | Update your own note |
| DELETE | /notes/:id | admin | Delete a note |
| GET | /bookmarks/me | Bearer | Your bookmarks |
| POST | /bookmarks | Bearer | Bookmark a note |
| DELETE | /bookmarks/:id | Bearer | Remove a bookmark |

## Stack

Node.js · TypeScript · Express · PostgreSQL · Prisma · JWT · Zod · Multer

## Run locally

1. Start a database:

    docker run -d --name campushub-db \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=campushub \
      -p 5433:5432 postgres:16-alpine

2. Configure and install:

    cp .env.example .env
    npm install
    npx prisma migrate dev
    npm run dev

The API runs at http://localhost:3000

Or with Docker Compose (API + database together):

    docker compose -p campushub-stack up --build -d

Then create the tables:

    export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/campushub?schema=public"
    npx prisma migrate deploy

## Load test

Run with k6 against the live deployment: 20 virtual users ramping up over 1m45s.

| Metric | Result |
|---|---|
| Total requests | 14,313 |
| Throughput | 136.2 req/s |
| p95 latency | 126 ms |
| Failed requests | 0.00% |

Run it yourself:

    k6 run -e BASE_URL=https://campushub-api-b2xp.onrender.com loadtest.js

## How the pipeline works

Push to `main` → GitHub Actions runs the test suite against a Postgres
service container → the Docker image is built and pushed to GHCR →
Render redeploys the live service automatically.

## Environment variables

| Variable | Purpose |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Signing key for access tokens |
| JWT_REFRESH_SECRET | Signing key for refresh tokens |
| PORT | Port to listen on (default 3000) |