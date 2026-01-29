# WordPress-Style Admin Content Management System - Implementation Guide

## Overview
We have created a complete admin content management system that allows administrators to add, edit, and delete content (text, headings, paragraphs, and articles) without the ability to reposition or move content - similar to WordPress with limited actions.

## Architecture

### Backend (Laravel)
The backend is built with Laravel and provides RESTful API endpoints for managing:
- **Products**: Main categories/products
- **Sections**: Sub-categories within products
- **Articles**: Detailed content within sections

### Frontend (React + Vite)
The frontend is built with React and provides admin pages for:
- **Admin Key Page**: Authentication with admin key
- **Admin Products Page**: Manage products (create, read, update, delete)
- **Admin Sections Page**: Manage sections within products
- **Admin Articles Page**: Manage articles within sections

## What Was Implemented

### Backend Changes

#### 1. **Models** (app/Models/)
- **Product.php**: Added fillable fields and hasMany relationship to sections
- **Section.php**: Added fillable fields and relationships to product and articles
- **Article.php**: Added fillable fields and belongsTo relationship to section

#### 2. **Controllers** (app/Http/Controllers/Api/Admin/)
- **ProductAdminController.php**: CRUD operations for products
  - `index()`: Get all products
  - `store()`: Create new product
  - `update()`: Update existing product
  - `destroy()`: Delete product

- **SectionAdminController.php**: CRUD operations for sections
  - `index()`: Get all sections
  - `store()`: Create new section
  - `update()`: Update existing section
  - `destroy()`: Delete section

- **ArticleAdminController.php**: CRUD operations for articles
  - `index()`: Get all articles
  - `store()`: Create new article
  - `update()`: Update existing article
  - `destroy()`: Delete article

#### 3. **API Routes** (routes/api.php)
Added GET, POST, PUT, DELETE endpoints for:
- `/admin/products`
- `/admin/sections`
- `/admin/articles`

All protected with `admin.key` middleware.

### Frontend Changes

#### 1. **Components** (src/pages/admin/)
- **AdminKeyPage.jsx**: Login with admin key + navigation menu
- **AdminProductsPage.jsx**: Manage products with full CRUD
- **AdminSectionsPage.jsx**: Manage sections (new)
- **AdminArticlesPage.jsx**: Manage articles (new)

#### 2. **Routes** (src/App.jsx)
Added new routes:
- `/admin/sections` - AdminSectionsPage
- `/admin/articles` - AdminArticlesPage

#### 3. **API Helper** (src/api.js)
Already had `apiAdmin()` function for making authenticated API calls.

## Features

### Products Management
- ✅ Create products with name, slug, and description
- ✅ Edit existing products
- ✅ Delete products
- ✅ Link to manage sections for each product

### Sections Management
- ✅ Create sections within products
- ✅ Edit sections
- ✅ Delete sections
- ✅ Slug is unique per product (not globally)
- ✅ Quick link to manage articles from each section

### Articles Management
- ✅ Create articles with title, slug, and content (HTML supported)
- ✅ Edit existing articles
- ✅ Delete articles
- ✅ Slug is unique globally
- ✅ Content can be HTML or plain text

## How to Use

### 1. Start the Backend
```bash
cd backend
php artisan serve
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Admin Panel
1. Navigate to `http://localhost:5173/admin`
2. Enter your admin key (configure in `.env` or use existing key)
3. You'll see the admin menu with navigation to:
   - Manage Products
   - Manage Sections
   - Manage Articles

### 4. Managing Content

#### Adding a Product
1. Go to "Manage Products"
2. Enter product name, slug, and description
3. Click "Create Product"

#### Adding Sections to a Product
1. Go to "Manage Products"
2. Click "Manage Sections" button on a product
3. Select the product, enter section title and slug
4. Click "Create Section"

#### Adding Articles to a Section
1. Go to "Manage Articles"
2. Select a section from the dropdown
3. Enter article title, slug, and content
4. Click "Create Article"

## File Structure

```
backend/
├── app/
│   ├── Models/
│   │   ├── Product.php (updated)
│   │   ├── Section.php (updated)
│   │   └── Article.php (updated)
│   └── Http/
│       └── Controllers/
│           └── Api/
│               └── Admin/
│                   ├── ProductAdminController.php (updated)
│                   ├── SectionAdminController.php (updated)
│                   └── ArticleAdminController.php (updated)
└── routes/
    └── api.php (updated)

frontend/
├── src/
│   ├── App.jsx (updated)
│   ├── api.js (already configured)
│   └── pages/
│       └── admin/
│           ├── AdminKeyPage.jsx (updated)
│           ├── AdminProductsPage.jsx (updated)
│           ├── AdminSectionsPage.jsx (new)
│           └── AdminArticlesPage.jsx (new)
```

## Database Schema

### products
- id (primary key)
- name (string)
- slug (string, unique)
- description (text, nullable)
- timestamps

### sections
- id (primary key)
- product_id (foreign key)
- title (string)
- slug (string)
- unique constraint: (product_id, slug)
- timestamps

### articles
- id (primary key)
- section_id (foreign key)
- title (string)
- slug (string, unique)
- content (longtext)
- timestamps

## Key Features Explained

### No Content Repositioning
Unlike some CMS systems that allow drag-and-drop reordering, this system:
- Displays content in order (products by name, sections by title, articles by title)
- Allows only editing of text/content, not reordering
- Similar to WordPress posts without repositioning

### Admin Authentication
- Uses `admin.key` middleware on backend
- Client-side storage in localStorage
- Header-based authentication (`X-ADMIN-KEY` header)

### Validation
- Required fields are validated on the backend
- Slug uniqueness is enforced
- Foreign key constraints prevent orphaned records

### Success/Error Messages
- Visual feedback for create, update, delete operations
- Error messages display validation or permission issues
- Success messages confirm completed actions

## Next Steps (Optional Enhancements)

1. **Image Upload**: Add image field to products/articles
   - Add `image_url` column to migrations
   - Implement file upload in controllers
   - Add image input to admin pages

2. **Rich Text Editor**: Use a library like Quill or TinyMCE
   - Replace textarea with rich editor component
   - Support formatted text, lists, links, etc.

3. **User Management**: Add multiple admin users
   - Create Users table with roles
   - Replace simple key with user login system

4. **Content Publishing**: Add draft/published status
   - Add `published_at` column
   - Hide draft content from public site

5. **Audit Logging**: Track who changed what
   - Log all CRUD operations
   - Show edit history for content

6. **SEO Fields**: Add meta descriptions and keywords
   - Add `meta_description`, `meta_keywords` fields
   - Display in admin forms

## Troubleshooting

### "Unauthorized" Error
- Check if admin key in localStorage matches backend
- Go to `/admin` and re-enter the key
- Clear localStorage and try again

### "Slug already exists"
- Each section must have unique slug per product
- Articles must have globally unique slugs
- Use descriptive slugs like: `getting-started`, `installation-guide`

### API Not Responding
- Ensure Laravel server is running: `php artisan serve`
- Check CORS configuration in AppServiceProvider
- Verify admin.key middleware is configured

### Database Errors
- Run migrations: `php artisan migrate`
- Check database credentials in `.env`
- Verify tables exist: `php artisan tinker` then `Schema::getTableNames()`

## Support

For issues or questions:
1. Check error messages in browser console
2. Review Laravel logs in `storage/logs/`
3. Verify database setup and migrations
4. Ensure both servers are running (Laravel + Vite)
