# Storefront and CRM integration

## Server-to-server connection

The Next.js server calls the CRM. The integration token is never sent to a browser.
Set the same generated secret in both local environment files:

- `backend/.env`: `STOREFRONT_INTEGRATION_TOKEN`
- `storefront/.env.local`: `CRM_STOREFRONT_TOKEN`
- Set `CRM_API_URL` in the storefront to the CRM origin, such as `http://localhost:8001` (the port the ERP frontend proxies to).

The backend reads the token for service/store inquiries and the public catalog endpoint. The catalog exposes active spare parts with an explicitly configured cost, their published retail price, and a stock availability flag; it never returns warehouse quantities or internal cost. Retail is calculated using the 65% margin already used by the storefront. Web orders are still requests for staff review: CRM creates a website lead, and does not reserve stock, record payment, or create a confirmed sales order.

## Customer portal accounts

The backend creates the `customer_portal_accounts` table on startup. A CRM superuser creates a portal login for an existing customer:

```http
POST /api/v1/portal/accounts
Authorization: Bearer <CRM superuser access token>
Content-Type: application/json

{
  "customer_id": 123,
  "username": "customer.login",
  "password": "use-a-unique-password"
}
```

Each customer can have one portal account. A superuser can review accounts with `GET /api/v1/portal/accounts`, deactivate/reactivate one with `PATCH /api/v1/portal/accounts/{id}` and `{"is_active": false}`, or reset its password with `{"password": "new-unique-password"}`. Deactivation and password changes invalidate existing portal tokens.

The customer signs in at `/client-dashboard`. Portal access is separate from employee CRM access and is scoped to the linked customer record; it includes that customer's active forklifts, rental contracts, work orders, and non-draft invoices. To show assets and service work there, their CRM records must reference the same `customer_id`.

## Running locally on Windows

Start the storefront with `npx next dev --webpack`. Turbopack can fail on Windows with exit code `0xc0000142` while compiling CSS.
