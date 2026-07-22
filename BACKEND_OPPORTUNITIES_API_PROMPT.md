# Backend API Specification — Opportunities

This document describes the REST API contract the frontend expects for the
Opportunities module. Implement these endpoints on the backend so the admin
panel and public pages can manage and display opportunities.

---

## Base URL

All endpoints are relative to the API root used by the frontend BFF proxy
(e.g. `/api/opportunities`).

---

## Data Model

```ts
interface Opportunity {
  _id: string;
  id: string;
  slug: string;
  type: string; // Tender | Job | Internship | Consultancy | RFP | RFQ | EOI | Training | Event
  title: string;
  organization: {
    name: string;
    logo: string;
    website: string;
  };
  image: string; // uploaded file path or URL
  shortDescription: string;
  description: string;
  category: string;
  location: string;
  employmentType: string | null;
  salary: string | null;
  budget: string | null;
  deadline: string; // ISO date
  publishedAt: string; // ISO date
  contact: {
    email: string;
    phone: string;
  };
  requirements: string[];
  documents: { name: string; url: string }[];
  benefits: string[];
  featured: boolean;
  status: string; // Open | Closed
  views: number;
  applicants: number | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Endpoints

### 1. List Public Opportunities

```
GET /opportunities/public
```

**Query Params**

| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| type | string | Filter by type |
| search | string | Search in title/org |
| featured | boolean | Filter featured only |
| sort | string | Sort field (e.g. `-publishedAt`) |

**Response**

```ts
{
  opportunities: Opportunity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

### 2. List Admin Opportunities

```
GET /opportunities/admin
```

**Query Params** — same as public, plus:

| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status |

**Response** — same shape as public list.

---

### 3. Get Opportunity by ID

```
GET /opportunities/:id
```

**Response** — single `Opportunity` object.

---

### 4. Get Opportunity by Slug

```
GET /opportunities/slug/:slug
```

**Response** — single `Opportunity` object.

---

### 5. Get Featured Opportunities

```
GET /opportunities/featured
```

**Query Params**

| Param | Type | Description |
|-------|------|-------------|
| limit | number | Max items (default: 3) |

**Response** — array of `Opportunity`.

---

### 6. Create Opportunity

```
POST /opportunities
Content-Type: multipart/form-data
```

**Form Fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | yes | Opportunity type |
| title | string | yes | Title |
| org | string | yes | Organization name |
| date | string | yes | Deadline (ISO date) |
| image | File | no | Featured image |
| status | string | no | `active` or `closed` |
| visible | boolean | no | Visibility flag |
| shortDescription | string | yes | Short summary |
| description | string | yes | Full description |
| category | string | yes | Category |
| location | string | yes | Location |
| employmentType | string | no | Employment type |
| salary | string | no | Salary/stipend |
| budget | string | no | Budget |
| contactEmail | string | yes | Contact email |
| contactPhone | string | yes | Contact phone |
| requirements | JSON string | no | Array of requirement strings |
| benefits | JSON string | no | Array of benefit strings |
| featured | boolean | no | Featured flag |

**Behavior**

- Generate `slug` from `title` (lowercase, hyphens).
- Set `publishedAt` to current date.
- Set `status` to `Open` if `status` is `active`, else `Closed`.
- Store uploaded `image` file and return the file path in `image`.

**Response** — created `Opportunity` object.

---

### 7. Update Opportunity

```
PUT /opportunities/:id
Content-Type: multipart/form-data
```

**Form Fields** — same as create. All fields are optional; only provided
fields should be updated.

**Response** — updated `Opportunity` object.

---

### 8. Delete Opportunity

```
DELETE /opportunities/:id
```

**Response** — `204 No Content`.

---

### 9. Toggle Opportunity Status

```
PATCH /opportunities/:id/status
Content-Type: application/json
```

**Body**

```ts
{ status: "Open" | "Closed" }
```

**Response** — updated `Opportunity` object.

---

## Notes

- All dates should be returned as ISO 8601 strings.
- The `slug` must be unique across all opportunities.
- The `image` field should store the uploaded file path (e.g.
  `/uploads/opportunities/xxx.jpg`) or a full URL if using external storage.
- The `requirements` and `benefits` fields are sent as JSON strings in
  multipart form data; parse them on the backend.
- The frontend BFF proxy already handles authentication; these endpoints
  should validate the admin token for write operations.
