# TaklifNoma - Professional Wedding Invitation Platform

## 🎯 COMPLETE PROJECT RECREATION PROMPT

Create a **professional wedding invitation platform** called "TaklifNoma" (Uzbek for "Invitation") with the following exact specifications:

### 🚀 CORE FUNCTIONALITY REQUIREMENTS

A modern, beautiful wedding invitation platform where users can:

- ✅ **Create digital wedding invitations** with professional templates
- ✅ **Build custom templates** with real-time preview
- ✅ **Manage guest lists** and track RSVP responses
- ✅ **Share invitations** via WhatsApp, Telegram, social media and direct links
- ✅ **Customize templates** with colors, fonts, and personal details
- ✅ **View real-time statistics** and guest management analytics
- ✅ **Use both light and dark themes** with system preference detection
- ✅ **Multi-language support** (Uzbek primary, expandable)

### 🛠 TECHNICAL STACK

**Frontend Technologies:**

```json
{
  "framework": "React 18 with TypeScript",
  "build": "Vite 4.x",
  "styling": "Tailwind CSS with custom design system",
  "routing": "React Router 6",
  "icons": "Lucide React",
  "ui": "Radix UI components (shadcn/ui)",
  "state": "React Query + Context API",
  "animations": "Custom CSS keyframes + Tailwind",
  "typescript": "5.x"
}
```

**Backend & Database:**

```json
{
  "database": "Supabase PostgreSQL",
  "auth": "Supabase Auth (Google OAuth + Email/Password)",
  "storage": "Supabase Storage (avatars, images)",
  "realtime": "Supabase Real-time subscriptions",
  "security": "Row Level Security (RLS) policies",
  "backup": "localStorage fallback system"
}
```

### 📁 PROJECT STRUCTURE

```
taklifnoma/
├── client/
│   ├── components/
│   │   ├── ui/ (45+ shadcn components)
│   │   ├── ErrorBoundary.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── TemplateRenderer.tsx (supports custom templates)
│   ├── contexts/
│   │   ├── AuthContext.tsx (enhanced error handling)
│   │   └── ThemeContext.tsx (light/dark/system)
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── database.types.ts
│   │   ├── templates.tsx (built-in templates)
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx (landing page)
│   │   ├── Login.tsx & Register.tsx
│   │   ├── Dashboard.tsx (user dashboard)
│   │   ├── Profile.tsx (4 tabs: Profile, Stats, Invitations, Achievements)
│   │   ├── Settings.tsx (5 tabs: Notifications, Privacy, Security, Appearance, Account)
│   │   ├── CreateInvitation.tsx (multi-step form)
│   │   ├── InvitationView.tsx (public invitation display)
│   │   ├── Templates.tsx (template gallery)
│   │   ├── TemplateBuilder.tsx (custom template creator)
│   │   ├── Pricing.tsx (subscription plans)
│   │   ├── Features.tsx (feature showcase)
│   │   └── Contact.tsx (contact information)
│   ├── App.tsx (with ErrorBoundary)
│   ├── main.tsx (React 18 entry point)
│   └── global.css (comprehensive animation system)
├── database-setup.sql (complete schema + RLS)
└── README.md (this file)
```

### 🎨 DESIGN SYSTEM

**Color Palette (CSS Custom Properties):**

```css
:root {
  --primary: 220 91% 56%; /* Blue #4285f4 */
  --background: 0 0% 100%; /* White */
  --foreground: 224 71% 4%; /* Near Black */
  --card: 0 0% 100%; /* White */
  --border: 220 13% 91%; /* Light Gray */
  --muted: 220 14% 96%; /* Very Light Gray */
}

.dark {
  --background: 224 71% 4%; /* Dark Blue */
  --foreground: 0 0% 100%; /* White */
  --card: 224 71% 6%; /* Slightly Lighter Dark */
  --border: 215 28% 17%; /* Dark Gray */
  --muted: 215 28% 17%; /* Dark Gray */
}
```

**Typography System:**

```css
/* Font Imports */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap");

/* Font Applications */
body {
  font-family: "Inter", sans-serif;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Poppins", sans-serif;
}
.font-accent {
  font-family: "Playfair Display", serif;
}
```

**Animation System:**

```css
/* Keyframe Definitions */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
  }
}

/* Animation Classes */
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}
.animate-scale-in {
  animation: scale-in 0.5s ease-out;
}
.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

/* Hover Effects */
.hover-lift {
  transition: all 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.hover-scale {
  transition: transform 0.3s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

### 🗄 DATABASE SCHEMA

**Complete SQL Setup:**

```sql
-- 1. Profiles table (user information)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT
);

