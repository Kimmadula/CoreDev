# System Architecture Diagrams

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER / CLIENT                         │
│  http://localhost:5173/admin                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    (HTTP Requests)
                           │
          ┌────────────────┴────────────────┐
          ↓                                 ↓
┌──────────────────────┐        ┌──────────────────────┐
│   FRONTEND (React)   │        │  PUBLIC SITE (React) │
│  Admin Interface     │        │  User-facing site    │
│                      │        │                      │
│ • AdminKeyPage       │        │ • ProductsPage       │
│ • AdminProductsPage  │        │ • ProductPage        │
│ • AdminSectionsPage  │        │ • SectionPage        │
│ • AdminArticlesPage  │        │ • ArticlePage        │
└──────────────────────┘        └──────────────────────┘
          │                              │
          │ (REST API Calls)            │ (REST API Calls)
          │ X-ADMIN-KEY header          │ No auth required
          │                              │
          └────────────────┬─────────────┘
                           ↓
          ┌──────────────────────────────┐
          │  BACKEND (Laravel API)       │
          │  http://127.0.0.1:8000/api   │
          │                              │
          │ ┌────────────────────────┐  │
          │ │  API Routes            │  │
          │ ├────────────────────────┤  │
          │ │ Public Routes          │  │
          │ │ • GET /products        │  │
          │ │ • GET /articles        │  │
          │ │                        │  │
          │ │ Admin Routes           │  │
          │ │ • POST /products       │  │
          │ │ • PUT /products/{id}   │  │
          │ │ • DELETE /products/{id}│  │
          │ │ (+ sections & articles)│  │
          │ └────────────────────────┘  │
          │           ↓                  │
          │ ┌────────────────────────┐  │
          │ │  Controllers           │  │
          │ ├────────────────────────┤  │
          │ │ ProductAdminController │  │
          │ │ SectionAdminController │  │
          │ │ ArticleAdminController │  │
          │ └────────────────────────┘  │
          │           ↓                  │
          │ ┌────────────────────────┐  │
          │ │  Models & Validation   │  │
          │ ├────────────────────────┤  │
          │ │ Product                │  │
          │ │ Section                │  │
          │ │ Article                │  │
          │ └────────────────────────┘  │
          │           ↓                  │
          └──────────────────────────────┘
                      ↓
          ┌──────────────────────────────┐
          │  DATABASE (MySQL/SQLite)     │
          │                              │
          │ ┌────────────────────────┐  │
          │ │  Tables                │  │
          │ ├────────────────────────┤  │
          │ │ products               │  │
          │ │ sections               │  │
          │ │ articles               │  │
          │ └────────────────────────┘  │
          └──────────────────────────────┘
```

## Data Relationships Diagram

```
                    ┌─────────────┐
                    │   PRODUCT   │
                    │             │
                    │ • id (PK)   │
                    │ • name      │
                    │ • slug      │
                    │ • description
                    └──────┬──────┘
                           │
                    (One-to-Many)
                           │
        ┌──────────────────┴──────────────────┐
        ↓                                     ↓
 ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
 │  SECTION    │  │  SECTION    │  │  SECTION    │
 │             │  │             │  │             │
 │ • id (PK)   │  │ • id (PK)   │  │ • id (PK)   │
 │ • product_id│  │ • product_id│  │ • product_id│
 │ • title     │  │ • title     │  │ • title     │
 │ • slug      │  │ • slug      │  │ • slug      │
 └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
        │                 │                 │
        (1:N)        (1:N)                (1:N)
        │                 │                 │
     ┌──┴──┐           ┌──┴──┐           ┌──┴──┐
     ↓     ↓           ↓     ↓           ↓     ↓
 ┌────┐ ┌────┐   ┌────┐ ┌────┐   ┌────┐ ┌────┐
 │ART │ │ART │   │ART │ │ART │   │ART │ │ART │
 └────┘ └────┘   └────┘ └────┘   └────┘ └────┘

