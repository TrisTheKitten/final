## Stock Management System (Next.js + MongoDB)

A small inventory and customer management app built with Next.js (App Router) and MongoDB/Mongoose. It demonstrates full CRUD for products, categories, and customers, with a Material UI-based interface and RESTful API routes.

### Tech Stack
- Next.js 14 (App Router) with `basePath`
- MongoDB with Mongoose
- Material UI (MUI), MUI X DataGrid
- React Hook Form
- Tailwind CSS (utility classes and PostCSS config present)

---

## Getting Started

### Prerequisites
- Node.js and npm/pnpm
- A MongoDB instance (Atlas or local)

### 1) Environment Variables
Create a `.env` file in the project root with at least:

```bash
MONGODB_URI="your-mongodb-connection-string"

# API base used by client-side fetches
# With the current Next.js basePath, a safe default is:
NEXT_PUBLIC_API_URL="/fin-customer/api"
```

Notes:
- The app requires `MONGODB_URI`. If missing, the server throws: "Please define the MONGODB_URI environment variable inside .env".
- `NEXT_PUBLIC_API_URL` is read on the client. Because `next.config.mjs` sets `basePath: '/fin-customer'`, the API is served under `/fin-customer/api`.
- On the product and customer detail pages, a fallback of `"/fin-customer/api"` is used when `NEXT_PUBLIC_API_URL` is not provided.

### 2) Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3) Run
```bash
npm run dev
```
Open `http://localhost:3000/fin-customer` (because of the configured basePath).

### 4) Build & Start (Production)
```bash
npm run build
npm run start
```

---

## Application URLs (with basePath)
- Home: `/fin-customer`
- Products: `/fin-customer/product`
- Product detail: `/fin-customer/product/[id]`
- Categories: `/fin-customer/category`
- Customers: `/fin-customer/customer`
- Experimental V2 pages: `/fin-customer/v2/*`

---

## API Overview
All endpoints are served under `NEXT_PUBLIC_API_URL` (default `/fin-customer/api`).

### Category
- `GET /category`
  - Optional query params:
    - `pno` (number): simple pagination page number (page size currently hard-coded to 3)
    - `s` (string): case-insensitive name search
- `POST /category`
  - Body: `{ name: string, order?: number }`
- `PUT /category`
  - Body: `{ _id: string, name?: string, order?: number }` (updates by `_id`)
- `GET /category/:id`
- `DELETE /category/:id`

Example create:
```bash
curl -X POST "$HOST/fin-customer/api/category" \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics","order":1}'
```

### Product
- `GET /product`
- `POST /product`
  - Body (required): `{ code, name, description, price }`
  - Optional: `category` (ObjectId string)
  - The API coerces `price` to a `Number` and strips empty `_id`/`category`
- `PUT /product`
  - Body: `{ _id: string, ...fieldsToUpdate }` (returns updated document)
- `PATCH /product`
  - Same shape as `PUT`
- `GET /product/:id`
- `DELETE /product/:id`

Example create:
```bash
curl -X POST "$HOST/fin-customer/api/product" \
  -H "Content-Type: application/json" \
  -d '{"code":"SKU-001","name":"Keyboard","description":"Mechanical","price":99.99}'
```

### Customer
- `GET /customer`
- `POST /customer`
  - Body: `{ name?: string, dateOfBirth?: string, memberNumber?: number, interests?: string }`
  - The API coerces `memberNumber` to `Number` and `dateOfBirth` to `Date` when provided
- `PUT /customer`
  - Body: `{ _id: string, ...fieldsToUpdate }`
- `PATCH /customer`
- `GET /customer/:id`
- `DELETE /customer/:id`

Example create:
```bash
curl -X POST "$HOST/fin-customer/api/customer" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","memberNumber":123,"interests":"Books"}'
```

---

## Data Models (Mongoose)
- `Product` (`models/Product.js`)
  - `{ code: String, name: String, description: String, price: Number, category?: ObjectId(ref: "category") }`
- `Category` (`models/Category.js`)
  - `{ name: String, order?: Number }`
- `Customer` (`models/Customer.js`)
  - `{ name?: String, dateOfBirth?: Date, memberNumber?: Number, interests?: String }`

---

## Key Implementation Details
- Database connection: `lib/db.js`
  - Uses a global cached connection to avoid re-connecting on every request
- Instrumentation hook: `instrumentation.js`
  - Connects to MongoDB during Next.js instrumentation `register()`
- Base path: `next.config.mjs` sets `basePath: '/fin-customer'`
- Path alias: `@/*` maps to project root (`jsconfig.json`)
- UI: Material UI + MUI X DataGrid; React Hook Form for forms; Tailwind configured in `tailwind.config.js`

---

## Project Structure (high-level)
```
app/
  api/
    category/              # REST endpoints for Category
    customer/              # REST endpoints for Customer
    product/               # REST endpoints for Product
  category/                # Category management UI
  customer/                # Customer management UI
  product/                 # Product management UI
  v2/                      # Experimental UI variants
  components/              # Shared UI (e.g., ResponsiveAppBar)
lib/
  db.js                    # Mongoose connection with cache
models/                    # Mongoose models: Category, Customer, Product
instrumentation.js         # Next.js instrumentation hook (DB connect)
next.config.mjs            # basePath, experimental flags
```

---

## Scripts
- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm run start` – Run the production build
- `npm run lint` – Lint

---

## Troubleshooting
- Requests return 404 at `/api/*`
  - Ensure you are calling under the base path: `/fin-customer/api/*`
  - Check `NEXT_PUBLIC_API_URL` is set appropriately for your environment
- Database connection errors
  - Verify `MONGODB_URI` in `.env`
  - Ensure your MongoDB instance is reachable and IP-whitelisted (Atlas)

