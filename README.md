# TaklifNoma - Wedding Invitation Platform Recreation Guide

**PROMPT FOR EXACT RECREATION**: Use this comprehensive guide to recreate the complete TaklifNoma wedding invitation platform with identical design, functionality, and user experience.

## 🎯 **PROJECT SPECIFICATION**

Create a **professional wedding invitation platform** called "TaklifNoma" (Uzbek for "Invitation") with the following exact specifications:

### **Core Concept**
A modern, beautiful wedding invitation platform where users can:
- Register and authenticate (Google OAuth + email/password)
- Create custom wedding invitations using professional templates
- Build their own custom templates with a visual editor
- Manage guest lists and track RSVP responses
- Share invitations via multiple channels (WhatsApp, Telegram, etc.)
- View comprehensive analytics and manage their profile

---

## 🛠️ **TECHNICAL STACK (EXACT)**

```typescript
// Required Dependencies
- React 18+ with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- Supabase (PostgreSQL + Auth + Storage)
- React Router 6 for routing
- Lucide React for icons
- React Context for state management
- Tanstack Query for server state
```

## 📁 **EXACT FILE STRUCTURE**

```
project/
├── client/
│   ├── components/
│   │   ├── ui/ (Shadcn-style components)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   └── toaster.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── TemplateRenderer.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── database.types.ts
│   │   ├── templates.tsx
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx (Landing page)
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   ├── Templates.tsx
│   │   ├── TemplateBuilder.tsx
│   │   ├── CreateInvitation.tsx
│   │   ├── InvitationView.tsx
│   │   ├── Pricing.tsx
│   │   ├── Contact.tsx
│   │   ├── Help.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── global.css
├── index.html
└── README.md
```

---

## 🎨 **DESIGN SYSTEM SPECIFICATIONS**

### **Color Palette (Exact)**
```css
:root {
  /* Primary Colors */
  --primary: 99 102 241;        /* Blue #6366f1 */
  --primary-foreground: 248 250 252;
  
  /* Secondary Colors */
  --secondary: 241 245 249;
  --secondary-foreground: 15 23 42;
  
  /* Accent Colors */
  --accent: 241 245 249;
  --accent-foreground: 15 23 42;
  
  /* Background Colors */
  --background: 255 255 255;
  --foreground: 15 23 42;
  
  /* Muted Colors */
  --muted: 241 245 249;
  --muted-foreground: 100 116 139;
  
  /* Border and Input */
  --border: 226 232 240;
  --input: 226 232 240;
  --ring: 99 102 241;
  
  /* Destructive Colors */
  --destructive: 239 68 68;
  --destructive-foreground: 248 250 252;
}
```

### **Typography**
```css
/* Font Families */
.font-heading { font-family: "Inter", sans-serif; }
.font-body { font-family: "Inter", sans-serif; }

/* Custom Classes */
.text-gradient {
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.primary-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.hero-gradient {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}
```

### **Animation System**
```css
/* Custom Animations - Add to global.css */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bounce-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Animation Classes */
.animate-fade-in { animation: fade-in 0.6s ease-out; }
.animate-slide-up { animation: slide-up 0.8s ease-out; }
.animate-scale-in { animation: scale-in 0.5s ease-out; }
.animate-bounce-soft { animation: bounce-soft 2s ease-in-out infinite; }
.animate-shake { animation: shake 0.5s ease-in-out; }

/* Hover Effects */
.hover-lift { transition: all 0.3s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); }

.hover-scale { transition: transform 0.3s ease; }
.hover-scale:hover { transform: scale(1.05); }
```

---

## 🗄️ **DATABASE SCHEMA (SUPABASE)**

### **Required Tables**
```sql
-- 1. Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT
);

-- 2. Invitations table
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
  state TEXT,
  zip_code TEXT,
  custom_message TEXT,
  template_id TEXT DEFAULT 'classic-rose',
  image_url TEXT,
  rsvp_deadline DATE,
  is_active BOOLEAN DEFAULT TRUE,
  slug TEXT UNIQUE NOT NULL
);

-- 3. Guests table
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  plus_one BOOLEAN DEFAULT FALSE
);

-- 4. RSVPs table
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

-- 5. Custom Templates table
CREATE TABLE custom_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'custom',
  colors JSONB NOT NULL DEFAULT '{}',
  fonts JSONB NOT NULL DEFAULT '{}',
  layout_config JSONB NOT NULL DEFAULT '{}',
  preview_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (user can only access their own data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own invitations" ON invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invitations" ON invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invitations" ON invitations FOR UPDATE USING (auth.uid() = user_id);
```