ARTICLE (All)
├─ id (PK)
├─ section_id (FK)
├─ title
├─ slug (UNIQUE)
├─ content
└─ timestamps
```

## Admin Interface Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      /admin Route                               │
│                                                                 │
│                    ┌──────────────────┐                        │
│                    │  AdminKeyPage    │                        │
│                    │                  │                        │
│                    │ Enter Admin Key  │                        │
│                    │    & Continue    │                        │
│                    └────────┬─────────┘                        │
│                             │                                  │
│                    (Admin Key Stored)                          │
│                             │                                  │
│                 ┌───────────┴───────────┐                     │
│                 ↓                       ↓                     │
│        ┌──────────────────┐   ┌──────────────────┐            │
│        │ AdminProductsPage│   │AdminSectionsPage │            │
│        │ /admin/products  │   │ /admin/sections  │            │
│        │                  │   │                  │            │
│        │ • View Products  │   │ • View Sections  │            │
│        │ • Create Product │   │ • Create Section │            │
│        │ • Edit Product   │   │ • Edit Section   │            │
│        │ • Delete Product │   │ • Delete Section │            │
│        │ • Manage Section ├──→│ • Filter by Product           │
│        │   (quick link)   │   │ • Link to Articles            │
│        └──────────────────┘   └────────┬─────────┘            │
│                                        │                      │
│                                        ↓                      │
│                        ┌──────────────────────┐               │
│                        │AdminArticlesPage    │               │
│                        │ /admin/articles     │               │
│                        │                     │               │
│                        │ • View Articles     │               │
│                        │ • Create Article    │               │
│                        │ • Edit Article      │               │
│                        │ • Delete Article    │               │
│                        │ • Filter by Section │               │
│                        │ • HTML Content Edit │               │
│                        └─────────────────────┘               │
│                                                                 │
│  All pages have "Back to Admin" and navigation links           │
└─────────────────────────────────────────────────────────────────┘
```

## Request/Response Flow for Creating an Article

```
┌──────────────────────────────────────────────────────────────────┐
│  BROWSER / ADMIN INTERFACE                                       │
│                                                                  │
│  User fills form:                                               │
│  • Section ID: 5                                                │
│  • Title: "Getting Started"                                     │
│  • Slug: "getting-started"                                      │
│  • Content: "<h2>How to start</h2><p>Follow steps...</p>"       │
│                                                                  │
│  Clicks "Create Article"                                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │
              (HTTP POST Request)
                         │
     ┌───────────────────┴────────────────────┐
     │                                        │
     │  POST /api/admin/articles              │
     │  Headers:                              │
     │  • Content-Type: application/json      │
     │  • X-ADMIN-KEY: admin-key-value        │
     │                                        │
     │  Body:                                 │
     │  {                                     │
     │    "section_id": 5,                    │
     │    "title": "Getting Started",         │
     │    "slug": "getting-started",          │
     │    "content": "<h2>How to...</h2>..."  │
     │  }                                     │
     │                                        │
     └───────────────┬────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │  BACKEND (Laravel)     │
        │                        │
        │ 1. Check X-ADMIN-KEY   │ ← authentication
        │    ✓ Valid             │
        │                        │
        │ 2. Validate Input      │
        │    ✓ section_id exists │
        │    ✓ title not empty   │
        │    ✓ slug not empty    │
        │    ✓ slug is unique    │
        │    ✓ content not empty │
        │                        │
        │ 3. Create Article      │
        │    INSERT INTO articles
        │    (section_id, title, │
        │     slug, content)     │
        │    VALUES (5, "...", ...)
        │                        │
        │ 4. Retrieve Created    │
        │    Article (id: 42)    │
        │                        │
        │ 5. Return Response     │
        └────────────────┬───────┘
                         │
              (HTTP 200 OK Response)
                         │
     ┌───────────────────┴────────────────────┐
     │                                        │
     │  Status: 200                           │
     │  Body:                                 │
     │  {                                     │
     │    "id": 42,                           │
     │    "section_id": 5,                    │
     │    "title": "Getting Started",         │
     │    "slug": "getting-started",          │
     │    "content": "<h2>How to...</h2>...",│
     │    "created_at": "2026-01-29T...",    │
     │    "updated_at": "2026-01-29T..."     │
     │  }                                     │
     │                                        │
     └───────────────┬────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│  BROWSER / ADMIN INTERFACE                                       │
│                                                                  │
│  Frontend receives response                                     │
│  ✓ Article created successfully!                               │
│                                                                  │
│  Updates UI:                                                    │
│  • Clears form fields                                           │
│  • Shows success message                                        │
│  • Reloads articles list                                        │
│  • New article appears in list                                  │
│  • Auto-dismisses success message (3s)                          │
│                                                                  │
│  PUBLIC SITE (automatically):                                  │
│  • Article visible at:                                          │
│    /article/getting-started                                     │
│  • Lists in section:                                            │
│    /section/{section-slug}                                      │
└──────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  User submits form with invalid data                            │
│  (e.g., slug already exists)                                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
              (HTTP POST Request)
                     ↓
        ┌────────────────────────┐
        │  BACKEND (Laravel)     │
        │                        │
        │ 1. Check X-ADMIN-KEY   │
        │    ✓ Valid             │
        │                        │
        │ 2. Validate Input      │
        │    ✗ Slug already exists
        │      in articles table │
        │                        │
        │ 3. Return Error        │
        │    Response            │
        └────────────────┬───────┘
                         │
        (HTTP 422 Validation Error)
                         │
     ┌───────────────────┴────────────────────┐
     │                                        │
     │  Status: 422                           │
     │  Body:                                 │
     │  {                                     │
     │    "message": "Slug already exists"    │
     │  }                                     │
     │                                        │
     └───────────────┬────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│  BROWSER / ADMIN INTERFACE                                       │
│                                                                  │
│  Frontend receives error response                               │
│                                                                  │
│  Displays to user:                                              │
│  ✗ "Slug already exists"                                        │
│                                                                  │
│  User can:                                                      │
│  • Change slug to unique value                                  │
│  • Try again                                                    │
│                                                                  │
│  Form remains populated with data                               │
└──────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User navigates to /admin
        ↓
┌────────────────────────┐
│  Check localStorage    │
└────────────────────────┘
        ↓
    ┌───┴───┐
    │       │
   YES     NO
    │       │
    ↓       ↓
Proceed   Show input form
to menu   "Enter Admin Key"
         User enters key
            & clicks
         "Continue"
            ↓
      localStorage.setItem(
        "ADMIN_KEY",
        key_value
      )
            ↓
         Navigate to
        /admin/products
            ↓
   ┌───────────────────┐
   │  Subsequent       │
   │  API requests     │
   │  include:         │
   │                   │
   │  X-ADMIN-KEY:     │
   │  localStorage[    │
   │    ADMIN_KEY      │
   │  ]                │
   └───────────────────┘
            ↓
       Backend checks:
       Is key valid?
            ↓
        ┌───┴───┐
        │       │
       YES     NO
        │       │
        ↓       ↓
    Process  Return 401
    request  Unauthorized
```

