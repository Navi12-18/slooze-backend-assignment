# GraphQL copy-paste cheat sheet (Apollo Sandbox)

Open **`http://localhost:3000/graphql`** (or **`http://localhost:3000`** — redirects to `/graphql`).

## How to use

| Sandbox panel | Paste |
|---------------|--------|
| **Operation** (top editor) | The GraphQL under **Operation** |
| **Variables** (bottom → *Variables* tab) | The JSON under **Variables** — use `{}` when it says *empty* |
| **HTTP HEADERS** (bottom → *HTTP HEADERS* tab) | The JSON under **HTTP Headers** |

**Seed password (all users):** `SloozeDemo#2026`

**Placeholders**

- `REPLACE_ACCESS_TOKEN` — full string from `login` → `accessToken` (no line breaks).
- `REPLACE_*_ID` — copy real ids from a previous response.

---

## 0 — `login` (no JWT)

**HTTP Headers:** leave empty or `{}`

**Operation:**

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
  }
}
```

**Variables:**

```json
{
  "input": {
    "email": "thanos@slooze.test",
    "password": "SloozeDemo#2026"
  }
}
```

**Other emails (same password):**

| Email | Role | Country |
|-------|------|---------|
| `nick.fury@slooze.test` | Admin | (global) |
| `captain.marvel@slooze.test` | Manager | India |
| `captain.america@slooze.test` | Manager | America |
| `thor@slooze.test` | Member | India |
| `travis@slooze.test` | Member | America |

---

## 1 — `me`

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
query Me {
  me {
    id
    email
    displayName
    role
    country
  }
}
```

**Variables:**

```json
{}
```

---

## 2 — `restaurants`

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
query Restaurants {
  restaurants {
    id
    name
    country
    city
    description
    menuItems {
      id
      name
      priceCents
      currency
    }
  }
}
```

**Variables:**

```json
{}
```

---

## 3 — `restaurant` (by id)

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
query OneRestaurant($id: ID!) {
  restaurant(id: $id) {
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

**Variables:**

```json
{
  "id": "REPLACE_RESTAURANT_ID"
}
```

---

## 4 — `myOrders`

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
query MyOrders {
  myOrders {
    id
    userId
    restaurantId
    status
    country
    lines {
      id
      quantity
      unitPriceCents
      menuItem {
        name
      }
    }
  }
}
```

**Variables:**

```json
{}
```

---

## 5 — `activeCart`

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
query ActiveCart {
  activeCart {
    id
    userId
    restaurantId
    status
    country
    lines {
      id
      quantity
      menuItem {
        id
        name
      }
    }
  }
}
```

**Variables:**

```json
{}
```

---

## 6 — `addToCart`

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
mutation AddToCart($input: AddToCartInput!) {
  addToCart(input: $input) {
    id
    status
    country
    lines {
      id
      quantity
      unitPriceCents
      menuItem {
        name
      }
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "restaurantId": "REPLACE_RESTAURANT_ID",
    "menuItemId": "REPLACE_MENU_ITEM_ID",
    "quantity": 1
  }
}
```

Use ids from `restaurants` for your user’s allowed country.

---

## 7 — `setCartLineQuantity`

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
mutation SetQty($orderLineId: ID!, $quantity: Int!) {
  setCartLineQuantity(orderLineId: $orderLineId, quantity: $quantity) {
    id
    status
    lines {
      id
      quantity
    }
  }
}
```

**Variables:**

```json
{
  "orderLineId": "REPLACE_ORDER_LINE_ID",
  "quantity": 2
}
```

`orderLineId` = `activeCart.lines[].id`. Use `quantity: 0` to remove a line.

---

## 8 — `paymentMethods`

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
query PayMethods($userId: ID!) {
  paymentMethods(userId: $userId) {
    id
    userId
    label
    provider
    last4
    isDefault
    country
  }
}
```

**Variables:**

```json
{
  "userId": "REPLACE_USER_ID"
}
```