### **Storage Buckets**
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('templates', 'templates', true),
('invitations', 'invitations', true);
```

---

## 📱 **PAGE SPECIFICATIONS**

### **1. Landing Page (Index.tsx)**
**Layout**: Hero section + Features + Templates preview + Pricing preview + Testimonials + CTA
**Content**:
```
- Header: "To'y Taklifnomalari Juda Oson" 
- Subheader: "Professional taklifnomalar bir necha daqiqada"
- Features: 15+ shablonlar, RSVP boshqaruvi, mobil mos, oson ulashish
- Stats: "10,000+ er-xotin TaklifNoma ga ishonadi"
- CTA: "Bepul Boshlash" button
```

### **2. Authentication Pages**

#### **Login.tsx**
- Google OAuth button (prominent)
- Email/password form
- "Parolni unutdingizmi?" link  
- "Hisobingiz yo'qmi? Ro'yxatdan o'ting" link
- Animated background with floating circles
- Form validation with real-time feedback

#### **Register.tsx**  
- Google OAuth button
- Form fields: First name, Last name, Email, Password, Confirm password
- Password strength indicator
- "Allaqachon hisobingiz bormi? Kirish" link
- Terms and privacy acceptance checkbox

### **3. Dashboard.tsx**
**Layout**: Navigation + Stats cards + Recent invitations list
**Content**:
```
- Welcome message: "Salom, [name]! 👋"
- Stats: Total invitations, Total views, Total RSVPs, Total guests
- Recent invitations table with actions (View, Edit, Share, Delete)
- Empty state: "Hali taklifnomalar yo'q" with CTA
- User dropdown: Profile, Settings, Logout
```

### **4. Profile.tsx**
**Tabs**: Profile, Statistics, Invitations, Achievements
**Features**:
- Avatar upload with camera icon overlay
- Editable personal information
- User statistics and metrics
- Recent invitations list
- Achievement system with progress badges

### **5. Settings.tsx**
**Tabs**: Notifications, Privacy, Security, Appearance, Account
**Features**:
- Notification preferences (email, SMS, RSVP updates)
- Privacy settings (profile visibility, data sharing)
- Password change functionality
- Theme selection (light, dark, system)
- Account deletion with confirmation

### **6. Templates.tsx**
- Template gallery with category filtering
- Search functionality
- Template preview modal
- "Yangi Shablon Yaratish" CTA card
- Template statistics and usage counts

### **7. TemplateBuilder.tsx**
**Layout**: Design controls (left) + Live preview (right)
**Features**:
- Color picker with preset palettes
- Font selection dropdown
- Layout controls (spacing, borders, shadows)
- Real-time preview updates
- Save as public/private option

### **8. CreateInvitation.tsx**
**Multi-step wizard**:
1. Template selection with filtering
2. Couple information (names, date, venue, message)
3. Guest list management
4. Review and save
**Features**: Real-time preview, form validation, Supabase integration

### **9. InvitationView.tsx**
**Layout**: Invitation display + Event details + RSVP form
**Features**:
- Beautiful template rendering
- Event information cards
- RSVP form with guest name input
- Share buttons (WhatsApp, Telegram, Copy link)
- Success animations after RSVP submission

### **10. Pricing.tsx**
**Plans**: Basic (Free), Premium (29,000 so'm/oy), Business (99,000 so'm/oy)
**Features**: Feature comparison table, FAQ section, testimonials

---

## 🔧 **COMPONENT SPECIFICATIONS**

### **TemplateRenderer.tsx**
```typescript
interface TemplateRendererProps {
  invitation: InvitationData;
  guestName?: string;
}

// Should render different template styles based on template_id:
// - classic-rose: Rose/pink theme with elegant fonts
// - modern-minimal: Clean, minimalist design
// - elegant-gold: Luxury gold accents
// - rustic-nature: Earth tones, casual fonts
// - elegant-lavender: Purple/lavender theme
// - modern-sunset: Orange/red gradient theme
```

### **Navigation.tsx**
- Responsive navigation with mobile menu
- Current page highlighting
- User avatar dropdown (when authenticated)
- Logo with "TaklifNoma" brand name

### **ProtectedRoute.tsx**
- Route protection for authenticated users
- Loading states during auth check
- Redirect to login with return URL

---

## 🌐 **LANGUAGE & CONTENT (UZBEK)**

### **Key Translations**
```
Uzbek → English
- TaklifNoma → Invitation
- Taklifnomalar → Invitations  
- Shablonlar → Templates
- Narxlar → Pricing
- Sozlamalar → Settings
- Profil → Profile
- Dashboard → Dashboard
- Kirish → Login
- Ro'yxatdan o'tish → Register
- Mehmonlar → Guests
- RSVP → RSVP
- Kelaman → Will Attend
- Kela olmayman → Cannot Attend
- Ulashish → Share
- Yuklab olish → Download
- Saqlash → Save
- Tahrirlash → Edit
- O'chirish → Delete
```

### **Template Content**
```
Sample invitation text:
"Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz."

Venue examples:
- "Atirgul Bog'i"
- "Royal Palace" 
- "Garden Palace"

