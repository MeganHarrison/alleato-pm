-- Add RLS policies for specifications and schedules storage buckets
-- Created: 2025-12-23
-- Purpose: Fix specifications and schedules upload functionality in project setup wizard

-- Specifications bucket policies
CREATE POLICY "Allow authenticated uploads to specifications"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'specifications');

CREATE POLICY "Allow public read from specifications"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'specifications');

CREATE POLICY "Allow authenticated delete from specifications"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'specifications');

-- Schedules bucket policies
CREATE POLICY "Allow authenticated uploads to schedules"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'schedules');

CREATE POLICY "Allow public read from schedules"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'schedules');

CREATE POLICY "Allow authenticated delete from schedules"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'schedules');
