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

import { createClient } from '@supabase/supabase-js';

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

export async function updateProfile(profileId: string, data: {
  full_name?: string;
  role?: 'admin' | 'member' | 'student';
  headline?: string;
  division?: string;
  branch?: string;
  year?: string;
  bio?: string;
  quote?: string;
  avatar_url?: string;
  banner_url?: string;
  builder_id?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  skills?: string[];
  badges?: any[];
  certifications?: any[];
  is_lead?: boolean;
  team_section_id?: string;
}) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized: Please log in.' };

  // Fetch caller's current profile to check role
  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = callerProfile?.role === 'admin';
  const isSelf = user.id === profileId;

  if (!isAdmin && !isSelf) {
    return { error: 'Forbidden: You can only edit your own profile.' };
  }

  // If a member is editing their own profile, prevent them from elevating their role to admin
  const sanitizedData = { ...data };
  if (!isAdmin) {
    delete sanitizedData.role; // Members cannot change their role
    delete sanitizedData.is_lead;
  }

  // Use service role client to ensure reliable execution bypassing RLS
  const clientToUse = getSupabaseAdmin();

  const { data: updated, error } = await clientToUse
    .from('profiles')
    .update({
      ...sanitizedData,
      updated_at: new Date().toISOString()
    })
    .eq('id', profileId)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/team');
  revalidatePath('/home');
  revalidatePath('/founder');

  return { success: true, profile: updated };
}

export async function deleteMember(profileId: string) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized: Please log in.' };

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (callerProfile?.role !== 'admin') {
    return { error: 'Forbidden: Only administrators can remove members.' };
  }

  if (user.id === profileId) {
    return { error: 'Action denied: Cannot delete your own root account.' };
  }

  const supabaseAdmin = getSupabaseAdmin();
  
  // Delete from auth.users (cascades to profiles)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(profileId);
  if (error) {
    // Fallback: delete directly from profiles table
    await supabaseAdmin.from('profiles').delete().eq('id', profileId);
  }

  revalidatePath('/team');
  return { success: true };
}
