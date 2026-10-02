'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getSupabase() {
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
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookies().getAll(); },
        setAll() {},
      },
    }
  );
}

async function verifyAdmin() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { authorized: false, error: 'Unauthorized: Please log in.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { authorized: false, error: 'Forbidden: Only administrators can manage team domains.' };
  }

  return { authorized: true, user };
}

export async function createDomain(name: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const trimmed = name.trim();
  if (!trimmed) return { error: 'Domain name cannot be empty.' };

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from('team_sections')
    .insert({ name: trimmed })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/team');
  return { success: true, domain: data };
}

export async function updateDomain(id: string, name: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const trimmed = name.trim();
  if (!trimmed) return { error: 'Domain name cannot be empty.' };

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from('team_sections')
    .update({ name: trimmed })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/team');
  return { success: true, domain: data };
}

export async function deleteDomain(id: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from('team_sections')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/team');
  return { success: true };
}
