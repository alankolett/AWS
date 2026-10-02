import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service role key not configured' });
  }

  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() { return cookies().getAll(); },
        setAll() {},
      },
    }
  );

  const email = 'meghani.laksh@gmail.com';
  
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const existingUser = users?.users?.find((u) => u.email === email);

  let userId;
  let messages = [];

  if (existingUser) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.id,
      { password: '000000', email_confirm: true }
    );
    if (error) messages.push('Error updating user password: ' + error.message);
    else messages.push('Successfully updated password to 000000');
    userId = existingUser.id;
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: '000000',
      email_confirm: true
    });
    if (error) messages.push('Error creating user: ' + error.message);
    else messages.push('Successfully created user with password 000000');
    userId = data?.user?.id;
  }

  if (userId) {
    // FORCE UPSERT the profile so we guarantee it exists, bypassing any trigger failure
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({ 
        id: userId, 
        email: email, 
        role: 'admin', 
        needs_password_change: true 
      });
      
    if (profileError) messages.push('Error upserting profile: ' + profileError.message);
    else messages.push('Successfully UPSERTED profile row for email');
  }

  return NextResponse.json({ result: messages, email, passkey: '000000' });
}
