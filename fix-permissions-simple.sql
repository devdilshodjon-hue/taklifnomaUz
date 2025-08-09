-- Simple Permission Fix for Supabase
-- ===================================
-- This script provides minimal permissions for anonymous users

-- Grant basic permissions to anonymous users
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON public.invitations TO anon;
GRANT INSERT ON public.profiles TO anon;
GRANT INSERT ON public.custom_templates TO anon;

-- Grant permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Temporarily disable RLS on main tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_templates DISABLE ROW LEVEL SECURITY;

-- Create a simple test endpoint
CREATE OR REPLACE FUNCTION public.health_check()
RETURNS json AS $$
BEGIN
  RETURN json_build_object(
    'status', 'ok',
    'message', 'Supabase is working',
    'timestamp', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow anyone to call the health check
GRANT EXECUTE ON FUNCTION public.health_check() TO anon;
GRANT EXECUTE ON FUNCTION public.health_check() TO authenticated;

-- Success message
SELECT 'Permission issues should be resolved!' as result;
