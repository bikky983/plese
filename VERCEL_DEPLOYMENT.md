# 🚀 Vercel Deployment Guide - UPDATED

This guide will help you deploy your Shop Builder application to Vercel. **Updated with troubleshooting for common deployment issues.**

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Your code should be in a GitHub repository
3. **Supabase Project** - Set up your production database

## 🛠️ Deployment Steps

### Step 1: Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### Step 2: Connect Your Repository

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

#### Option B: Via CLI
```bash
vercel login
vercel
```

### Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_AUTH_REDIRECT_URL=https://your-project-name.vercel.app/auth/callback
```

#### Optional Variables:
```
NEXT_PUBLIC_APP_NAME=Your Shop Builder
NEXT_PUBLIC_APP_DESCRIPTION=Create beautiful online shops
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
RESEND_API_KEY=your_resend_key
FROM_EMAIL=noreply@yourdomain.com
```

### Step 4: Update Supabase Auth Settings

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > URL Configuration**
3. Add your Vercel domain to **Redirect URLs**:
   ```
   https://your-project-name.vercel.app/auth/callback
   ```

### Step 5: Deploy

#### Automatic Deployment:
- Push to your main branch
- Vercel will automatically build and deploy

#### Manual Deployment:
```bash
npm run deploy
```

## 🔧 Configuration Files

Your project now includes these Vercel-optimized files:

### `vercel.json`
- Optimized build settings
- Security headers
- Function configuration
- Regional deployment settings

### `next.config.ts`
- Standalone output for better performance
- Image optimization settings
- Webpack optimizations
- Environment variable handling

### `env.production.example`
- Template for production environment variables
- Copy these to your Vercel project settings

## 🚀 Performance Optimizations

Your deployment includes:

✅ **Standalone Output** - Minimal deployment bundle
✅ **Image Optimization** - WebP/AVIF format support
✅ **Code Splitting** - Optimized chunk loading
✅ **Security Headers** - XSS and clickjacking protection
✅ **CDN Distribution** - Global edge network

## 🔍 Monitoring & Analytics

### Build Logs
- View real-time build logs in Vercel dashboard
- Monitor deployment status and errors

### Performance Monitoring
- Vercel Analytics (built-in)
- Core Web Vitals tracking
- Function execution metrics

## 🛠️ Troubleshooting

### Common Issues & Solutions:

#### ❌ **404: DEPLOYMENT_NOT_FOUND Error**
This error means Vercel can't find your deployment. Try these steps:

1. **Check Deployment Status**
   - Go to your Vercel dashboard
   - Verify the deployment actually exists
   - Check if the build completed successfully

2. **Verify Project Configuration**
   - Ensure `vercel.json` only contains `{"framework": "nextjs"}`
   - Make sure `next.config.js` exists (not `.ts`)
   - Check that your repository is properly connected

#### ❌ **Build Failures**
1. Check build logs in Vercel dashboard for specific errors
2. Test build locally: `npm run build`
3. Ensure all dependencies are in `package.json`
4. Verify TypeScript/ESLint errors are handled

#### ❌ **Next.js Config Issues**
- Use `next.config.js` (NOT `.ts` or `.mjs`)
- Keep configuration minimal for initial deployment
- Add optimizations after successful deployment

#### ❌ **Authentication Issues**
1. Verify redirect URLs in Supabase match your Vercel domain
2. Check environment variables are correctly set in Vercel
3. Ensure CORS settings allow your domain

### Debug Commands:
```bash
# Test build locally
npm run build

# Check for linting issues (optional)
npm run lint

# Deploy preview
npm run deploy:preview
```

### 🆘 **Emergency Deployment Steps**

If you're still having issues, try this minimal approach:

1. **Simplify vercel.json** to just:
   ```json
   {"framework": "nextjs"}
   ```

2. **Use minimal next.config.js**:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     typescript: { ignoreBuildErrors: true },
     eslint: { ignoreDuringBuilds: true }
   };
   module.exports = nextConfig;
   ```

3. **Deploy via Vercel Dashboard**:
   - Import from GitHub
   - Let Vercel auto-detect settings
   - Add only essential environment variables

## 📱 Domain Configuration

### Custom Domain (Optional):
1. Go to Vercel project settings
2. Add your custom domain
3. Configure DNS records as instructed
4. Update environment variables with new domain

## 🔐 Security Best Practices

✅ Environment variables are secure in Vercel
✅ Security headers are configured
✅ HTTPS is enforced automatically
✅ Supabase RLS policies protect user data

## 📊 Performance Tips

1. **Image Optimization** - Use Next.js Image component
2. **Code Splitting** - Lazy load components when possible
3. **Caching** - Leverage Vercel's edge caching
4. **Database** - Optimize Supabase queries with indexes

---

## 🎉 You're Ready!

Your Shop Builder is now configured for optimal Vercel deployment. Push your code to trigger the first deployment, then share your beautiful shops with the world!

### Quick Deploy Checklist:
- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Supabase auth URLs updated
- [ ] First deployment successful
- [ ] Shop creation tested in production

Need help? Check the Vercel documentation or reach out to support!