## Content Visibility

```
ADMIN CREATES CONTENT
│
├─ Product
│  ├─ Created: ✓ Saved to DB
│  └─ Public: ✓ Visible immediately
│
├─ Section (within Product)
│  ├─ Created: ✓ Saved to DB
│  └─ Public: ✓ Visible immediately
│     (Linked via product)
│
└─ Article (within Section)
   ├─ Created: ✓ Saved to DB
   └─ Public: ✓ Visible immediately
      (Linked via section)

┌─────────────────────┐
│  PUBLIC USERS SEE:  │
│                     │
│  1. Products List   │
│     GET /products   │
│                     │
│  2. Product Details │
│     GET /product/{slug}
│                     │
│  3. Sections List   │
│     GET /product/   │
│     {slug}/sections │
│                     │
│  4. Articles List   │
│     GET /section/   │
│     {slug}/articles │
│                     │
│  5. Article Details │
│     GET /article/{slug}
│                     │
└─────────────────────┘
```

## File Organization

```
coreDev/
│
├── backend/ (Laravel)
│   ├── app/
│   │   ├── Models/
│   │   │   ├── Product.php ✏️
│   │   │   ├── Section.php ✏️
│   │   │   ├── Article.php ✏️
│   │   │   └── User.php
│   │   └── Http/
│   │       └── Controllers/
│   │           └── Api/
│   │               ├── PublicController.php
│   │               └── Admin/
│   │                   ├── ProductAdminController.php ✏️
│   │                   ├── SectionAdminController.php ✏️
│   │                   └── ArticleAdminController.php ✏️
│   ├── routes/
│   │   └── api.php ✏️
│   ├── database/
│   │   └── migrations/
│   │       ├── create_products_table.php
│   │       ├── create_sections_table.php
│   │       └── create_articles_table.php
│   ├── artisan
│   ├── .env
│   ├── composer.json
│   └── ...
│
├── frontend/ (React)
│   ├── src/
│   │   ├── App.jsx ✏️
│   │   ├── api.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── pages/
│   │       ├── ProductsPage.jsx
│   │       ├── ProductPage.jsx
│   │       ├── SectionPage.jsx
│   │       ├── ArticlePage.jsx
│   │       └── admin/
│   │           ├── AdminKeyPage.jsx ✏️
│   │           ├── AdminProductsPage.jsx ✏️
│   │           ├── AdminSectionsPage.jsx ✨
│   │           └── AdminArticlesPage.jsx ✨
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── Documentation/
│   ├── README.md ✏️
│   ├── README_CMS.md ✨
│   ├── QUICKSTART.md ✨
│   ├── IMPLEMENTATION_GUIDE.md ✨
│   ├── API_REFERENCE.md ✨
│   ├── CHANGES_SUMMARY.md ✨
│   ├── IMPLEMENTATION_CHECKLIST.md ✨
│   └── FINAL_SUMMARY.md ✨
│
└── .gitignore

Legend:
✏️  = Modified
✨  = New
```

---

This documentation provides visual understanding of how all components fit together!
