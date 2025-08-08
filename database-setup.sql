-- TaklifNoma loyihasi uchun Supabase database schema
-- Bu skriptni Supabase SQL Editor da ishga tushiring

-- 1. Profiles jadvali (foydalanuvchilar ma'lumotlari)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT
);

-- 2. Invitations jadvali (taklifnomalar)
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
    template_id TEXT NOT NULL DEFAULT 'classic',
    image_url TEXT,
    rsvp_deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    slug TEXT UNIQUE NOT NULL
);

-- 3. Guests jadvali (mehmonlar ro'yxati)
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    plus_one BOOLEAN DEFAULT FALSE
);

-- 4. RSVPs jadvali (javoblar)
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

-- Row Level Security (RLS) yoqish
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Profiles jadva li uchun RLS policies
CREATE POLICY "Foydalanuvchilar o'z profillarini ko'rishlari mumkin" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Foydalanuvchilar o'z profillarini yangilashlari mumkin" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Foydalanuvchilar o'z profillarini yaratashlari mumkin" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Invitations jadvali uchun RLS policies
CREATE POLICY "Foydalanuvchilar o'z taklifnomalarini ko'rishlari mumkin" 
    ON public.invitations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Faol taklifnomalarni hamma ko'rishi mumkin" 
    ON public.invitations FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Foydalanuvchilar o'z taklifnomalarini yaratashlari mumkin" 
    ON public.invitations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Foydalanuvchilar o'z taklifnomalarini yangilashlari mumkin" 
    ON public.invitations FOR UPDATE 
    USING (auth.uid() = user_id);

-- Guests jadvali uchun RLS policies
CREATE POLICY "Taklifnoma egasi mehmonlarini ko'rishi mumkin" 
    ON public.guests FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = invitation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Taklifnoma egasi mehmon qo'shishi mumkin" 
    ON public.guests FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = invitation_id AND user_id = auth.uid()
        )
    );

-- RSVPs jadvali uchun RLS policies
CREATE POLICY "Hamma RSVP qo'shishi mumkin"
    ON public.rsvps FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Taklifnoma egasi RSVPlarni ko'rishi mumkin"
    ON public.rsvps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE id = invitation_id AND user_id = auth.uid()
        )
    );

-- 5. Custom templates jadvali (foydalanuvchi tomonidan yaratilgan shablonlar)
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

-- Custom templates jadvali uchun RLS
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Foydalanuvchilar o'z shablonlarini ko'rishlari mumkin"
    ON public.custom_templates FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Foydalanuvchilar o'z shablonlarini yaratashlari mumkin"
    ON public.custom_templates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Foydalanuvchilar o'z shablonlarini yangilashlari mumkin"
    ON public.custom_templates FOR UPDATE
    USING (auth.uid() = user_id);

-- Trigger function: profil yaratish
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Yangi foydalanuvchi ro'yxatdan o'tganda profil yaratish
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Indekslar (tezlik uchun)
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_active ON public.invitations(is_active);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps(invitation_id);

-- Demo ma'lumotlar (ixtiyoriy)
-- Bu qismni faqat test uchun ishlatishingiz mumkin

/*
-- Demo foydalanuvchi profili
INSERT INTO public.profiles (id, first_name, last_name, email) 
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Demo',
    'Foydalanuvchi',
    'demo@taklifnoma.uz'
) ON CONFLICT (id) DO NOTHING;

-- Demo taklifnoma
INSERT INTO public.invitations (
    id,
    user_id,
    groom_name,
    bride_name,
    wedding_date,
    wedding_time,
    venue,
    address,
    city,
    custom_message,
    template_id,
    slug
) VALUES (
    'demo-invitation-id'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Jahongir',
    'Sarvinoz',
    '2024-06-15',
    '16:00',
    'Atirgul Bog''i',
    'Toshkent sh., Yunusobod t., Bog'' ko''chasi 123',
    'Toshkent',
    'Bizning sevgi va baxt to''la kunimizni birga nishonlash uchun sizni taklif qilamiz.',
    'classic',
    'jahongir-sarvinoz-demo'
) ON CONFLICT (id) DO NOTHING;
*/

-- Database schema setup yakunlandi!
-- Endi Supabase SQL Editor da bu skriptni ishga tushiring.
