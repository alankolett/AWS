import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Return a dummy client if env vars are missing so the build doesn't break.
  // The app will use the mock data fallback when credentials aren't provided.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase env vars missing. Falling back to mock data mode.');
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    );
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
