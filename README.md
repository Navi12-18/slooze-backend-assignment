# Slooze assignment — backend

NestJS **GraphQL** API for a food-ordering demo: **JWT** authentication, **RBAC** (Admin / Manager / Member), and **country-scoped** data (India vs America), backed by **Prisma** and **PostgreSQL**.

**GraphQL:** `http://localhost:3000/graphql` (Apollo Sandbox in the browser, or any GraphQL HTTP client). Visiting **`http://localhost:3000/`** redirects to `/graphql`.

---

## Table of contents

1. [Quick start](#quick-start)  
2. [**Where to put what (Sandbox)** — operation vs variables vs headers](#where-to-put-what-apollo-sandbox)  
3. [Hands-on test flow — login → `me` → cart → checkout](#hands-on-test-flow)  
4. [All operations (reference)](#all-operations-reference)  
5. [Demo users & roles](#demo-users--roles)  
6. [Terminal commands (PowerShell)](#terminal-commands-powershell)  
7. [Troubleshooting](#troubleshooting)  
8. [Hosting & production](#hosting--production)  
9. [Project docs & scripts](#project-docs--scripts)

---

## Quick start

**Prerequisites:** Node.js 20+ and npm, and a **PostgreSQL** instance (local or hosted).

**Local database (recommended):** from the project root, start Postgres with Docker:

```bash
docker compose up -d
```

Then copy `.env.example` to `.env` (or create `.env`) and ensure `DATABASE_URL` matches your database. The default in `.env.example` matches `docker-compose.yml` (`postgres` / `postgres` / database `slooze` on port `5432`).

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

**Environment** — create or edit `.env` in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/slooze?schema=public"
JWT_SECRET="your-long-random-secret"
PORT=3000
```

Keep `JWT_SECRET` stable while testing; changing it invalidates existing tokens.

---

## Where to put what (Apollo Sandbox)

GraphQL over HTTP uses **three different places**. Mixing them up causes red squiggles, `401 Unauthorized`, or “variable does not appear in query”.

| What | Where | Purpose |
|------|--------|---------|
| **GraphQL operation** | **Main editor** (top) | The `query { ... }` / `mutation { ... }` text only. |
| **GraphQL variables** | **Variables** / **QUERY VARIABLES** (bottom tab) | JSON whose keys match `$variableName` in the operation (e.g. `$i` → `"i"`). Used for `login(input: $i)`, `addToCart(input: $input)`, etc. |
| **JWT / auth** | **HTTP HEADERS** (bottom tab, *next to* Variables) | JSON with `Authorization`. **Not** a GraphQL variable. |

**Do not put in the Variables panel:**

- The full HTTP body `{ "query": "...", "variables": { ... } }` — that is for **curl** / **Postman** only.  
- `Authorization` — that belongs under **HTTP HEADERS**, not Variables.

**Valid JSON in HTTP HEADERS** (always include `{` and `}`):

```json
{
  "Authorization": "Bearer PASTE_ACCESS_TOKEN_HERE"
}
```

After **login**, copy `accessToken` from the response and paste it into `Bearer ` (no line breaks inside the token).

---

## Hands-on test flow

Follow in order inside Apollo Sandbox (`http://localhost:3000/graphql`). After step 1, set **HTTP HEADERS** once and reuse for steps 2–4 (same token until it expires — ~8 hours — or you change `JWT_SECRET`).

### 1. `login` (public — no `Authorization` header)

**Operation** (main editor):

```graphql
mutation Login($i: LoginInput!) {
  login(input: $i) {
    accessToken
  }
}
```

**Variables** (Variables tab):

```json
{
  "i": {
    "email": "thanos@slooze.test",
    "password": "SloozeDemo#2026"
  }
}
```

**HTTP HEADERS:** leave empty or `{}`.

Run the mutation → copy **`accessToken`** from the response.

---

### 2. `me` (protected — needs JWT)

**Operation:**

```graphql
query {
  me {
    id
    email
    displayName
    role
    country
  }
}
```

**Variables:** `{}` or leave empty (this query has no `$variables`).

**HTTP HEADERS:**

```json
{
  "Authorization": "Bearer PASTE_ACCESS_TOKEN_FROM_STEP_1"
}
```

---

### 3. `restaurants` (protected)

**Operation:**

```graphql
query {
  restaurants {
    id
    name
    country
    city
    menuItems {
      id
      name
      priceCents
    }
  }
}
```

**Variables:** none.

**HTTP HEADERS:** same `Authorization` as step 2.

As **Thanos** (India) you only see **India** restaurants. Log in as **Travis** to see **America** only; as **Nick Fury** (Admin) you see **all** countries.

---

### 4. `addToCart` (protected)

Use a `restaurantId` and `menuItemId` from the **`restaurants`** response for your user’s country.

**Operation:**

```graphql
mutation Add($input: AddToCartInput!) {
  addToCart(input: $input) {
    id
    status
    country
    lines {
      id
      quantity
      menuItem {
        name
      }
    }
  }
}
```

**Variables** (keys must match `$input` → use `"input"`):

```json
{
  "input": {
    "restaurantId": "PASTE_RESTAURANT_ID",
    "menuItemId": "PASTE_MENU_ITEM_ID",
    "quantity": 1
  }
}
```

**HTTP HEADERS:** `Authorization` as before.

---

### 5. `activeCart` (protected)

**Operation:**

```graphql
query {
  activeCart {
    id
    status
    lines {
      id
      quantity
    }
  }
}
```

**Variables:** none. **Headers:** `Authorization`.

---

### 6. `paymentMethods` (protected)

Use the **customer’s** `userId` (e.g. Thanos’s `id` from `me` or seed). Managers can list methods for users in **their** country; Admins for anyone.

**Operation:**

```graphql
query PayMethods($uid: ID!) {
  paymentMethods(userId: $uid) {
    id
    label
    last4
    country
  }
}
```

**Variables:**

```json
{
  "uid": "PASTE_USER_ID"
}
```

**HTTP HEADERS:** `Authorization` (use a Manager or Admin token if querying another user’s methods).

---

### 7. `checkout` (Manager or Admin only)

Cart must belong to the logged-in user; **payment method** must belong to that same user and match order country.

**Operation:**

```graphql
mutation Checkout($oid: ID!, $pm: ID!) {
  checkout(orderId: $oid, paymentMethodId: $pm) {
    id
    status
  }
}
```

**Variables:**

```json
{
  "oid": "ORDER_ID_FROM_ACTIVE_CART",
  "pm": "PAYMENT_METHOD_ID_FROM_paymentMethods"
}
```

**HTTP HEADERS:** token for **Captain Marvel** or **Nick Fury**, not a Member.

---

### 8. `cancelOrder` (Manager or Admin; order must be `PLACED`)

**Operation:**

```graphql
mutation Cancel($oid: ID!) {
  cancelOrder(orderId: $oid) {
    id
    status
  }
}
```

**Variables:** `{ "oid": "ORDER_ID" }` — **HTTP HEADERS:** Manager/Admin token.

---

### 9. Payment admin mutations (Admin only)

`createPaymentMethod`, `updatePaymentMethod`, `deletePaymentMethod` — use **Nick Fury**’s token. See [All operations](#all-operations-reference) for shapes; inputs go in **Variables** as `input: { ... }`.

---

## All operations (reference)

| Kind | Name | Auth | Variables in panel? |
|------|------|------|---------------------|
| Mutation | `login` | No | Yes — e.g. `$i: LoginInput!` + `login(input: $i)` → Variables: `{ "i": { "email", "password" } }` |
| Query | `me` | JWT | No |
| Query | `restaurants` | JWT | No |
| Query | `restaurant(id)` | JWT | Yes — can use inline `id:` or `$id` variable |
| Query | `myOrders` | JWT | No |
| Query | `activeCart` | JWT | No |
| Query | `paymentMethods(userId)` | JWT | Yes — `userId` as argument (use `$uid` + variables) |
| Mutation | `addToCart` | JWT | Yes — `AddToCartInput` as `input` |
| Mutation | `setCartLineQuantity` | JWT | Yes — `orderLineId`, `quantity` |
| Mutation | `checkout` | JWT + Manager/Admin | Yes — `orderId`, `paymentMethodId` |
| Mutation | `cancelOrder` | JWT + Manager/Admin | Yes — `orderId` |
| Mutation | `createPaymentMethod` | JWT + Admin | Yes — `input` |
| Mutation | `updatePaymentMethod` | JWT + Admin | Yes — `input` |
| Mutation | `deletePaymentMethod` | JWT + Admin | Yes — `id` |

**Rule:** If the operation declares `$something` in the signature, the Variables JSON must contain a key **`"something"`** (without `$`).  
**JWT** is never a GraphQL variable — always **HTTP HEADERS**.

---

## Demo users & roles

Password for everyone: **`SloozeDemo#2026`**

| Display name | Email | Role | Country |
|--------------|-------|------|---------|
| Nick Fury | nick.fury@slooze.test | Admin | — (global) |
| Captain Marvel | captain.marvel@slooze.test | Manager | India |
| Captain America | captain.america@slooze.test | Manager | America |
| Thanos | thanos@slooze.test | Member | India |
| Thor | thor@slooze.test | Member | India |
| Travis | travis@slooze.test | Member | America |

### Role matrix

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| Restaurants / menus | All countries | Own country | Own country |
| Cart / add items | Yes | Yes | Yes |
| Checkout & pay | Yes | Yes | No |
| Cancel placed order | Yes | Yes | No |
| Create / update / delete payment methods | Yes | No | No |

---

## Terminal commands (PowerShell)

From the project directory:

```powershell
# Install & DB
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Run API
npm run start:dev
```

**Login (no auth header):**

```powershell
$body = '{"query":"mutation($i:LoginInput!){login(input:$i){accessToken}}","variables":{"i":{"email":"thanos@slooze.test","password":"SloozeDemo#2026"}}}'
Invoke-RestMethod -Uri "http://localhost:3000/graphql" -Method Post -ContentType "application/json" -Body $body
```

**`me` (replace TOKEN):**

```powershell
$h = @{ Authorization = "Bearer TOKEN" }
Invoke-RestMethod -Uri "http://localhost:3000/graphql" -Method Post -ContentType "application/json" -Headers $h -Body '{"query":"query { me { email role country } }"}'
```

---

## Troubleshooting

### `401` / `UNAUTHENTICATED` on `me` or other protected fields

1. Put the token only in **HTTP HEADERS**, not in **Variables**.  
2. Use **`Bearer ` + token** or a raw JWT (supported for local dev).  
3. JSON must be valid — include closing **`}`**.  
4. After changing **`JWT_SECRET`** or resetting the DB, run **`login`** again.  
5. Compare with curl to isolate Sandbox issues:

   ```bash
   curl -s http://localhost:3000/graphql -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"query\":\"query { me { email } }\"}"
   ```

### Prisma: `P1012` / `url` not supported in schema

This project uses **Prisma 6** (`prisma` / `@prisma/client` **6.8.2**). Use the local CLI:

```bash
npx prisma generate
```

If a **global Prisma 7** binary runs, install deps in this repo and use `npx prisma` from the project root.

### Package: `@as-integrations/express5`

Required for Nest GraphQL with Express 5; listed in `package.json`. Run `npm install` if you see a missing-package error.

---

## Hosting & production

### Build and run

```bash
npm ci
npm run build
npx prisma generate
npx prisma migrate deploy
node dist/main
```

Or use the script: **`npm run start:prod`** (runs `node dist/main`). Set **`PORT`** if the host assigns one (e.g. `PORT=8080`).

### Environment variables

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Connection string for Prisma |
| `JWT_SECRET` | Yes | Long random string; changing it invalidates all tokens |
| `PORT` | No | Defaults to `3000` |
| `NODE_ENV` | No | Set to `production` on real hosts |

### Database (PostgreSQL)

The app uses **`provider = "postgresql"`** in `prisma/schema.prisma`. For **local** development, use **`docker compose up -d`** (see [Quick start](#quick-start)) or any Postgres you already run.

For **hosted** demos (Render, Railway, Fly.io, Neon, etc.):

1. Create a **PostgreSQL** database and copy its connection string.
2. Set **`DATABASE_URL`** in the host’s environment (see [Prisma Postgres connection strings](https://www.prisma.io/docs/orm/reference/connection-urls)).
3. Run **`npx prisma migrate deploy`** on deploy (or equivalent release command) so the schema is applied.

### Where to deploy (examples)

| Option | Idea |
|--------|------|
| **Render / Railway / Fly.io** | Connect repo, set env vars, build command `npm run build`, start `npm run start:prod`, run `prisma migrate deploy` as a release command if the platform supports it |
| **Docker** | Multi-stage image: `npm ci`, `npm run build`, `prisma generate`, CMD `node dist/main`; pass env at runtime |
| **VPS (Ubuntu)** | `git clone`, Node 20+, `pm2 start dist/main.js --name api`, nginx reverse proxy + HTTPS |
| **AWS / Azure / GCP** | Container service or App Service; same env + migrate pattern |

### What about Vercel?

**Vercel is built for short-lived serverless functions**, not a classic **long‑running** Nest server that calls `app.listen()` like this project. Putting **Nest + Apollo GraphQL + Prisma** on Vercel usually means:

- **Refactoring** to a serverless entry (e.g. one function that boots Nest per request, or using community adapters) — more work and cold starts.
- **No SQLite file** on disk — use **hosted PostgreSQL** (e.g. [Neon](https://neon.tech) + `DATABASE_URL` in Vercel env).
- **Migrations** run from CI or a one-off script, not from the same pattern as a VM.

So: **possible**, but **not the smoothest** fit for this repo as-is. For a take-home **demo URL**, **Render**, **Railway**, or **Fly.io** (long-lived Node process) are usually faster. If you specifically need Vercel, search for **“NestJS Vercel serverless”** and expect extra setup beyond `npm run start:prod`.

### HTTPS and GraphQL

Browsers and tools expect **HTTPS** in production. Terminate TLS at your **reverse proxy** (nginx, Caddy, load balancer) or use the platform’s automatic HTTPS.

### Demo video / live URL

For the assignment, a **public URL** plus short **demo video** is usually enough — use any host above, set secrets in the dashboard, and show `login` → `me` → `restaurants` in the recording.

---

## Project docs & scripts

| Resource | |
|----------|--|
| Architecture | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| **All GraphQL ops (copy-paste)** | [`docs/GRAPHQL_COPY_PASTE.md`](docs/GRAPHQL_COPY_PASTE.md) |
| Postman | [`postman/slooze-graphql.postman_collection.json`](postman/slooze-graphql.postman_collection.json) |

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Dev server + watch |
| `npm run build` | Build `dist/` |
| `npm run prisma:migrate` | `prisma migrate dev` |
| `npm run prisma:seed` | Seed database |
| `npm test` | Unit tests |
| `npm run test:e2e` | E2E smoke |

**Stack:** NestJS, GraphQL (code-first), Apollo Server, Prisma 6, PostgreSQL, Passport JWT, bcrypt.
