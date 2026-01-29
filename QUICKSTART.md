# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- PHP 8.2+
- Node.js 16+
- Laravel installed globally (or use `php artisan`)
- Composer installed

### Step 1: Setup Backend

```bash
cd backend

# Install PHP dependencies
composer install

# Setup environment file (if not exists)
cp .env.example .env

# Generate app key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start the Laravel development server
php artisan serve
```

The backend will be running at: `http://127.0.0.1:8000`

### Step 2: Setup Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at: `http://localhost:5173`

### Step 3: Configure Admin Key

1. In your `.env` file (backend), set an admin key:
   ```
   ADMIN_KEY=your-secret-key-123
   ```

2. Or set it dynamically in the Laravel config

3. In the frontend, when you access `/admin`, enter this key to authenticate

### Step 4: Access the Admin Panel

1. Open `http://localhost:5173/admin` in your browser
2. Enter your admin key
3. You should see the admin menu with three options:
   - 📦 Manage Products
   - 📂 Manage Sections
   - 📄 Manage Articles

---

## 📝 Creating Your First Content

### Example: Create a Product → Section → Article

#### 1. Create a Product
1. Click "📦 Manage Products"
2. Fill in:
   - **Name**: `SAP Supply Chain`
   - **Slug**: `sap-supply-chain`
   - **Description**: `Learn about SAP SCM module`
3. Click "Create Product"

#### 2. Create a Section
1. Click "📂 Manage Sections"
2. Select the product you just created
3. Fill in:
   - **Title**: `Getting Started`
   - **Slug**: `getting-started`
4. Click "Create Section"
5. Or click "Manage Sections" button on the product

#### 3. Create an Article
1. Click "📄 Manage Articles"
2. Select the section you just created
3. Fill in:
   - **Title**: `Installation Guide`
   - **Slug**: `installation-guide`
   - **Content**: 
     ```html
     <h2>Installation Steps</h2>
     <p>Follow these steps to install SAP SCM:</p>
     <ol>
       <li>Download the installer</li>
       <li>Run the setup wizard</li>
       <li>Configure your settings</li>
     </ol>
     ```
4. Click "Create Article"

---

## 🔄 Editing and Deleting

### Edit Content
1. On any management page, find the item you want to edit
2. Click the "Edit" button
3. Modify the fields
4. Click "Save"

### Delete Content
1. Click the "Delete" button (red button)
2. Confirm the deletion in the popup
3. The item will be permanently deleted

**Note**: Deleting a product will also delete all its sections and articles!

---

## 🌐 View Your Content Publicly

After creating content, it will automatically appear on the public site:

1. **Products**: `http://localhost:5173/` (home page lists all products)
2. **Product Details**: `http://localhost:5173/product/sap-supply-chain`
3. **Section Articles**: `http://localhost:5173/section/getting-started`
4. **Article Details**: `http://localhost:5173/article/installation-guide`

---

## 💡 Tips & Tricks

### Slug Best Practices
- Use lowercase letters only
- Replace spaces with hyphens: `Getting Started` → `getting-started`
- Use descriptive names: `installation-guide` not `iguide`
- Keep them short and memorable

### Content Tips
- HTML is supported in article content
- You can use HTML tags like `<h2>`, `<p>`, `<ul>`, `<ol>`, `<strong>`, `<em>`, etc.
- Plain text is also supported

### Navigation Between Pages
- From Admin Key page, click any option in the "Admin Menu"
- Each content management page has a "Back" link
- Products page has "Manage Sections" button for each product
- Sections page has links to manage articles

---

## 🐛 Common Issues & Solutions

### Issue: "Unauthorized" error
**Solution**: 
- Check if you entered the correct admin key
- Go back to `/admin` and try again
- Clear browser localStorage: `localStorage.clear()`

### Issue: "Slug already exists"
**Solution**:
- For sections: Use a different slug (slugs are unique per product)
- For articles: Use a completely different slug (globally unique)

### Issue: Laravel server won't start
**Solution**:
```bash
# Make sure you're in the backend directory
cd backend

# Clear Laravel cache
php artisan cache:clear
php artisan config:clear

# Try running again
php artisan serve
```

### Issue: Frontend won't load
**Solution**:
```bash
# Make sure you're in the frontend directory
cd frontend

# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install

# Start again
npm run dev
```

### Issue: Database errors
**Solution**:
```bash
cd backend

# Run migrations
php artisan migrate

# Or reset and migrate (Warning: deletes all data!)
php artisan migrate:fresh
```

---

## 📚 File Locations

### Backend
- **Models**: `backend/app/Models/`
  - Product.php
  - Section.php
  - Article.php
- **Controllers**: `backend/app/Http/Controllers/Api/Admin/`
  - ProductAdminController.php
  - SectionAdminController.php
  - ArticleAdminController.php
- **Routes**: `backend/routes/api.php`

### Frontend
- **Admin Pages**: `frontend/src/pages/admin/`
  - AdminKeyPage.jsx
  - AdminProductsPage.jsx
  - AdminSectionsPage.jsx
  - AdminArticlesPage.jsx
- **Routes**: `frontend/src/App.jsx`
- **API Helper**: `frontend/src/api.js`

---

## 🔐 Security Notes

### For Production
1. **Never use localStorage for admin key**
   - Use proper user authentication system
   - Store sessions server-side
   - Use secure cookies

2. **Set a strong admin key**
   - Use random alphanumeric characters
   - Min 32 characters recommended
   - Change it regularly

3. **Enable HTTPS**
   - Don't transmit admin key over HTTP
   - Use secure cookies

4. **Limit admin access**
   - Whitelist admin IPs if possible
   - Rate limit admin endpoints
   - Log all admin activities

---

## 📖 Next Steps

1. **Read the Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
   - Full architecture overview
   - Feature explanations
   - Enhancement ideas

2. **Check API Reference**: `API_REFERENCE.md`
   - Complete endpoint documentation
   - Request/response examples
   - Error codes

3. **Customize the Design**
   - Modify CSS in admin pages
   - Update colors and layouts
   - Add your company branding

4. **Add Advanced Features**
   - Image uploads
   - Rich text editor
   - User management
   - Draft/publish workflow

---

## 🎉 You're Ready!

Your WordPress-style CMS is now running. Start creating content and managing your site!

**Questions?** Check the troubleshooting section or review the implementation guide.
