# TaklifNoma - To'y Taklifnomalari Platformasi

## COMPLETE PROJECT RECREATION PROMPT

Create a **professional wedding invitation platform** called "TaklifNoma" (Uzbek for "Invitation") with the following exact specifications:

### CORE FUNCTIONALITY REQUIREMENTS

A modern, beautiful wedding invitation platform where users can:

- Create digital wedding invitations with professional templates
- Manage guest lists and track RSVP responses
- Share invitations via WhatsApp, Telegram, social media and direct links
- Customize templates with colors, fonts, and personal details
- View real-time statistics and guest management analytics
- Use both light and dark themes with system preference detection

### TECHNICAL STACK

**Frontend:**

- React 18 with TypeScript and Vite
- Tailwind CSS for styling with custom design system
- React Router 6 for navigation
- Lucide React for icons
- Radix UI components (shadcn/ui library)
- React Query for data fetching

**Backend & Database:**

- Supabase (PostgreSQL + Auth + Storage + Real-time)
- Row Level Security (RLS) policies
- Google OAuth + Email/Password authentication
- File storage for avatars and images

**Key Libraries:**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@supabase/supabase-js": "^2.38.4",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.263.1",
    "@radix-ui/react-*": "latest versions",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

### PROJECT STRUCTURE

```
project/
├── client/
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── Navigation.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── TemplateRenderer.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── database.types.ts
│   │   ├── templates.tsx
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   ├── CreateInvitation.tsx
│   │   ├── InvitationView.tsx
│   │   ├── Templates.tsx
│   │   ├── TemplateBuilder.tsx
│   │   ├── Pricing.tsx
│   │   ├── Features.tsx
│   │   └── [other pages]
│   ├── App.tsx
│   ├── main.tsx
│   └── global.css
├── database-setup.sql
└── README.md
```

### DESIGN SYSTEM

**Color Palette:**

```css
:root {
  --primary: 220 91% 56%; /* Blue #4285f4 */
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --border: 220 13% 91%;
  --muted: 220 14% 96%;
}

.dark {
  --background: 224 71% 4%;
  --foreground: 0 0% 100%;
  --card: 224 71% 6%;
  --border: 215 28% 17%;
  --muted: 215 28% 17%;
}
```

**Typography:**

- Primary font: "Inter" (body text)
- Heading font: "Poppins" (headings)
- Accent font: "Playfair Display" (decorative)

**Animation System:**

```css
/* Key animations */
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

/* Animation classes */
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

/* Hover effects */
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

### DATABASE SCHEMA

```sql
-- Profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT
);

-- Invitations table
CREATE TABLE invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    groom_name TEXT NOT NULL,
    bride_name TEXT NOT NULL,
    wedding_date DATE NOT NULL,
    wedding_time TIME,
    venue TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    custom_message TEXT,
    template_id TEXT NOT NULL DEFAULT 'classic',
    image_url TEXT,
    rsvp_deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    slug TEXT UNIQUE NOT NULL
);

-- Guests table
CREATE TABLE guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    plus_one BOOLEAN DEFAULT FALSE
);

-- RSVPs table
CREATE TABLE rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    will_attend BOOLEAN NOT NULL,
    plus_one_attending BOOLEAN,
    message TEXT,
    email TEXT,
    phone TEXT
);

-- Custom templates table
CREATE TABLE custom_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own invitations" ON invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view active invitations" ON invitations FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own invitations" ON invitations FOR ALL USING (auth.uid() = user_id);

-- Storage buckets and policies
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('invitation-images', 'invitation-images', true);

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### PAGE SPECIFICATIONS

#### **Index.tsx (Landing Page)**

- Header: "To'y Taklifnomalari Juda Oson"
- Hero section with animated badges and call-to-action buttons
- Features showcase with icons and descriptions
- Template preview section
- Testimonials from users
- Pricing overview with links to full pricing page
- Animations: fade-in, slide-up, hover effects with staggered delays

#### **Login.tsx**

- Email/password login form
- Google OAuth button
- "Parolni unutdingizmi?" link
- Link to registration page
- Form validation and error handling

#### **Register.tsx**

- Full name, email, password fields
- Google OAuth registration
- Terms acceptance checkbox
- Automatic profile creation after registration

#### **Dashboard.tsx (Protected)**

