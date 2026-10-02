'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Service role client without cookie binding so it ALWAYS bypasses RLS on storage.objects
function getStorageAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// User auth verification client
function getUserClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
}

export async function uploadImageAction(formData: FormData, bucket: string = 'cms-media') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Supabase storage credentials not configured on server.' };
  }

  // 1. Verify user is authenticated
  const userClient = getUserClient();
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized: Please log in to upload assets.' };
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { error: 'No file provided for upload.' };
  }

  // Validate image MIME type
  if (!file.type.startsWith('image/')) {
    return { error: 'Only image files (PNG, JPG, WebP, SVG, GIF, AVIF) are allowed.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${Date.now()}-${safeName}`;

    // 2. Upload using true service-role client (bypasses RLS on storage.objects)
    const storageAdmin = getStorageAdmin();
    const { data, error } = await storageAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { error: error.message };
    }

    const { data: { publicUrl } } = storageAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, publicUrl };
  } catch (err: any) {
    console.error('Storage upload exception:', err);
    return { error: err.message || 'Image upload failed.' };
  }
}
