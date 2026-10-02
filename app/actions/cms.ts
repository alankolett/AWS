'use server';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getSupabaseUser() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
}

function getSupabaseAdmin() {
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

async function verifyAdmin() {
  const supabase = getSupabaseUser();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { authorized: false, error: 'Unauthorized: Please log in.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { authorized: false, error: 'Forbidden: Only administrators can update site CMS settings.' };
  }

  return { authorized: true, user };
}

export async function updateSiteSetting(key: string, value: any) {
  const auth = await verifyAdmin();
  if (!auth.authorized || !auth.user) {
    return { error: auth.error };
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Use UPSERT with service role to guarantee write success
  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({
      key,
      value: value === undefined ? null : value,
      updated_by: auth.user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/home');
  revalidatePath('/founder');
  revalidatePath('/events');
  revalidatePath('/ops/console/home');
  return { success: true };
}

export async function updateSiteSettingsBatch(items: { key: string; value: any }[]) {
  const auth = await verifyAdmin();
  if (!auth.authorized || !auth.user) {
    return { error: auth.error };
  }

  const supabaseAdmin = getSupabaseAdmin();
  const now = new Date().toISOString();

  const rows = items.map(item => ({
    key: item.key,
    value: item.value === undefined ? null : item.value,
    updated_by: auth.user.id,
    updated_at: now,
  }));

  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/home');
  revalidatePath('/founder');
  revalidatePath('/events');
  revalidatePath('/ops/console/home');
  return { success: true };
}