- Welcome message with user's name
- Statistics cards (Total invitations, Views, RSVPs, Guests)
- Recent invitations list with quick actions
- Quick action buttons (Create new, View templates, Manage guests)
- Profile dropdown with navigation to Profile and Settings

#### **Profile.tsx (Protected)**

**Tabs: Profile, Statistics, Invitations, Achievements**

**Profile Tab:**

- Personal information form (name, email, phone, bio, location, website)
- Avatar upload with image preview
- Edit mode toggle with save/cancel buttons
- Account creation date display

**Statistics Tab:**

- Detailed metrics cards with icons
- Total invitations created
- Total views across all invitations
- Total RSVP responses
- Total guests count

**Invitations Tab:**

- List of user's invitations with status badges
- Quick actions: View, Edit, Share, Duplicate
- Pagination for large lists

**Achievements Tab:**

- Badge system for milestones
- "First Invitation", "Guest Magnet", "Popular Creator", etc.
- Progress indicators for locked achievements

#### **Settings.tsx (Protected)**

**Tabs: Notifications, Privacy, Security, Appearance, Account**

**Notifications:**

- Email notifications toggle
- SMS notifications toggle
- RSVP update alerts
- Marketing emails preference
- Weekly reports setting

**Privacy:**

- Profile visibility settings
- Email/phone display options
- Search indexing permission
- Data processing consent

**Security:**

- Password change form
- Two-factor authentication setup
- Login alerts configuration
- Session timeout settings

**Appearance:**

- Theme selection (Light, Dark, System)
- Theme cards with icons and preview
- Automatic theme switching

**Account:**

- Data export functionality
- Account deletion (with confirmation dialog)
- Subscription management

#### **CreateInvitation.tsx (Protected)**

**Features**: Real-time preview, form validation, Supabase integration

**Form Fields:**

- Groom and bride names
- Wedding date and time picker
- Venue name and address
- Custom message textarea
- Template selection
- Image upload option
- Guest list import/manual entry

**Preview Panel:**

- Live preview of invitation
- Template customization options
- Color and font adjustments

#### **Templates.tsx**

- Grid layout of available templates
- Category filtering (Classic, Modern, Elegant, Simple)
- Search functionality
- Preview on hover
- Template details modal
- "Use Template" button leading to creation page

#### **TemplateBuilder.tsx (Protected)**

- Drag-and-drop interface for custom templates
- Color picker for theme customization
- Font selection dropdown
- Layout options (single page, multi-section)
- Text formatting tools
- Image placement options
- Save as custom template
- Preview mode toggle

#### **Pricing.tsx**

**Three Plans: Basic (Free), Premium (29,000 so'm/month), Business (99,000 so'm/month)**

**Plan Cards with:**

- Animated hover effects and glow animations
- Feature comparison lists
- Monthly/yearly toggle with discount badge
- Popular plan highlighting
- Call-to-action buttons

**Additional Sections:**

- FAQ accordion
- Feature overview grid
- Customer testimonials
- Money-back guarantee

#### **Features.tsx**

- Comprehensive feature showcase
- Main features grid with detailed descriptions
- Additional features list
- Same pricing section as Pricing page
- Feature comparison table
- Call-to-action section

#### **InvitationView.tsx (Public)**