-- 2. Invitations table (wedding invitations)
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    groom_name TEXT NOT NULL,
    bride_name TEXT NOT NULL,
    wedding_date DATE NOT NULL,
    wedding_time TIME,
    venue TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    custom_message TEXT,
    template_id TEXT NOT NULL DEFAULT 'classic-rose',
    image_url TEXT,
    rsvp_deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    slug TEXT UNIQUE NOT NULL
);

-- 3. Guests table (guest list)
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    plus_one BOOLEAN DEFAULT FALSE
);

-- 4. RSVPs table (responses)
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    will_attend BOOLEAN NOT NULL,
    plus_one_attending BOOLEAN,
    message TEXT,
    email TEXT,
    phone TEXT
);

-- 5. Custom templates table (user-created templates)
CREATE TABLE IF NOT EXISTS public.custom_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'custom',
    colors JSONB DEFAULT '{}',
    fonts JSONB DEFAULT '{}',
    layout_config JSONB DEFAULT '{}',
    preview_image_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}'
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own invitations" ON public.invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view active invitations" ON public.invitations FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own invitations" ON public.invitations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own custom templates" ON public.custom_templates FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can create own templates" ON public.custom_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON public.custom_templates FOR UPDATE USING (auth.uid() = user_id);

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('invitation-images', 'invitation-images', true);

-- Storage Policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_active ON public.invitations(is_active);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_custom_templates_user_id ON public.custom_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_templates_public ON public.custom_templates(is_public);
```

### 📱 PAGE SPECIFICATIONS

#### **1. Index.tsx (Landing Page)**

```tsx
// Key Features:
- Animated hero section with call-to-action
- Feature showcase with icons and descriptions
- Template preview gallery
- Customer testimonials
- Statistics section
- Pricing overview
- FAQ section

// Animations:
- Staggered fade-in animations
- Hover effects on interactive elements
- Smooth scroll to sections
```

#### **2. Authentication (Login.tsx & Register.tsx)**

```tsx
// Login Features:
- Email/password authentication
- Google OAuth integration
- "Forgot password" functionality
- Form validation with error states
- Automatic redirect after successful login

// Register Features:
- Full name, email, password fields
- Google OAuth registration
- Terms acceptance checkbox
- Automatic profile creation
- Welcome email integration
```

#### **3. Dashboard.tsx (User Dashboard)**

```tsx
// Key Components:
- Welcome message with user's name
- Statistics cards (Invitations, Views, RSVPs, Guests)
- Recent invitations list with quick actions
- Quick action buttons (Create, Templates, Manage)
- User profile dropdown with navigation

// Real-time Data:
- Live statistics from Supabase
- Recent activity updates
- Notification system
```

#### **4. Profile.tsx (4-Tab Profile System)**

```tsx
// Tab 1: Profile Information
- Personal details form (name, email, phone, bio, location)
- Avatar upload with Supabase Storage
- Edit mode with save/cancel functionality
- Account creation date display

// Tab 2: Statistics
- Detailed metrics with animated counters
- Charts for invitation performance
- Time-based analytics
- Export functionality

// Tab 3: Invitations Management
- List of all user invitations
- Status indicators (Active/Inactive)
- Quick actions (View, Edit, Share, Duplicate)
- Search and filter capabilities

// Tab 4: Achievements System
- Badge collection for milestones
- Progress indicators for locked achievements
- Gamification elements
- Social sharing of achievements
```

#### **5. Settings.tsx (5-Tab Settings System)**

```tsx
// Tab 1: Notifications
- Email notification preferences
- SMS notification settings
- RSVP update alerts
- Marketing email preferences
- Push notification controls

// Tab 2: Privacy
- Profile visibility settings
- Email/phone display options
- Search indexing permissions
- Data processing consent
- Third-party integrations

// Tab 3: Security
- Password change functionality
- Two-factor authentication setup
- Login alerts and device management
- Session timeout settings
- Security audit log

// Tab 4: Appearance
- Theme selection (Light/Dark/System)
- Visual theme previews
- Color scheme preferences
- Accessibility options
- Interface customization

// Tab 5: Account Management
- Data export functionality (JSON format)
- Account deletion with confirmation
- Subscription management
- Billing information
- API key management
```

#### **6. CreateInvitation.tsx (Multi-Step Creator)**

```tsx
// Step 1: Basic Information
- Groom and bride names
- Wedding date and time picker
- Initial template selection
- Form validation

