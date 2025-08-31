# Setup Guide - Modern Template

This guide will help you set up your Modern Template with Supabase authentication and Google OAuth.

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url> my-project
cd my-project
npm install
```

### 2. Environment Variables
```bash
cp env.example .env.local
```

### 3. Supabase Setup

#### Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually 2-3 minutes)
3. Go to Settings > API to find your credentials

#### Update Environment Variables
Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup

#### Create User Profiles Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 5. Google OAuth Setup

#### Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

#### Configure Supabase
1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth Client ID and Client Secret
4. Set the redirect URL to match your environment:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 6. Email Authentication Setup

#### Configure Email Templates (Optional)
1. Go to Authentication > Email Templates in Supabase
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

#### SMTP Settings (Optional)
For production, configure custom SMTP:
1. Go to Authentication > Settings
2. Configure SMTP settings with your email provider

### 7. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application!

## 🎨 Customization

### Themes and Colors
Modify the CSS variables in `app/globals.css`:
```css
:root {
  --primary: #3b82f6;        /* Change primary color */
  --secondary: #f1f5f9;      /* Change secondary color */
  /* ... other variables */
}
```

### Branding
Update the logo and branding in:
- `components/header.tsx`
- `components/footer.tsx`
- `app/layout.tsx` (metadata)

### Authentication Flow
Customize authentication pages in:
- `app/auth/login/page.tsx`
- `app/auth/signup/page.tsx`
- `app/auth/forgot-password/page.tsx`

## 🔒 Security Checklist

### Development
- [x] Environment variables are in `.env.local`
- [x] RLS is enabled on database tables
- [x] Auth policies are properly configured

### Production
- [ ] Update environment variables for production
- [ ] Configure custom domain for Supabase (optional)
- [ ] Set up proper CORS settings
- [ ] Enable email confirmations
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_AUTH_REDIRECT_URL=https://yourdomain.com/auth/callback
```

### Update OAuth Redirect URLs
Don't forget to update your Google OAuth redirect URLs to include your production domain!

## 🆘 Troubleshooting

### Common Issues

#### "Invalid login credentials"
- Check your Supabase URL and anon key
- Verify user exists in Supabase Auth dashboard

#### Google OAuth not working
- Verify redirect URLs match exactly
- Check Google OAuth credentials in Supabase
- Ensure Google+ API is enabled

#### Email not sending
- Check Supabase email settings
- Verify SMTP configuration (if using custom SMTP)
- Check spam folder

#### Build errors
- Run `npm run build` to check for TypeScript errors
- Verify all environment variables are set
- Check import paths are correct

### Getting Help
- 📖 [Supabase Documentation](https://supabase.com/docs)
- 📖 [Next.js Documentation](https://nextjs.org/docs)
- 🐛 [Open an Issue](https://github.com/yourname/modern-template/issues)

## 🎯 Next Steps

After basic setup, consider adding:
- [ ] Email verification flow
- [ ] Two-factor authentication
- [ ] User roles and permissions
- [ ] File upload functionality
- [ ] Real-time features
- [ ] Analytics integration
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring

---

**Need help?** Check out our [documentation](https://docs.moderntemplate.com) or [join our Discord](https://discord.gg/moderntemplate)!
