-- Enhanced TaklifNoma.uz Database Setup
-- ======================================
-- Complete database schema with all necessary tables, functions, and policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- CORE TABLES
-- =====================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    company_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Custom Templates
CREATE TABLE IF NOT EXISTS public.custom_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'custom',
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    colors JSONB DEFAULT '{}'::jsonb,
    fonts JSONB DEFAULT '{}'::jsonb,
    layout JSONB DEFAULT '{}'::jsonb,
    custom_css TEXT,
    preview_image TEXT,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Invitations
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
    template_id TEXT NOT NULL DEFAULT 'classic',
    custom_template_id UUID REFERENCES public.custom_templates(id) ON DELETE SET NULL,
    image_url TEXT,
    rsvp_deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    slug TEXT UNIQUE NOT NULL,
    view_count INTEGER DEFAULT 0,
    settings JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Guests
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    plus_one BOOLEAN DEFAULT FALSE,
    group_name TEXT,
    notes TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- RSVPs
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    will_attend BOOLEAN NOT NULL,
    plus_one_attending BOOLEAN,
    message TEXT,
    email TEXT,
    phone TEXT,
    dietary_requirements TEXT,
    song_request TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Invitation Views (for analytics)
CREATE TABLE IF NOT EXISTS public.invitation_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
    visitor_ip INET,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================
-- INDEXES FOR PERFORMANCE
-- =====================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active) WHERE is_active = true;

-- Invitations indexes
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_created_at ON public.invitations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invitations_wedding_date ON public.invitations(wedding_date);
CREATE INDEX IF NOT EXISTS idx_invitations_is_active ON public.invitations(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_invitations_template_id ON public.invitations(template_id);

-- Custom templates indexes
CREATE INDEX IF NOT EXISTS idx_custom_templates_user_id ON public.custom_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_templates_category ON public.custom_templates(category);
CREATE INDEX IF NOT EXISTS idx_custom_templates_is_public ON public.custom_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_custom_templates_is_featured ON public.custom_templates(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_custom_templates_created_at ON public.custom_templates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_templates_usage_count ON public.custom_templates(usage_count DESC);

-- Other indexes
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_invitation_views_invitation_id ON public.invitation_views(invitation_id);

-- =====================================
-- TRIGGERS FOR AUTO-UPDATE
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invitations_updated_at ON public.invitations;
CREATE TRIGGER update_invitations_updated_at 
    BEFORE UPDATE ON public.invitations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_custom_templates_updated_at ON public.custom_templates;
CREATE TRIGGER update_custom_templates_updated_at 
    BEFORE UPDATE ON public.custom_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guests_updated_at ON public.guests;
CREATE TRIGGER update_guests_updated_at 
    BEFORE UPDATE ON public.guests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rsvps_updated_at ON public.rsvps;
CREATE TRIGGER update_rsvps_updated_at 
    BEFORE UPDATE ON public.rsvps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_views ENABLE ROW LEVEL SECURITY;

-- =====================================
-- RLS POLICIES - PROFILES
-- =====================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================
-- RLS POLICIES - INVITATIONS
-- =====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Public can view active invitations" ON public.invitations;

-- Users can manage their own invitations
CREATE POLICY "Users can manage own invitations" ON public.invitations
    FOR ALL USING (auth.uid() = user_id);

-- Public can view active invitations (for sharing)
CREATE POLICY "Public can view active invitations" ON public.invitations
    FOR SELECT USING (is_active = true);

-- =====================================
-- RLS POLICIES - CUSTOM TEMPLATES
-- =====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own templates" ON public.custom_templates;
DROP POLICY IF EXISTS "Public can view public templates" ON public.custom_templates;

-- Users can manage their own templates
CREATE POLICY "Users can manage own templates" ON public.custom_templates
    FOR ALL USING (auth.uid() = user_id);

-- Public can view public templates
CREATE POLICY "Public can view public templates" ON public.custom_templates
    FOR SELECT USING (is_public = true AND is_active = true);

-- =====================================
-- RLS POLICIES - GUESTS & RSVPS
-- =====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage guests of own invitations" ON public.guests;
DROP POLICY IF EXISTS "Public can view guests of active invitations" ON public.guests;
DROP POLICY IF EXISTS "Users can manage rsvps of own invitations" ON public.rsvps;
DROP POLICY IF EXISTS "Public can insert rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Public can view rsvps of active invitations" ON public.rsvps;

-- Guests policies
CREATE POLICY "Users can manage guests of own invitations" ON public.guests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = guests.invitation_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view guests of active invitations" ON public.guests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = guests.invitation_id 
            AND is_active = true
        )
    );

