-- Temporarily disable RLS on custom_templates table for debugging
-- This is ONLY for testing/debugging purposes

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity, 
       (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'custom_templates') as policy_count
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'custom_templates';

-- Disable RLS temporarily (ONLY for debugging)
ALTER TABLE public.custom_templates DISABLE ROW LEVEL SECURITY;

-- Show current policies
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'custom_templates';

-- Test insert without RLS
INSERT INTO public.custom_templates (
  user_id,
  name, 
  description,
  category,
  colors,
  fonts,
  config,
  is_public,
  is_featured,
  usage_count,
  tags
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Test user ID
  'Test Template',
  'Test description',
  'test',
  '{"primary": "#000000"}',
  '{"heading": "Arial"}',
  '{"layout": {"style": "modern"}}',
  false,
  false,
  0,
  ARRAY['test']
);

-- Re-enable RLS after testing (remember to run this!)
-- ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;