Date format: "15 Iyun 2024"
Time format: "16:00"
```

---

## ⚡ **FUNCTIONAL REQUIREMENTS**

### **Authentication Flow**
1. User visits login page
2. Can sign in with Google OAuth OR email/password
3. On first Google login, profile is auto-created
4. Users are redirected to dashboard after login
5. All sensitive pages require authentication

### **Invitation Creation Flow**
1. User selects template from gallery
2. Fills out wedding information form
3. Adds guests (optional)
4. Reviews invitation preview
5. Saves to Supabase database
6. Gets shareable URL
7. Can track views and RSVPs

### **RSVP Flow**
1. Guest receives invitation link
2. Views beautiful invitation
3. Enters their name
4. Selects "Kelaman" or "Kela olmayman"
5. Can add optional message
6. Response saved to database
7. Invitation creator can view all responses

### **Template Builder Flow**
1. User opens template builder
2. Customizes colors, fonts, layout
3. Sees real-time preview
4. Saves custom template
5. Can use template for invitations
6. Can share publicly if desired

---

## 🎯 **UI/UX SPECIFICATIONS**

### **Animation Requirements**
- Page transitions with fade-in effects
- Form elements with smooth focus states
- Button hover effects with slight lift
- Loading states with spinning indicators
- Success states with celebration animations
- Error states with shake animations
- Staggered list item animations

### **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces on mobile
- Collapsible navigation menu
- Responsive grid layouts
- Optimized typography scaling

### **Color Usage**
- Primary blue (#6366f1) for CTAs and links
- Purple gradients for premium features
- Green for success states and confirmations  
- Red for errors and destructive actions
- Neutral grays for text and borders
- Subtle background gradients throughout

### **Typography Scale**
```css
- Hero headlines: text-5xl to text-7xl
- Page titles: text-3xl to text-4xl  
- Section headings: text-xl to text-2xl
- Body text: text-base
- Captions: text-sm
- Fine print: text-xs
```

---

## 🔐 **SECURITY REQUIREMENTS**

### **Authentication Security**
- Supabase Auth with Google OAuth
- Email/password with secure validation
- Protected routes with proper redirects
- Session management with persistence
- User data isolation with RLS

### **Data Protection**
- Row Level Security on all tables
- User-specific data access only
- Secure file upload to Supabase Storage
- Input validation and sanitization
- HTTPS-only connections

---

## 📊 **ANALYTICS & TRACKING**

### **User Metrics**
- Total invitations created
- Total invitation views
- Total RSVP responses  
- Guest count across all invitations
- Most popular templates
- User engagement metrics

### **Invitation Metrics**
- View count per invitation
- RSVP response rate
- Share tracking
- Geographic data (if available)
- Time-based analytics

---

## 🚀 **DEPLOYMENT SPECIFICATIONS**

### **Environment Variables**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Build Configuration**
- Vite for fast builds and HMR
- TypeScript strict mode enabled
- Tailwind CSS with custom configuration
- Proper asset optimization
- Source maps for debugging

---

## ✅ **TESTING CHECKLIST**

### **Core Functionality**
- [ ] User registration with Google OAuth
- [ ] User registration with email/password  
- [ ] Login functionality
- [ ] Profile creation and editing
- [ ] Template selection and preview
- [ ] Custom template creation
- [ ] Invitation creation with all fields
- [ ] Guest list management
- [ ] RSVP form submission
- [ ] Invitation sharing (WhatsApp, Telegram)
- [ ] Dashboard statistics display
- [ ] Settings management
- [ ] Responsive design on all devices

### **Database Operations**
- [ ] User profiles save correctly
- [ ] Invitations persist to Supabase
- [ ] Guest lists are associated properly
- [ ] RSVP responses are tracked
- [ ] Custom templates are saved
- [ ] File uploads work (avatars)

### **UI/UX Verification**
- [ ] All animations work smoothly
- [ ] Forms validate properly
- [ ] Loading states display correctly
- [ ] Error messages are helpful
- [ ] Success feedback is celebratory
- [ ] Navigation highlights current page
- [ ] Mobile experience is excellent

---

## 📋 **FINAL IMPLEMENTATION NOTES**

### **Critical Success Factors**
1. **Exact Design Match**: Use the specified color palette, fonts, and spacing
2. **Smooth Animations**: Every interaction should feel polished and responsive
3. **Real Database**: Everything must save to and load from Supabase
4. **Perfect Uzbek**: All text content must be in proper Uzbek language
5. **Complete Features**: Every mentioned feature must be fully functional
6. **Mobile Excellence**: The mobile experience must be as good as desktop

### **Quality Standards**
- All forms must have real-time validation
- Loading states must be present everywhere
- Error handling must be comprehensive
- User feedback must be immediate and clear
- Performance must be optimized for fast loading
- Accessibility must be considered throughout

---

**🎯 RECREATION GOAL**: Create an identical wedding invitation platform that looks, feels, and functions exactly like the original TaklifNoma site, with beautiful design, smooth animations, complete functionality, and perfect Uzbek localization.

This guide provides everything needed to recreate the complete TaklifNoma platform with pixel-perfect accuracy and full feature parity.
