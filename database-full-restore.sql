-- TaklifNoma.uz - To'liq Ma'lumotlar Ombori Tiklash
-- ===================================================
-- Barcha tablelar, funksiyalar, triggerlar va ma'lumotlarni qayta yaratish

-- Extensions-ni yoqish
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ===================================================
-- TABLELARNI YARATISH
-- ===================================================

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    company_name TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    role TEXT DEFAULT 'user' NOT NULL,
    settings JSONB DEFAULT '{}' NOT NULL,
    metadata JSONB DEFAULT '{}' NOT NULL,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Custom Templates table
CREATE TABLE IF NOT EXISTS public.custom_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'custom' NOT NULL,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    config JSONB DEFAULT '{}' NOT NULL,
    colors JSONB DEFAULT '{}' NOT NULL,
    fonts JSONB DEFAULT '{}' NOT NULL,
    layout JSONB DEFAULT '{}' NOT NULL,
    custom_css TEXT,
    custom_html TEXT,
    preview_image TEXT,
    usage_count INTEGER DEFAULT 0 NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    version INTEGER DEFAULT 1 NOT NULL,
    metadata JSONB DEFAULT '{}' NOT NULL
);

-- 3. Invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
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
    country TEXT DEFAULT 'Uzbekistan',
    custom_message TEXT,
    template_id TEXT DEFAULT 'classic' NOT NULL,
    custom_template_id UUID REFERENCES public.custom_templates(id) ON DELETE SET NULL,
    image_url TEXT,
    background_image TEXT,
    rsvp_deadline DATE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    view_count INTEGER DEFAULT 0 NOT NULL,
    rsvp_count INTEGER DEFAULT 0 NOT NULL,
    guest_count INTEGER DEFAULT 0 NOT NULL,
    settings JSONB DEFAULT '{}' NOT NULL,
    custom_fields JSONB DEFAULT '{}' NOT NULL,
    metadata JSONB DEFAULT '{}' NOT NULL
);

-- 4. Guests table
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    plus_one BOOLEAN DEFAULT FALSE NOT NULL,
    plus_one_name TEXT,
    group_name TEXT,
    table_number INTEGER,
    notes TEXT,
    is_vip BOOLEAN DEFAULT FALSE NOT NULL,
    invitation_sent BOOLEAN DEFAULT FALSE NOT NULL,
    invitation_sent_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}' NOT NULL
);

-- 5. RSVPs table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
    guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT,
    will_attend BOOLEAN NOT NULL,
    plus_one_attending BOOLEAN DEFAULT FALSE,
    plus_one_name TEXT,
    message TEXT,
    dietary_requirements TEXT,
    song_request TEXT,
    arrival_time TIME,
    special_needs TEXT,
    metadata JSONB DEFAULT '{}' NOT NULL
);

-- 6. Invitation Views table (analytics)
CREATE TABLE IF NOT EXISTS public.invitation_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
    visitor_ip INET,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    session_id TEXT,
    view_duration INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}' NOT NULL
);

-- 7. Template Categories table
CREATE TABLE IF NOT EXISTS public.template_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- ===================================================
-- INDEXES
-- ===================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
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
CREATE INDEX IF NOT EXISTS idx_custom_templates_usage_count ON public.custom_templates(usage_count DESC);

-- Other indexes
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_invitation_views_invitation_id ON public.invitation_views(invitation_id);

-- ===================================================
-- FUNKSIYALAR
-- ===================================================

-- 1. Updated_at trigger funksiyasi
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profile avtomatik yaratish funksiyasi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, first_name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Invitation view count increment funksiyasi
CREATE OR REPLACE FUNCTION public.increment_invitation_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.invitations 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = NEW.invitation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Template usage count increment funksiyasi
CREATE OR REPLACE FUNCTION public.increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.custom_template_id IS NOT NULL THEN
        UPDATE public.custom_templates 
        SET usage_count = usage_count + 1,
            updated_at = NOW()
        WHERE id = NEW.custom_template_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RSVP count update funksiyasi