- Beautiful invitation display with selected template
- RSVP form with guest name input
- Attendance selection (Will attend / Can't attend)
- Optional message field
- Share buttons (WhatsApp, Telegram, Copy link)
- Guest count display
- Responsive design for mobile

### COMPONENT SPECIFICATIONS

#### **Navigation.tsx**

```typescript
interface NavigationProps {
  showBackButton?: boolean;
  className?: string;
}

// Smart navigation logic:
// - Shows main nav links: Features, Templates, Template Builder, Pricing
// - Highlights current page with primary color and border
// - Automatically hides back button on main nav pages
// - Shows login/register buttons for unauthenticated users
// - Shows user dropdown for authenticated users
```

#### **TemplateRenderer.tsx**

```typescript
interface TemplateRendererProps {
  template: Template;
  data: InvitationData;
  className?: string;
  preview?: boolean;
}

// Renders invitation templates with:
// - Dynamic content insertion
// - Responsive design
// - Print-friendly styling
// - Animation support
```

#### **AuthContext.tsx**

```typescript
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: any,
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

// Features:
// - Automatic profile creation on registration
// - Session persistence
// - Error handling with detailed logging
// - Fallback profile creation if database fails
```

#### **ThemeContext.tsx**

```typescript
interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

// Features:
// - System theme detection
// - Local storage persistence
// - Automatic class application to document root
// - Media query listening for system changes
```

### CONTENT AND LOCALIZATION

**Primary Language**: Uzbek (Latin script)

**Key Translations:**

- Taklifnomalar → Invitations
- Yaratish → Create
- Shablonlar → Templates
- Narxlar → Pricing
- Imkoniyatlar → Features
- Kirish → Login
- Ro'yxatdan o'tish → Register
- Mehmonlar → Guests
- Javoblar → Responses
- Statistika → Statistics
- Sozlamalar → Settings

**Template Content Examples:**

- Groom/Bride: "Jahongir & Sarvinoz"
- Date format: "15-iyun, 2024-yil"
- Time format: "16:00"
- Venue examples: "Atirgul Bog'i", "Royal Palace"
- Address format: "Toshkent sh., Yunusobod t., Bog' ko'chasi 123"

### ANIMATION AND INTERACTION PATTERNS

**Page Load Animations:**

- Staggered fade-in for content sections
- Slide-up animations with delays (0.1s intervals)
- Scale-in for cards and buttons

**Hover Effects:**

- Lift effect for cards (translateY(-2px) + shadow)
- Scale effect for buttons and icons (scale(1.05))
- Glow effect for primary actions

**Loading States:**

- Skeleton loaders for content
- Spinner animations for buttons
- Progressive image loading

**Micro-interactions:**

- Button press animations
- Form field focus states
- Success/error message animations
- Smooth transitions between states

### COLOR USAGE GUIDELINES

**Primary Blue (#4285f4):**

- Main brand color for buttons, links, highlights
- Active states and selections
- Progress indicators

**Success Green:**

- Form validation success
- Confirmation messages
- Achievement badges

**Warning/Error Colors:**

- Form validation errors
- Alert messages
- Destructive actions

**Typography:**

- Page titles: text-3xl to text-4xl
- Section headings: text-xl to text-2xl
- Body text: text-sm to text-base
- Captions: text-xs to text-sm

### RESPONSIVE DESIGN

**Breakpoints:**

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

**Mobile Adaptations:**

- Collapsible navigation menu
- Stacked layout for cards
- Touch-friendly button sizes (min 44px)
- Optimized forms with proper input types

### DEVELOPMENT SETUP

**Environment Variables:**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Build Commands:**

```bash
npm install
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
```

### FUNCTIONAL REQUIREMENTS CHECKLIST

**Authentication:**

- [ ] User registration with email/password
- [ ] Google OAuth integration
- [ ] Session management and persistence
- [ ] Protected routes
- [ ] Profile creation and updates

**Invitation Management:**

- [ ] Create invitations with form validation
- [ ] Template selection and customization
- [ ] Image upload and management
- [ ] Preview functionality
- [ ] Save drafts and publish

**Guest Management:**

- [ ] Add guests manually or via import
- [ ] Track RSVP responses
- [ ] Send invitations via multiple channels
- [ ] Guest analytics and reporting

**Template System:**

- [ ] Multiple built-in templates
- [ ] Custom template builder
- [ ] Template preview and selection
- [ ] Template categorization

**Analytics:**

- [ ] View tracking for invitations
- [ ] RSVP response tracking
- [ ] User dashboard with statistics
- [ ] Export functionality

**UI/UX:**

- [ ] Responsive design for all devices
- [ ] Dark/light theme support
- [ ] Smooth animations and transitions
- [ ] Loading states and error handling
- [ ] Accessibility compliance

### SUCCESS METRICS

The completed platform should provide:

1. **User Experience**: Intuitive interface that allows users to create invitations in under 3 minutes
2. **Technical Performance**: Fast loading times (<2s), responsive design, smooth animations
3. **Functionality**: All CRUD operations working, real-time updates, secure authentication
4. **Design Quality**: Modern, professional appearance with consistent design system
5. **Mobile Experience**: Full functionality on mobile devices with touch-optimized interface

### DEPLOYMENT NOTES

- Frontend can be deployed to Netlify, Vercel, or similar platforms
- Database and auth handled by Supabase cloud
- Environment variables must be configured for production
- SSL certificates and custom domains supported
- CDN integration for optimal performance

---

**This prompt contains all specifications needed to recreate the TaklifNoma platform with identical functionality and design in a single development session.**