Use the **customer’s** user id (e.g. `me.id`). Managers may only query users in their country; Admins any user.

---

## 9 — `checkout` (Manager or Admin only)

Payment method must belong to the **order owner** (the user whose cart it is), and match order country.

**HTTP Headers** (use **Captain Marvel**, **Captain America**, or **Nick Fury** token — not a Member):

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
mutation Checkout($orderId: ID!, $paymentMethodId: ID!) {
  checkout(orderId: $orderId, paymentMethodId: $paymentMethodId) {
    id
    status
    country
  }
}
```

**Variables:**

```json
{
  "orderId": "REPLACE_ORDER_ID",
  "paymentMethodId": "REPLACE_PAYMENT_METHOD_ID"
}
```

Example flow: **Thanos** builds cart (`addToCart` / `activeCart`) → copy `order.id` and a **Thanos** `paymentMethods(userId: thanosId)` → **Captain Marvel** (India) runs `checkout` with that `orderId` and Thanos’s `paymentMethodId`.

---

## 10 — `cancelOrder` (Manager or Admin only)

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
mutation Cancel($orderId: ID!) {
  cancelOrder(orderId: $orderId) {
    id
    status
  }
}
```

**Variables:**

```json
{
  "orderId": "REPLACE_ORDER_ID"
}
```

Order must be **PLACED** (not `CART`).

---

## 11 — `createPaymentMethod` (Admin only)

**HTTP Headers** (Nick Fury):

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
mutation CreatePm($input: CreatePaymentMethodInput!) {
  createPaymentMethod(input: $input) {
    id
    userId
    label
    last4
    country
  }
}
```

**Variables:**

```json
{
  "input": {
    "userId": "REPLACE_USER_ID",
    "label": "Visa Test",
    "provider": "mock_card",
    "last4": "4242",
    "country": "INDIA",
    "isDefault": true
  }
}
```

`country` must be `INDIA` or `AMERICA` and match the user’s country.

---

## 12 — `updatePaymentMethod` (Admin only)

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
mutation UpdatePm($input: UpdatePaymentMethodInput!) {
  updatePaymentMethod(input: $input) {
    id
    label
    last4
    isDefault
  }
}
```

**Variables:**

```json
{
  "input": {
    "id": "REPLACE_PAYMENT_METHOD_ID",
    "label": "Updated label"
  }
}
```

---

## 13 — `deletePaymentMethod` (Admin only)

**HTTP Headers:**

```json
{
  "Authorization": "Bearer REPLACE_ACCESS_TOKEN"
}
```

**Operation:**

```graphql
mutation DeletePm($id: ID!) {
  deletePaymentMethod(id: $id)
}
```

**Variables:**

```json
{
  "id": "REPLACE_PAYMENT_METHOD_ID"
}
```

---

## Role checks (expected errors)

| Action | Token | Expected |
|--------|-------|----------|
| `checkout` | Member (e.g. Thanos) | Error — Members cannot checkout |
| `cancelOrder` | Member | Error — Members cannot cancel |
| `createPaymentMethod` | Manager / Member | Error — Admin only |
| `restaurants` | Travis | Only America restaurants |
| `restaurants` | Nick Fury | All countries |

---

## PowerShell (optional)

**Login:**

```powershell
$body = '{"query":"mutation($input:LoginInput!){login(input:$input){accessToken}}","variables":{"input":{"email":"thanos@slooze.test","password":"SloozeDemo#2026"}}}'
Invoke-RestMethod -Uri "http://localhost:3000/graphql" -Method Post -ContentType "application/json" -Body $body
```

**`me`:**

```powershell
$h = @{ Authorization = "Bearer REPLACE_ACCESS_TOKEN" }
Invoke-RestMethod -Uri "http://localhost:3000/graphql" -Method Post -ContentType "application/json" -Headers $h -Body '{"query":"query { me { id email role country } }"}'
```
