# Shop Website Setup Guide

This guide will help you set up your beautiful shop website with database and Google authentication.

## 🗄️ Database Setup (Free with Supabase)

### Step 1: Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up for free
3. Create a new project (choose any name you like)
4. Wait for the project to be ready (2-3 minutes)

### Step 2: Set Up Database Tables
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire content from `lib/database-schema.sql`
4. Click **Run** to create all tables and security policies

### Step 3: Configure Environment Variables
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_NAME="Your Shop Platform"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
```

## 🔐 Google Authentication Setup

### Step 1: Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

### Step 2: Configure Supabase OAuth
1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Enter your Google OAuth **Client ID** and **Client Secret**
4. Save the configuration

## 🚀 Installation & Running

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Your shop website will be available at `http://localhost:3000`

## 📋 Features Overview

### ✅ What's Included:
- **Google Authentication** - Secure login with Google accounts
- **Shop Creation Wizard** - Step-by-step shop setup
- **Adjustable Banner** - Upload and customize shop banners with height control
- **Flexible Product Grid** - Choose 3, 4, or 5 column layouts
- **Image Upload** - Drag & drop or click to upload product images
- **Auto-Save** - Automatic saving of all changes
- **PDF Export** - Export shop catalogs as professional PDFs
- **Responsive Design** - Works perfectly on all devices
- **Dark/Light Mode** - Beautiful themes for all preferences

### 🏪 Shop Management:
- Create and customize your shop banner
- Add unlimited products with images and prices
- Adjust grid layout (3/4/5 columns)
- Real-time preview of changes
- Export catalogs as PDF
- Auto-save prevents data loss

### 🔒 Security:
- Row Level Security (RLS) ensures users only see their own data
- Secure image storage with access controls
- Google OAuth for trusted authentication

## 🎨 Customization

### Banner Customization:
- Upload custom banner images
- Adjust banner height (150px - 600px)
- Automatic text overlay with shop name and description

### Product Grid Options:
- **3 Columns**: Best for detailed product showcases
- **4 Columns**: Balanced layout for most shops  
- **5 Columns**: Compact layout for many products

### Image Management:
- Supports JPEG, PNG, GIF, WebP formats
- Automatic image optimization
- Secure cloud storage
- Easy drag & drop interface

## 📱 Mobile Responsive

The shop website is fully responsive and works beautifully on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🔄 Auto-Save Feature

Your data is automatically saved when you:
- Change shop settings
- Add or edit products
- Upload images
- Modify layouts

No more worrying about losing your work!

## 📄 PDF Export Options

Export your shop in two ways:
1. **Catalog Export**: Professional PDF with all products and details
2. **Current View Export**: Screenshot-style PDF of exactly what you see

## 🌐 Public Shop Pages

Each shop gets a public URL that you can share:
- `yourdomain.com/shop/[shop-id]`
- Beautiful public view of your shop
- No login required for customers to browse
- Optimized for sharing on social media

## 📞 Support

If you need help:
1. Check this setup guide first
2. Look at the example files in the project
3. Check Supabase documentation for database issues
4. Check Google Cloud Console for OAuth issues

## 🎉 You're Ready!

Once you've completed the setup:
1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Create Your Shop" to get started
4. Follow the setup wizard
5. Start adding your products!

Enjoy building your beautiful shop! 🛍️
