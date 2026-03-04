-- =============================================
-- Supabase Storage: "logos" Bucket + RLS Policies
-- =============================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- or via the Supabase CLI.

-- 1. Add logo_url column to workspaces (if not exists)
ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Create the storage bucket (public for serving images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  2097152,  -- 2 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Drop any old policies (idempotent re-run)
DROP POLICY IF EXISTS "logos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "logos_insert_own_workspace" ON storage.objects;
DROP POLICY IF EXISTS "logos_update_own_workspace" ON storage.objects;
DROP POLICY IF EXISTS "logos_delete_own_workspace" ON storage.objects;

-- 4. RLS Policies for storage.objects on the "logos" bucket

-- 4a. Public read: anyone can view logos (needed for emails, embed widget, etc.)
CREATE POLICY "logos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

-- 4b. Authenticated users can upload logos for their own workspaces
CREATE POLICY "logos_insert_own_workspace"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'logos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.workspaces WHERE owner_id = (select auth.uid())
    )
  );

-- 4c. Authenticated users can update (overwrite) logos for their own workspaces
CREATE POLICY "logos_update_own_workspace"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'logos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.workspaces WHERE owner_id = (select auth.uid())
    )
  );

-- 4d. Authenticated users can delete logos for their own workspaces
CREATE POLICY "logos_delete_own_workspace"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'logos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.workspaces WHERE owner_id = (select auth.uid())
    )
  );