-- RSVPs policies
CREATE POLICY "Users can manage rsvps of own invitations" ON public.rsvps
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = rsvps.invitation_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Public can insert rsvps" ON public.rsvps
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = invitation_id 
            AND is_active = true
        )
    );

CREATE POLICY "Public can view rsvps of active invitations" ON public.rsvps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = rsvps.invitation_id 
            AND is_active = true
        )
    );

-- =====================================
-- RLS POLICIES - ANALYTICS
-- =====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public can insert invitation_views" ON public.invitation_views;
DROP POLICY IF EXISTS "Users can view own invitation analytics" ON public.invitation_views;

-- Invitation views (public can insert, users can view own)
CREATE POLICY "Public can insert invitation_views" ON public.invitation_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own invitation analytics" ON public.invitation_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = invitation_views.invitation_id 
            AND user_id = auth.uid()
        )
    );

-- =====================================
-- FUNCTIONS
-- =====================================

-- Function to increment invitation view count
CREATE OR REPLACE FUNCTION increment_invitation_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.invitations 
    SET view_count = view_count + 1 
    WHERE id = NEW.invitation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment view count
DROP TRIGGER IF EXISTS increment_invitation_views_trigger ON public.invitation_views;
CREATE TRIGGER increment_invitation_views_trigger 
    AFTER INSERT ON public.invitation_views 
    FOR EACH ROW 
    EXECUTE FUNCTION increment_invitation_views();

-- Function to increment template usage count
CREATE OR REPLACE FUNCTION increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.custom_template_id IS NOT NULL THEN
        UPDATE public.custom_templates 
        SET usage_count = usage_count + 1 
        WHERE id = NEW.custom_template_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment usage count when invitation uses custom template
DROP TRIGGER IF EXISTS increment_template_usage_trigger ON public.invitations;
CREATE TRIGGER increment_template_usage_trigger 
    AFTER INSERT ON public.invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION increment_template_usage();

-- =====================================
-- SAMPLE DATA
-- =====================================

-- Insert sample templates for testing
INSERT INTO public.custom_templates (
    name, description, category, colors, fonts, config, is_public, is_featured, tags
) VALUES 
(
    'Klassik Oq Shablon',
    'Klassik va nozik oq rangdagi shablon',
    'classic',
    '{"primary": "#ffffff", "secondary": "#f8f9fa", "accent": "#6c757d", "background": "#ffffff", "text": "#333333"}'::jsonb,
    '{"heading": "Playfair Display", "body": "Inter", "accent": "Dancing Script"}'::jsonb,
    '{"layout": {"style": "classic", "spacing": 24}, "animations": {"enabled": true, "type": "fade"}}'::jsonb,
    true,
    true,
    ARRAY['classic', 'elegant', 'white']
),
(
    'Zamonaviy Ko\'k Shablon',
    'Zamonaviy ko\'k rangdagi professional shablon',
    'modern',
    '{"primary": "#007bff", "secondary": "#e3f2fd", "accent": "#0056b3", "background": "#ffffff", "text": "#333333"}'::jsonb,
    '{"heading": "Poppins", "body": "Inter", "accent": "Open Sans"}'::jsonb,
    '{"layout": {"style": "modern", "spacing": 32}, "animations": {"enabled": true, "type": "slide"}}'::jsonb,
    true,
    true,
    ARRAY['modern', 'blue', 'professional']
) ON CONFLICT DO NOTHING;

-- =====================================
-- COMPLETION MESSAGE
-- =====================================

DO $$
BEGIN
    RAISE NOTICE 'TaklifNoma.uz enhanced database setup completed successfully!';
    RAISE NOTICE 'Tables created: profiles, custom_templates, invitations, guests, rsvps, invitation_views';
    RAISE NOTICE 'All RLS policies, triggers, and functions are configured';
    RAISE NOTICE 'Sample templates have been added';
END $$;
