'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { parseSupabaseStorageUrl } from '@/lib/utils';

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


/**
 * Server action to delete an object from Supabase Object Storage.
 * Called whenever an admin clicks DELETE or REPLACES an uploaded image.
 */
export async function deleteStorageFileAction(fileUrl: string, bucketHint?: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { success: false, error: 'Supabase storage credentials not configured on server.' };
  }

  if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.trim()) {
    return { success: false, error: 'No file URL provided for deletion.' };
  }

  // 1. Verify user is authenticated
  const userClient = getUserClient();
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Unauthorized: Please log in to manage assets.' };
  }

  // 2. Parse bucket and path
  const parsed = parseSupabaseStorageUrl(fileUrl);
  const bucket = parsed?.bucket || bucketHint;
  const path = parsed?.path;

  // External URLs (e.g. Unsplash, external CDNs) do not belong to our bucket
  if (!bucket || !path) {
    return { success: true, message: 'External or non-Supabase asset skipped.' };
  }

  try {
    const storageAdmin = getStorageAdmin();
    const { data, error } = await storageAdmin.storage.from(bucket).remove([path]);

    if (error) {
      console.error(`Failed to delete storage file from [${bucket}/${path}]:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Successfully purged storage file: [${bucket}/${path}]`);
    return { success: true, data };
  } catch (err: any) {
    console.error('Storage deletion exception:', err);
    return { success: false, error: err.message || 'File deletion failed.' };
  }
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

    // 3. Purge previous/replaced image from bucket if oldFileUrl provided
    const oldFileUrl = (formData.get('oldFileUrl') as string | null)?.trim();
    if (oldFileUrl && oldFileUrl !== publicUrl) {
      const parsedOld = parseSupabaseStorageUrl(oldFileUrl);
      if (parsedOld) {
        await storageAdmin.storage
          .from(parsedOld.bucket)
          .remove([parsedOld.path])
          .then(() => console.log(`Auto-purged replaced image: [${parsedOld.bucket}/${parsedOld.path}]`))
          .catch((err) => console.error('Error auto-purging old image:', err));
      }
    }

    return { success: true, publicUrl };
  } catch (err: any) {
    console.error('Storage upload exception:', err);
    return { error: err.message || 'Image upload failed.' };
  }
}

export async function uploadMediaAction(formData: FormData, bucket: string = 'cms-media') {
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
    return { error: 'No media file provided for upload.' };
  }

  // Support both video and image files
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) {
    return { error: 'Only video files (MP4, WebM, Ogg) or image files are allowed.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `hero-media/${Date.now()}-${safeName}`;

    // Upload with 1-year immutable cacheControl so browsers efficiently cache the video chunk
    const storageAdmin = getStorageAdmin();
    const { data, error } = await storageAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: true,
      });

    if (error) {
      console.error('Media upload error:', error);
      return { error: error.message };
    }

    const { data: { publicUrl } } = storageAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    // Purge previous/replaced media from bucket if oldFileUrl provided
    const oldFileUrl = (formData.get('oldFileUrl') as string | null)?.trim();
    if (oldFileUrl && oldFileUrl !== publicUrl) {
      const parsedOld = parseSupabaseStorageUrl(oldFileUrl);
      if (parsedOld) {
        await storageAdmin.storage
          .from(parsedOld.bucket)
          .remove([parsedOld.path])
          .then(() => console.log(`Auto-purged replaced media: [${parsedOld.bucket}/${parsedOld.path}]`))
          .catch((err) => console.error('Error auto-purging old media:', err));
      }
    }

    return { success: true, publicUrl };
  } catch (err: any) {
    console.error('Media upload exception:', err);
    return { error: err.message || 'Media upload failed.' };
  }
}

