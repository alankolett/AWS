'use server';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
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
  const supabase = getSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { authorized: false, error: 'Unauthorized: Please log in.' };

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (callerProfile?.role !== 'admin') {
    return { authorized: false, error: 'Forbidden: Only administrators have privilege for this action.' };
  }

  return { authorized: true, user };
}

export async function createAdminOrMemberUser(
  email: string,
  passkey: string,
  role: 'admin' | 'member'
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Service role key is not configured.' };
  }

  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

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

export async function resetUserPasswordToPasskey(
  targetUserId: string,
  newPasskey: string
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Service role key is not configured.' };
  }

  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  if (!newPasskey || newPasskey.trim().length !== 6) {
    return { error: 'Passkey must be exactly 6 characters.' };
  }

  const supabaseAdmin = getSupabaseAdmin();

  // 1. Reset user password in Supabase Auth to the new passkey
  const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
    targetUserId,
    { password: newPasskey.trim() }
  );

  if (updateAuthError) {
    return { error: updateAuthError.message };
  }

  // 2. Mark needs_password_change = true in profiles table so user goes through passkey -> set permanent password flow
  const { error: updateProfileError } = await supabaseAdmin
    .from('profiles')
    .update({
      needs_password_change: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', targetUserId);

  if (updateProfileError) {
    return { error: updateProfileError.message };
  }

  revalidatePath('/ops/console/team');
  revalidatePath('/ops/console/provision');

  return { success: true, passkey: newPasskey.trim() };
}

export async function checkEmailAuthState(email: string) {
  if (!email || !email.trim()) return { found: false, error: 'Please enter a valid email address.' };

  const supabaseAdmin = getSupabaseAdmin();
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('needs_password_change')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (error || !profile) {
    return { found: false, error: 'No builder profile found for this email.' };
  }

  return { found: true, needs_password_change: !!profile.needs_password_change };
}