// Step 2: Venue & Address
- Venue name and full address
- City, state, zip code
- Map integration (optional)
- Accessibility information

// Step 3: Design & Message
- Template customization
- Custom message textarea
- Image upload for personalization
- Real-time preview

// Step 4: Guest Management
- Guest list creation/import
- Individual guest customization
- Bulk actions for guest management
- RSVP tracking setup

// Features:
- Real-time form validation
- Auto-save functionality
- Preview mode
- Supabase integration with localStorage fallback
```

#### **7. TemplateBuilder.tsx (Advanced Template Creator)**

```tsx
// Left Panel - Controls:
- Template information form
- Color picker with presets
- Font selection dropdown
- Layout style options
- Spacing and design controls
- Real-time sliders for adjustments

// Right Panel - Live Preview:
- Sticky positioned preview
- Desktop/mobile view toggle
- Real-time updates
- Export and share options

// Advanced Features:
- Custom color presets
- Font pairing suggestions
- Layout templates
- Save to personal library
- Public template sharing
```

#### **8. InvitationView.tsx (Public Invitation Display)**

```tsx
// Core Features:
- Beautiful invitation rendering
- Template-aware styling
- RSVP form integration
- Guest name personalization
- Social sharing buttons
- Mobile-optimized design

// RSVP System:
- Guest name input
- Attendance selection
- Optional message field
- Confirmation system
- Real-time updates
```

### 🔧 KEY COMPONENT SPECIFICATIONS

#### **Navigation.tsx (Smart Navigation)**

```tsx
interface NavigationProps {
  showBackButton?: boolean;
  className?: string;
}

// Features:
- Automatic back button hiding on main nav pages
- Authentication-aware menu items
- Active page highlighting
- Mobile-responsive design
- User profile dropdown when authenticated
```

#### **TemplateRenderer.tsx (Universal Template Engine)**

```tsx
// Capabilities:
- Renders built-in templates
- Supports custom templates from database
- Fallback to default template
- Real-time data binding
- Mobile-responsive output
- Print-friendly styling

// Custom Template Support:
- Loads from Supabase custom_templates table
- Converts database format to TemplateData
- Handles missing template gracefully
- Caches templates for performance
```

#### **AuthContext.tsx (Enhanced Authentication)**

```tsx
// Features:
- Session validation and recovery
- Automatic profile creation
- Error boundary integration
- Session refresh on window focus
- Comprehensive error handling
- Loading state management
- Fallback profile creation

// Security:
- JWT token validation
- Session timeout handling
- Automatic cleanup on errors
- Multi-tab session synchronization
```

#### **ErrorBoundary.tsx (Error Recovery)**

```tsx
// Capabilities:
- Catches React component errors
- User-friendly error display
- Development mode error details
- Page refresh recovery
- Error reporting (optional)
- Graceful degradation
```

### 🎯 UZBEK LANGUAGE IMPLEMENTATION

**Primary Language Content:**

```typescript
// Navigation & UI
const translations = {
  nav: {
    features: "Imkoniyatlar",
    templates: "Shablonlar",
    pricing: "Narxlar",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
  },

  // Invitation Content
  invitation: {
    groomBride: "Kuyov & Kelin",
    venue: "Joy",
    date: "Sana",
    time: "Vaqt",
    address: "Manzil",
    message: "Maxsus xabar",
    rsvp: "Javob berish",
  },

  // Common Actions
  actions: {
    save: "Saqlash",
    cancel: "Bekor qilish",
    create: "Yaratish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    share: "Ulashish",
  },
};
```

**Date and Time Formatting:**

```typescript
// Uzbek date formatting
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

// Examples:
// "15-iyun, 2024-yil, Shanba"
// "22-dekabr, 2024-yil, Yakshanba"
```

### 💼 BUSINESS LOGIC SPECIFICATIONS

#### **Template System:**

```typescript
// Built-in Templates
- Classic Rose (Klassik Atirgul)
- Modern Minimal (Zamonaviy Minimal)
- Elegant Gold (Nafis Oltin)
- Rustic Nature (Tabiy)
- Luxury Diamond (Hashamatli Olmos)

