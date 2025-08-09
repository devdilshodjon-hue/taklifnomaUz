-- Temporarily disable RLS for testing
-- =====================================
-- This will allow anonymous access to all tables for testing

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_views DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to anonymous users for testing
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.invitations TO anon;
GRANT ALL ON public.custom_templates TO anon;
GRANT ALL ON public.guests TO anon;
GRANT ALL ON public.rsvps TO anon;
GRANT ALL ON public.invitation_views TO anon;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Allow anon to execute functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Create a simple test function for connection testing
CREATE OR REPLACE FUNCTION public.test_connection()
RETURNS TEXT AS $$
BEGIN
  RETURN 'Supabase connection working! ' || NOW()::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on test function
GRANT EXECUTE ON FUNCTION public.test_connection() TO anon;
GRANT EXECUTE ON FUNCTION public.test_connection() TO authenticated;

-- Create a test profile if none exists
INSERT INTO public.profiles (id, email, first_name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User')
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'RLS temporarily disabled for testing. Supabase should work now!' as status;
