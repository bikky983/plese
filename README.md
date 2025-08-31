# 🛍️ Shop Builder - Create Beautiful Online Shops

A powerful, modern platform built with **Next.js 15**, **Supabase**, and **Tailwind CSS** that allows users to create stunning online shops with customizable layouts, easy product management, and professional PDF catalogs.

![Modern Template](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&crop=edges)

## 🚀 Features

### 🏪 **Shop Management**
- **Shop Creation Wizard** - Step-by-step setup for new shops
- **Customizable Banners** - Upload images, adjust height (150-600px)
- **Flexible Product Grids** - Choose 3, 4, or 5 column layouts
- **Real-time Preview** - See changes instantly
- **Auto-Save** - Never lose your work

### 📦 **Product Management**
- **Drag & Drop Upload** - Easy image upload from any device
- **Product Editing** - In-place editing with real-time updates
- **Price Management** - Professional pricing display
- **Inventory Control** - Enable/disable products
- **Image Support** - JPEG, PNG, GIF, WebP formats

### 📄 **PDF Export & Sharing**
- **Professional Catalogs** - Export complete shop as PDF
- **Current View Export** - Screenshot-style PDF export
- **Social Sharing** - Share shops on WhatsApp, Twitter, Facebook
- **Public Shop URLs** - Shareable links for customers

### 🔐 **Authentication & Security**
- **Google OAuth** - Secure login with Google accounts
- **Row Level Security** - Users only see their own data
- **Secure Image Storage** - Protected cloud storage
- **Auto-Save Protection** - Automatic data backup

### 📱 **Mobile-First Design**
- **Responsive Layouts** - Perfect on all devices
- **Touch-Friendly** - Optimized for mobile interactions
- **Dark/Light Mode** - Beautiful themes
- **Smooth Animations** - Delightful user experience

## 🎯 What's Included

### Shop Features
- ✅ **Shop Creation Wizard** - Step-by-step shop setup
- ✅ **Adjustable Banner Component** - Customizable shop headers
- ✅ **Product Grid System** - 3/4/5 column layouts
- ✅ **Image Upload System** - Drag & drop functionality
- ✅ **PDF Export System** - Professional catalog generation
- ✅ **Auto-Save System** - Real-time data protection
- ✅ **Share System** - Social media integration

### Pages & Navigation
- ✅ **Landing Page** - Shop-focused hero section
- ✅ **Shop Dashboard** - Complete shop management
- ✅ **Public Shop Pages** - Customer-facing shop views
- ✅ **Browse Shops** - Directory of all shops
- ✅ **Authentication Pages** - Google OAuth ready
- ✅ **Responsive Navigation** - Mobile-optimized menus

### Database & Storage
- ✅ **Complete Schema** - Shops, products, images tables
- ✅ **Row Level Security** - User data protection
- ✅ **Image Storage** - Secure cloud storage
- ✅ **Auto-timestamps** - Created/updated tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### 1. Clone & Install
```bash
git clone <your-repo-url> my-project
cd my-project
npm install
```

### 2. Environment Setup
```bash
# Copy environment variables
cp env.example .env.local

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your beautiful template!

## 🎨 Customization

### Colors & Theming
The template uses CSS variables for easy theming. Modify `app/globals.css`:

```css
:root {
  --primary: #3b82f6;        /* Primary brand color */
  --secondary: #f1f5f9;      /* Secondary color */
  --accent: #f1f5f9;         /* Accent color */
  /* ... more variables */
}
```

### Components
All components are in the `components/` directory and built with:
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **Accessibility** best practices
- **Responsive design** patterns

### Database Schema
Set up your Supabase database with the provided SQL schema:
```sql
-- User profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  primary key (id)
);
```

## 📁 Project Structure

```
modern-template/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles & design system
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Site footer
│   └── theme-provider.tsx # Theme management
├── lib/                  # Utility functions
│   ├── utils.ts          # Common utilities
│   └── supabase.ts       # Database client
├── public/               # Static assets
└── types/                # TypeScript definitions
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Other Platforms
- **Netlify** - Connect your Git repository
- **Railway** - One-click deployment
- **DigitalOcean** - App Platform deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Supabase Team** - For the incredible backend-as-a-service
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For the deployment platform
- **Heroicons** - For the beautiful icon set

## 💬 Support

- 📧 Email: support@moderntemplate.com
- 💬 Discord: [Join our community](https://discord.gg/moderntemplate)
- 📖 Documentation: [docs.moderntemplate.com](https://docs.moderntemplate.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourname/modern-template/issues)

---

<div align="center">
  <p>Built with ❤️ by developers, for developers</p>
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js">
    </a>
    <a href="https://supabase.com">
      <img src="https://img.shields.io/badge/Supabase-green?logo=supabase" alt="Supabase">
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwind-css" alt="Tailwind CSS">
    </a>
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" alt="TypeScript">
    </a>
  </p>
</div>