// Custom Template Features
- User-created templates
- Public/private visibility
- Template sharing
- Usage analytics
- Featured templates
```

#### **Pricing Structure:**

```typescript
const plans = [
  {
    name: "Asosiy (Basic)",
    price: { monthly: 0, yearly: 0 },
    features: [
      "3 ta taklifnoma",
      "5 ta asosiy shablon",
      "50 ta mehmon",
      "Asosiy ulashish",
    ],
  },
  {
    name: "Premium",
    price: { monthly: 29000, yearly: 290000 },
    features: [
      "Cheksiz taklifnoma",
      "15+ premium shablon",
      "Cheksiz mehmon",
      "QR kod yaratish",
      "PDF yuklab olish",
    ],
  },
  {
    name: "Biznes",
    price: { monthly: 99000, yearly: 990000 },
    features: [
      "Premium + barcha imkoniyatlar",
      "Maxsus domen",
      "API kirish",
      "Prioritetli yordam",
    ],
  },
];
```

### 🚀 DEVELOPMENT SETUP

**Environment Variables:**

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_APP_URL=http://localhost:5173
```

**Package.json Scripts:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

**Installation Commands:**

```bash
# Install dependencies
npm install

# Setup database (run SQL in Supabase SQL Editor)
# Import database-setup.sql

# Configure environment variables
cp .env.example .env
# Fill in your Supabase credentials

# Start development server
npm run dev
```

### 🎨 VISUAL DESIGN PRINCIPLES

**Color Usage:**

