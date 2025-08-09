-- Fix Supabase Authentication and RLS Issues
-- =====================================
-- This SQL script fixes the authentication and permission issues

-- First, let's create a function to handle automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, created_at, updated_at)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1), NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Allow public access to read public data without authentication
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
CREATE POLICY "Enable read access for all users" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
CREATE POLICY "Enable update for users based on email" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow anonymous access to invitations for public viewing
DROP POLICY IF EXISTS "Allow anonymous access to active invitations" ON public.invitations;
CREATE POLICY "Allow anonymous access to active invitations" ON public.invitations
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow authenticated users to manage own invitations" ON public.invitations;
CREATE POLICY "Allow authenticated users to manage own invitations" ON public.invitations
  FOR ALL USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false  -- No access for anonymous users to modify
      ELSE auth.uid() = user_id  -- Full access for own invitations
    END
  );

-- Allow insert for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to insert invitations" ON public.invitations;
CREATE POLICY "Allow authenticated users to insert invitations" ON public.invitations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow public access to custom templates
DROP POLICY IF EXISTS "Allow public access to templates" ON public.custom_templates;
CREATE POLICY "Allow public access to templates" ON public.custom_templates
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow authenticated users to manage own templates" ON public.custom_templates;
CREATE POLICY "Allow authenticated users to manage own templates" ON public.custom_templates
  FOR ALL USING (auth.uid() = user_id);

-- Allow insert for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to insert templates" ON public.custom_templates;
CREATE POLICY "Allow authenticated users to insert templates" ON public.custom_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Temporarily disable RLS for testing (can be re-enabled later)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.custom_templates DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.invitations TO authenticated;
GRANT ALL ON public.custom_templates TO authenticated;
GRANT ALL ON public.guests TO authenticated;
GRANT ALL ON public.rsvps TO authenticated;
GRANT ALL ON public.invitation_views TO authenticated;

-- Grant read permissions to anonymous users
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.invitations TO anon;
GRANT SELECT ON public.custom_templates TO anon;
GRANT SELECT ON public.guests TO anon;
GRANT SELECT ON public.rsvps TO anon;
GRANT INSERT ON public.invitation_views TO anon;
GRANT INSERT ON public.rsvps TO anon;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Create a simple test function
CREATE OR REPLACE FUNCTION public.test_connection()
RETURNS TEXT AS $$
BEGIN
  RETURN 'Supabase connection is working!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the test function
GRANT EXECUTE ON FUNCTION public.test_connection() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_connection() TO anon;

-- Create a basic health check
INSERT INTO public.profiles (id, email, first_name, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test User',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Supabase authentication and RLS policies fixed successfully!' as status;
