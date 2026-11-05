# CampusHub API

**Live:** https://campushub-api-b2xp.onrender.com/health

REST API for college notes and previous-year question papers.
JWT authentication with refresh tokens, role-based access, file upload and search.

## Status
- [x] Project skeleton, Prisma schema, health endpoint
- [x] JWT auth: register, login, refresh tokens
- [x] Notes CRUD with file upload and search
- [ ] Roles and bookmarks
- [ ] Tests and CI pipeline
- [x] Live deployment

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

## Environment variables

| Variable | Purpose |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Signing key for access tokens |
| JWT_REFRESH_SECRET | Signing key for refresh tokens |
| PORT | Port to listen on (default 3000) |
