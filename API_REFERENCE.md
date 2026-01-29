# API Endpoints Reference

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication
All admin endpoints require the `X-ADMIN-KEY` header with your admin key:
```
X-ADMIN-KEY: your-admin-key-here
```

---

## PUBLIC ENDPOINTS (No authentication required)

### Products
```
GET /products
Response: Array of all products ordered by name
```

```
GET /products/{slug}
Response: Single product by slug
```

```
GET /products/{slug}/sections
Response: All sections for a product
```

### Sections
```
GET /sections/{slug}/articles
Response: All articles in a section
```

### Articles
```
GET /articles/{slug}
Response: Single article by slug
```

---

## ADMIN ENDPOINTS (Requires X-ADMIN-KEY header)

### Products

#### Get All Products
```
GET /admin/products
Response: [
  {
    "id": 1,
    "name": "SAP SCM",
    "slug": "sap-scm",
    "description": "Supply Chain Management",
    "created_at": "2026-01-27T...",
    "updated_at": "2026-01-27T..."
  },
  ...
]
```

#### Create Product
```
POST /admin/products
Content-Type: application/json
Body: {
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Optional description"
}
Response: Created product object
```

#### Update Product
```
PUT /admin/products/{id}
Content-Type: application/json
Body: {
  "name": "Updated Name",
  "slug": "updated-slug",
  "description": "Updated description"
}
Response: Updated product object
```

#### Delete Product
```
DELETE /admin/products/{id}
Response: 204 No Content
```

---

### Sections

#### Get All Sections
```
GET /admin/sections
Response: [
  {
    "id": 1,
    "product_id": 1,
    "title": "Overview",
    "slug": "overview",
    "product": { ... },
    "created_at": "2026-01-27T...",
    "updated_at": "2026-01-27T..."
  },
  ...
]
```

#### Create Section
```
POST /admin/sections
Content-Type: application/json
Body: {
  "product_id": 1,
  "title": "Section Title",
  "slug": "section-slug"
}
Response: Created section object
```

#### Update Section
```
PUT /admin/sections/{id}
Content-Type: application/json
Body: {
  "product_id": 1,
  "title": "Updated Title",
  "slug": "updated-slug"
}
Response: Updated section object
```

#### Delete Section
```
DELETE /admin/sections/{id}
Response: 204 No Content
```

---

### Articles

#### Get All Articles
```
GET /admin/articles
Response: [
  {
    "id": 1,
    "section_id": 1,
    "title": "Getting Started",
    "slug": "getting-started",
    "content": "<h2>Welcome</h2><p>...</p>",
    "section": { ... },
    "created_at": "2026-01-27T...",
    "updated_at": "2026-01-27T..."
  },
  ...
]
```

#### Create Article
```
POST /admin/articles
Content-Type: application/json
Body: {
  "section_id": 1,
  "title": "Article Title",
  "slug": "article-slug",
  "content": "HTML or plain text content"
}
Response: Created article object
```

#### Update Article
```
PUT /admin/articles/{id}
Content-Type: application/json
Body: {
  "section_id": 1,
  "title": "Updated Title",
  "slug": "updated-slug",
  "content": "Updated content"
}
Response: Updated article object
```

#### Delete Article
```
DELETE /admin/articles/{id}
Response: 204 No Content
```

---

## Error Responses

### 422 Unprocessable Entity (Validation Error)
```json
{
  "message": "Slug already exists for this product"
}
```

### 401 Unauthorized (Missing/Invalid Admin Key)
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Not Found"
}
```

---

## Example Usage with JavaScript

### Get All Products (Public)
```javascript
const response = await fetch('http://127.0.0.1:8000/api/products');
const products = await response.json();
console.log(products);
```

### Create Product (Admin)
```javascript
const response = await fetch('http://127.0.0.1:8000/api/admin/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-ADMIN-KEY': 'your-admin-key'
  },
  body: JSON.stringify({
    name: 'New Product',
    slug: 'new-product',
    description: 'A great product'
  })
});
const product = await response.json();
console.log(product);
```

### Update Article (Admin)
```javascript
const response = await fetch('http://127.0.0.1:8000/api/admin/articles/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-ADMIN-KEY': 'your-admin-key'
  },
  body: JSON.stringify({
    title: 'Updated Title',
    content: 'Updated content here'
  })
});
const article = await response.json();
console.log(article);
```

### Delete Product (Admin)
```javascript
const response = await fetch('http://127.0.0.1:8000/api/admin/products/1', {
  method: 'DELETE',
  headers: {
    'X-ADMIN-KEY': 'your-admin-key'
  }
});
console.log(response.status); // 204 No Content
```

---

## Important Notes

1. **Slug Requirements**:
   - Product slugs must be globally unique
   - Section slugs must be unique per product (can reuse same slug in different products)
   - Article slugs must be globally unique

2. **Cascading Deletes**:
   - Deleting a product will delete all its sections and articles
   - Deleting a section will delete all its articles

3. **Validation Rules**:
   - All `name`/`title` fields are required (max 255 characters)
   - Slug fields are required
   - Description fields are optional
   - Article content is required

4. **Response Format**:
   - All successful responses return JSON
   - 204 No Content responses have no body
   - Timestamps are in ISO 8601 format

5. **Admin Key**:
   - Must be configured in your Laravel environment
   - Should be stored securely
   - Never expose in client-side code (use localStorage only in development)