- **Primary Blue (#4285f4)**: Main actions, links, active states
- **Secondary Colors**: Supporting elements, inactive states
- **Success Green**: Confirmations, completed actions
- **Warning Yellow**: Alerts, important notices
- **Error Red**: Validation errors, destructive actions

**Typography Hierarchy:**

- **Page Titles**: text-4xl to text-6xl (Poppins)
- **Section Headers**: text-2xl to text-3xl (Poppins)
- **Body Text**: text-base to text-lg (Inter)
- **Captions**: text-sm to text-xs (Inter)
- **Accent Text**: Dancing Script, Playfair Display

**Spacing System:**

```css
/* Tailwind spacing scale */
.space-1  /* 4px */
.space-2  /* 8px */
.space-4  /* 16px */
.space-6  /* 24px */
.space-8  /* 32px */
.space-12 /* 48px */
.space-16 /* 64px */
.space-20 /* 80px */
```

### 📱 RESPONSIVE DESIGN

**Breakpoints:**

```css
/* Mobile First Approach */
.mobile {
  min-width: 320px;
} /* Small phones */
.sm {
  min-width: 640px;
} /* Large phones */
.md {
  min-width: 768px;
} /* Tablets */
.lg {
  min-width: 1024px;
} /* Laptops */
.xl {
  min-width: 1280px;
} /* Desktops */
.2xl {
  min-width: 1536px;
} /* Large screens */
```

**Mobile Adaptations:**

- Collapsible navigation menu
- Touch-friendly button sizes (min 44px)
- Stacked layouts for mobile
- Optimized form inputs
- Swipe gestures support

### 🔒 SECURITY IMPLEMENTATION

**Row Level Security (RLS):**

```sql
-- Users can only access their own data
CREATE POLICY "Users own data only" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Public invitations are viewable by anyone
CREATE POLICY "Public invitations" ON invitations
  FOR SELECT USING (is_active = true);

-- Users can manage their own invitations
CREATE POLICY "User invitations" ON invitations
  FOR ALL USING (auth.uid() = user_id);
```

**Authentication Security:**

- JWT token validation
- Session refresh mechanisms
- CSRF protection
- XSS prevention
- SQL injection protection (Supabase handled)

### 📈 PERFORMANCE OPTIMIZATION

**Frontend Optimization:**

```typescript
// Code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));

// Image optimization
const optimizedImage = {
  width: 800,
  height: 600,
  quality: 85,
  format: "webp",
};

// Caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});
```

**Database Optimization:**

- Proper indexing on foreign keys
- Query optimization with select specific fields
- Connection pooling
- Real-time subscriptions for live updates

### 🧪 QUALITY ASSURANCE

**Testing Checklist:**

```typescript
// Authentication Flow
✅ User registration with email/password
✅ Google OAuth integration
✅ Session persistence across browser refresh
✅ Protected route enforcement
✅ Profile creation and updates

// Invitation Management
✅ Multi-step invitation creation
✅ Template selection and customization
✅ Real-time preview functionality
✅ Guest list management
✅ RSVP tracking and responses

// Template System
✅ Built-in template rendering
✅ Custom template creation
✅ Template sharing and visibility
✅ Mobile responsive display
✅ Print-friendly output

// Data Persistence
✅ Supabase database integration
✅ localStorage fallback system
✅ Real-time data synchronization
✅ Data export functionality
✅ Data backup and recovery
```

### 🌐 DEPLOYMENT SPECIFICATIONS

**Hosting Requirements:**

- **Frontend**: Netlify, Vercel, or similar static hosting
- **Database**: Supabase cloud (or self-hosted PostgreSQL)
- **Storage**: Supabase Storage (or AWS S3)
- **CDN**: Automatic with hosting provider

**Environment Setup:**

```bash
# Production build
npm run build

# Environment variables for production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_URL=https://your-domain.com
```

### 📞 CONTACT & SUPPORT

**Developer Contact:**

- **Name**: Dilshodjon Haydarov
- **Email**: dev.dilshodjon@gmail.com
- **Phone**: +998 99 534 03 13, +998 33 143 20 03
- **Telegram**: @torex_dev
- **Address**: Farg'ona viloyati, O'zbekiston tumani, Davlatbotir MFY, Maorif qishlog'i, Yangi hayot ko'chasi, 14-uy

**Support Channels:**

- **Technical Issues**: dev.dilshodjon@gmail.com
- **Feature Requests**: via Telegram @torex_dev
- **Bug Reports**: Include screenshots and steps to reproduce

### 🎯 SUCCESS METRICS

**Platform Goals:**

1. **User Experience**: Intuitive interface allowing invitation creation in under 3 minutes
2. **Technical Performance**: Page load times under 2 seconds, 99.9% uptime
3. **Mobile Experience**: Full functionality on all devices with touch optimization
4. **Design Quality**: Modern, professional appearance with consistent branding
5. **Data Reliability**: 100% data persistence with automatic backup systems

### 🚀 ADVANCED FEATURES

**Real-time Capabilities:**

```typescript
// Live RSVP updates
useEffect(() => {
  const subscription = supabase
    .channel("rsvp_updates")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "rsvps",
        filter: `invitation_id=eq.${invitationId}`,
      },
      (payload) => {
        setRsvps((prev) => [...prev, payload.new]);
      },
    )
    .subscribe();

  return () => supabase.removeChannel(subscription);
}, [invitationId]);
```

**Advanced Analytics:**

```typescript
// User engagement tracking
const analytics = {
  pageViews: useAnalytics("page_view"),
  invitationCreated: useAnalytics("invitation_created"),
  templateUsage: useAnalytics("template_used"),
  rsvpResponse: useAnalytics("rsvp_submitted"),
};
```

### 🔧 CUSTOMIZATION OPTIONS

**Theme Customization:**

```typescript
// Custom theme implementation
const customTheme = {
  colors: {
    primary: "hsl(220, 91%, 56%)",
    secondary: "hsl(220, 14%, 96%)",
    accent: "hsl(47, 96%, 89%)",
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(224, 71%, 4%)",
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif',
    accent: '"Playfair Display", serif',
  },
  animations: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
};
```

---

## 📋 IMPLEMENTATION CHECKLIST

**Phase 1: Foundation (Week 1)**

- [ ] Setup Vite + React + TypeScript
- [ ] Install and configure Tailwind CSS
- [ ] Setup Supabase project and authentication
- [ ] Create basic routing structure
- [ ] Implement authentication flow

**Phase 2: Core Features (Week 2-3)**

- [ ] Build landing page with animations
- [ ] Create dashboard with real data
- [ ] Implement invitation creation flow
- [ ] Build template rendering system
- [ ] Add guest management functionality

**Phase 3: Advanced Features (Week 4)**

- [ ] Build custom template creator
- [ ] Implement profile and settings pages
- [ ] Add real-time RSVP tracking
- [ ] Create comprehensive admin dashboard
- [ ] Implement sharing and export features

**Phase 4: Polish & Deploy (Week 5)**

- [ ] Add comprehensive error handling
- [ ] Implement performance optimizations
- [ ] Complete responsive design testing
- [ ] Setup production deployment
- [ ] Conduct full user acceptance testing

---

**This README serves as a complete blueprint for recreating the TaklifNoma platform with identical functionality, design, and user experience. Follow this specification with AI assistance to build a professional-grade wedding invitation platform.**

## 🏆 FINAL NOTES

This project represents a complete, production-ready wedding invitation platform with:

- ✅ **Modern Technology Stack**: React 18, TypeScript, Supabase
- ✅ **Professional Design**: Custom design system with animations
- ✅ **Full Functionality**: Authentication, CRUD operations, real-time updates
- ✅ **Mobile Responsive**: Works perfectly on all devices
- ✅ **Scalable Architecture**: Clean code, proper state management
- ✅ **Security First**: RLS policies, error boundaries, data validation

**Ready for production deployment and commercial use.**
