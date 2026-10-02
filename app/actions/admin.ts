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
        getAll() {
          return cookieStore.getAll();
        },
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
        getAll() {
          return cookies().getAll();
        },
        setAll() {},
      },
    }
  );
}

export async function createAdminOrMemberUser(
  email: string,
  passkey: string,
  role: 'admin' | 'member'
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Service role key is not configured.' };
  }

  // Validate the caller is actually an admin
  const supabase = getSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Unauthorized: Please log in.' };

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (callerProfile?.role !== 'admin') {
    return { error: 'Forbidden: Only administrators can provision accounts.' };
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Create the user via admin API
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: passkey,
    email_confirm: true,
  });

  if (createError) {
    return { error: createError.message };
  }

  if (newUser?.user) {
    // Wait slightly to ensure any trigger creates or updates profile
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Ensure profile row exists or is updated with assigned role and needs_password_change
    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        email,
        role,
        needs_password_change: true,
        updated_at: new Date().toISOString(),
      });
  }

  revalidatePath('/ops/console/team');
  revalidatePath('/ops/console/provision');
  revalidatePath('/team');

  return { success: true };
}