CREATE OR REPLACE FUNCTION public.update_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.invitations 
    SET rsvp_count = (
        SELECT COUNT(*) 
        FROM public.rsvps 
        WHERE invitation_id = COALESCE(NEW.invitation_id, OLD.invitation_id)
    ),
    updated_at = NOW()
    WHERE id = COALESCE(NEW.invitation_id, OLD.invitation_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Connection test funksiyasi
CREATE OR REPLACE FUNCTION public.test_connection()
RETURNS json AS $$
BEGIN
    RETURN json_build_object(
        'status', 'success',
        'message', 'TaklifNoma.uz database is working',
        'timestamp', NOW(),
        'version', '2.0'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Get invitation statistics funksiyasi
CREATE OR REPLACE FUNCTION public.get_invitation_stats(invitation_uuid UUID)
RETURNS json AS $$
DECLARE
    stats json;
BEGIN
    SELECT json_build_object(
        'view_count', COALESCE(i.view_count, 0),
        'rsvp_count', COALESCE(i.rsvp_count, 0),
        'guest_count', COALESCE(i.guest_count, 0),
        'attending_count', COALESCE(attending.count, 0),
        'not_attending_count', COALESCE(not_attending.count, 0)
    )
    INTO stats
    FROM public.invitations i
    LEFT JOIN (
        SELECT invitation_id, COUNT(*) as count
        FROM public.rsvps 
        WHERE invitation_id = invitation_uuid AND will_attend = true
        GROUP BY invitation_id
    ) attending ON i.id = attending.invitation_id
    LEFT JOIN (
        SELECT invitation_id, COUNT(*) as count
        FROM public.rsvps 
        WHERE invitation_id = invitation_uuid AND will_attend = false
        GROUP BY invitation_id
    ) not_attending ON i.id = not_attending.invitation_id
    WHERE i.id = invitation_uuid;

    RETURN COALESCE(stats, '{"view_count":0,"rsvp_count":0,"guest_count":0,"attending_count":0,"not_attending_count":0}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================
-- TRIGGERLAR
-- ===================================================

-- Updated_at triggerlar
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_invitations_updated_at ON public.invitations;
CREATE TRIGGER trigger_invitations_updated_at
    BEFORE UPDATE ON public.invitations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_custom_templates_updated_at ON public.custom_templates;
CREATE TRIGGER trigger_custom_templates_updated_at
    BEFORE UPDATE ON public.custom_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_guests_updated_at ON public.guests;
CREATE TRIGGER trigger_guests_updated_at
    BEFORE UPDATE ON public.guests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_rsvps_updated_at ON public.rsvps;
CREATE TRIGGER trigger_rsvps_updated_at
    BEFORE UPDATE ON public.rsvps
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- User creation trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- View increment trigger
DROP TRIGGER IF EXISTS trigger_increment_views ON public.invitation_views;
CREATE TRIGGER trigger_increment_views
    AFTER INSERT ON public.invitation_views
    FOR EACH ROW EXECUTE FUNCTION public.increment_invitation_views();

-- Template usage trigger
DROP TRIGGER IF EXISTS trigger_increment_template_usage ON public.invitations;
CREATE TRIGGER trigger_increment_template_usage
    AFTER INSERT ON public.invitations
    FOR EACH ROW EXECUTE FUNCTION public.increment_template_usage();

-- RSVP count trigger
DROP TRIGGER IF EXISTS trigger_update_rsvp_count ON public.rsvps;
CREATE TRIGGER trigger_update_rsvp_count
    AFTER INSERT OR UPDATE OR DELETE ON public.rsvps
    FOR EACH ROW EXECUTE FUNCTION public.update_rsvp_count();

-- ===================================================
-- RLS O'CHIRISH (CHEKLOVLAR YO'Q)
-- ===================================================

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_categories DISABLE ROW LEVEL SECURITY;

-- ===================================================
-- PERMISSIONS (TO'LIQ RUXSATLAR)
-- ===================================================

-- Anonymous users uchun to'liq ruxsatlar
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Authenticated users uchun to'liq ruxsatlar
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Service role uchun to'liq ruxsatlar
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ===================================================
-- SAMPLE DATA - TEMPLATE CATEGORIES
-- ===================================================

INSERT INTO public.template_categories (name, display_name, description, icon, color, sort_order) VALUES
('classic', 'Klassik', 'Klassik va nozik shablonlar', 'Heart', '#8B5CF6', 1),
('modern', 'Zamonaviy', 'Zamonaviy va minimal shablonlar', 'Sparkles', '#3B82F6', 2),
('elegant', 'Nafis', 'Nafis va hashamatli shablonlar', 'Crown', '#EF4444', 3),
('floral', 'Gullar', 'Gul naqshli shablonlar', 'Flower', '#10B981', 4),
('vintage', 'Retro', 'Retro va nostaljik shablonlar', 'Camera', '#F59E0B', 5),
('minimalist', 'Minimal', 'Sodda va minimal shablonlar', 'Circle', '#6B7280', 6)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ===================================================
-- SAMPLE DATA - CUSTOM TEMPLATES
-- ===================================================

INSERT INTO public.custom_templates (
    name, description, category, is_public, is_featured, 
    colors, fonts, config, tags
) VALUES 
(
    'Klassik Oq Shablon',
    'Klassik va nozik oq rangdagi shablon to''y taklifnomalari uchun',
    'classic',
    true,
    true,
    '{"primary": "#ffffff", "secondary": "#f8f9fa", "accent": "#6c757d", "background": "#ffffff", "text": "#333333", "gold": "#d4af37"}'::jsonb,
    '{"heading": "Playfair Display", "body": "Inter", "accent": "Dancing Script"}'::jsonb,
    '{"layout": {"style": "classic", "spacing": 24, "borderRadius": 8}, "animations": {"enabled": true, "type": "fade", "duration": 800}}'::jsonb,
    ARRAY['classic', 'elegant', 'white', 'traditional']
),
(
    'Zamonaviy Ko''k Shablon',
    'Zamonaviy ko''k rangdagi professional shablon',
    'modern',
    true,
    true,
    '{"primary": "#007bff", "secondary": "#e3f2fd", "accent": "#0056b3", "background": "#ffffff", "text": "#333333", "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}'::jsonb,
    '{"heading": "Poppins", "body": "Inter", "accent": "Open Sans"}'::jsonb,
    '{"layout": {"style": "modern", "spacing": 32, "borderRadius": 12}, "animations": {"enabled": true, "type": "slide", "duration": 600}}'::jsonb,
    ARRAY['modern', 'blue', 'professional', 'clean']
),
(
    'Gullar Shablon',
    'Go''zal gul naqshlari bilan bezatilgan shablon',
    'floral',
    true,
    true,
    '{"primary": "#ff6b9d", "secondary": "#fde2e7", "accent": "#e91e63", "background": "#fff5f7", "text": "#2d1b69", "floral": "#4caf50"}'::jsonb,
    '{"heading": "Great Vibes", "body": "Lato", "accent": "Dancing Script"}'::jsonb,
    '{"layout": {"style": "floral", "spacing": 20, "borderRadius": 16}, "animations": {"enabled": true, "type": "bloom", "duration": 1000}}'::jsonb,
    ARRAY['floral', 'romantic', 'pink', 'flowers']
),
(
    'Oltin Nafis Shablon',
    'Oltin ranglar bilan nafis va hashamatli shablon',
    'elegant',
    true,
    true,
    '{"primary": "#d4af37", "secondary": "#faf5e6", "accent": "#b8860b", "background": "#fffef7", "text": "#2c1810", "gold": "#ffd700"}'::jsonb,
    '{"heading": "Cormorant Garamond", "body": "Crimson Text", "accent": "Alex Brush"}'::jsonb,
    '{"layout": {"style": "elegant", "spacing": 28, "borderRadius": 6}, "animations": {"enabled": true, "type": "luxury", "duration": 1200}}'::jsonb,
    ARRAY['elegant', 'luxury', 'gold', 'premium']
)
ON CONFLICT DO NOTHING;

-- ===================================================
-- SAMPLE PROFILES (Test Users)
-- ===================================================

INSERT INTO public.profiles (id, email, first_name, last_name, full_name, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test', 'User', 'Test User', true),
('00000000-0000-0000-0000-000000000002', 'demo@taklifnoma.uz', 'Demo', 'User', 'Demo User', true)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    updated_at = NOW();

-- ===================================================
-- FINAL SUCCESS MESSAGE
-- ===================================================

DO $$
BEGIN
    RAISE NOTICE '======================================================';
    RAISE NOTICE 'TaklifNoma.uz Database To''liq Tiklandi!';
    RAISE NOTICE '======================================================';
    RAISE NOTICE 'Yaratilgan tablelar:';
    RAISE NOTICE '- profiles (% ta)', (SELECT COUNT(*) FROM public.profiles);
    RAISE NOTICE '- custom_templates (% ta)', (SELECT COUNT(*) FROM public.custom_templates);
    RAISE NOTICE '- invitations (% ta)', (SELECT COUNT(*) FROM public.invitations);
    RAISE NOTICE '- guests (% ta)', (SELECT COUNT(*) FROM public.guests);
    RAISE NOTICE '- rsvps (% ta)', (SELECT COUNT(*) FROM public.rsvps);
    RAISE NOTICE '- invitation_views (% ta)', (SELECT COUNT(*) FROM public.invitation_views);
    RAISE NOTICE '- template_categories (% ta)', (SELECT COUNT(*) FROM public.template_categories);
    RAISE NOTICE '======================================================';
    RAISE NOTICE 'Yaratilgan funksiyalar: 7 ta';
    RAISE NOTICE 'Yaratilgan triggerlar: 8 ta';
    RAISE NOTICE 'RLS: O''chirilgan (CRUD uchun to''liq ruxsat)';
    RAISE NOTICE 'Permissions: Anon, Authenticated, Service Role - TO''LIQ';
    RAISE NOTICE '======================================================';
    RAISE NOTICE 'Database tayyor! Test qiling: SELECT public.test_connection();';
    RAISE NOTICE '======================================================';
END $$;

-- Test qilish uchun connection check
SELECT public.test_connection() as "Database Status";
