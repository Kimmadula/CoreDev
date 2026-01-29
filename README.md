# CoreDev - Help & Documentation Platform

A complete content management system built with Laravel and React, allowing admins to manage site content with a WordPress-like interface.

## 🎯 Overview

This platform allows administrators to manage products, sections, and articles through an intuitive admin panel. Admins can add, edit, and delete content without the ability to reposition elements - similar to WordPress with limited actions.

## 🚀 Quick Start

**New to this project?** Start here:

1. **[README_CMS.md](./README_CMS.md)** - Complete overview of the CMS system
2. **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
3. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Architecture and features

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README_CMS.md](./README_CMS.md) | Main CMS overview and features |
| [QUICKSTART.md](./QUICKSTART.md) | Setup and usage in 5 minutes |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Complete architecture guide |
| [API_REFERENCE.md](./API_REFERENCE.md) | API endpoint documentation |
| [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) | What was implemented |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | Verification checklist |

## 🏗️ Project Structure

```
coreDev/
├── backend/          # Laravel API server
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── ...
├── frontend/         # React admin + public site
│   ├── src/
│   ├── public/
│   └── ...
└── documentation/    # Guides and references
```

## ✨ Key Features

- ✅ **WordPress-style Admin Panel** - Intuitive content management
- ✅ **Hierarchical Content** - Products → Sections → Articles
- ✅ **Add/Edit/Delete** - Full CRUD operations
- ✅ **No Repositioning** - Fixed content structure
- ✅ **HTML Support** - Rich content in articles
- ✅ **Admin Authentication** - Secure access control
- ✅ **RESTful API** - Modern API architecture
- ✅ **Responsive Design** - Works on all devices

## 🛠️ Technology Stack

### Backend
- Laravel 12 (PHP Framework)
- MySQL/SQLite Database
- RESTful API Architecture

### Frontend  
- React 18 (UI Library)
- React Router (Navigation)
- Vite (Build Tool)
- Vanilla CSS (Styling)

## 📖 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js 16+
- Composer
- npm

### Installation

1. **Start Backend**
   ```bash
   cd backend
   composer install
   php artisan serve
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Admin Panel**
   - Go to `http://localhost:5173/admin`
   - Enter your admin key
   - Start managing content!

**See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.**

## 🎯 Common Tasks

### Create a Product
1. Go to "Manage Products"
2. Enter product name, slug, and description
3. Click "Create Product"

### Add a Section
1. Go to "Manage Sections"
2. Select a product
3. Enter section title and slug
4. Click "Create Section"

### Write an Article
1. Go to "Manage Articles"
2. Select a section
3. Enter title, slug, and content (HTML supported)
4. Click "Create Article"

### View Content Publicly
- Products: `http://localhost:5173/`
- Product details: `http://localhost:5173/product/{slug}`
- Section articles: `http://localhost:5173/section/{slug}`
- Article: `http://localhost:5173/article/{slug}`

## 🔌 API Endpoints

### Public Endpoints (No Auth Required)
```
GET  /api/products
GET  /api/products/{slug}
GET  /api/products/{slug}/sections
GET  /api/sections/{slug}/articles
GET  /api/articles/{slug}
```

### Admin Endpoints (Requires X-ADMIN-KEY Header)
```
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}

GET    /api/admin/sections
POST   /api/admin/sections
PUT    /api/admin/sections/{id}
DELETE /api/admin/sections/{id}

GET    /api/admin/articles
POST   /api/admin/articles
PUT    /api/admin/articles/{id}
DELETE /api/admin/articles/{id}
```

**See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.**

## 🔐 Security

- Admin key-based authentication
- Validated input on backend
- Foreign key constraints
- Cascading deletes for data integrity

For production, implement proper user authentication, HTTPS, rate limiting, and audit logging.

## 📋 What Can Be Customized

- ✅ Admin styling and layout
- ✅ Database schema
- ✅ API response formats
- ✅ Form fields and validation
- ✅ Public site appearance
- ✅ Admin features and workflows

## 🚫 What's Fixed (By Design)

- ❌ Content repositioning disabled (fixed structure)
- ❌ Max 3 content levels (Products → Sections → Articles)
- ❌ Limited to text/content editing (no visual builder)

## 📝 File Changes Summary

**Backend (8 files)**
- 3 Models updated
- 3 Controllers updated  
- 1 Routes file updated

**Frontend (4 files)**
- 1 App.jsx updated
- 2 Pages updated
- 2 New pages created

**Documentation (6 files)**
- QUICKSTART.md
- IMPLEMENTATION_GUIDE.md
- API_REFERENCE.md
- CHANGES_SUMMARY.md
- IMPLEMENTATION_CHECKLIST.md
- This README

## 🤝 Contributing

To extend this CMS:

1. **Add Image Uploads** - Add `image_url` column to products/articles
2. **Rich Text Editor** - Use TinyMCE or Quill library
3. **User Authentication** - Replace admin key with user login
4. **Content Versioning** - Track edit history
5. **Search Functionality** - Full-text search
6. **SEO Tools** - Meta descriptions and keywords

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check admin key in localStorage
- Clear browser cache and try again

### "Slug already exists"
- Use a unique slug
- Check existing content

### Database Errors
- Run `php artisan migrate`
- Check `.env` database credentials

### Frontend Won't Load
- Run `npm install` in frontend directory
- Clear npm cache: `npm cache clean --force`

## 📞 Support

- Check relevant documentation file
- Review error messages in browser console
- Check Laravel logs in `storage/logs/`
- Verify both servers are running

## 📄 License

This project is proprietary. All rights reserved.

## 👥 Created By

Your Development Team

## ✅ Status

**COMPLETE AND READY FOR USE** ✨

Last Updated: January 29, 2026
