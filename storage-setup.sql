-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('templates', 'templates', true),
('invitations', 'invitations', true);

-- Create storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for templates bucket
CREATE POLICY "Template images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'templates');

CREATE POLICY "Authenticated users can upload template images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'templates' AND auth.role() = 'authenticated');

-- Create storage policies for invitations bucket
CREATE POLICY "Users can view their own invitation assets" ON storage.objects
FOR SELECT USING (bucket_id = 'invitations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload invitation assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'invitations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own invitation assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'invitations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own invitation assets" ON storage.objects
FOR DELETE USING (bucket_id = 'invitations' AND auth.uid()::text = (storage.foldername(name))[1]);
