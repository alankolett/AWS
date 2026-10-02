'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/infrastructure/supabase/client';

export default function OpsConsoleIndex() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function redirectRole() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/ops/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin') {
        router.replace('/ops/console/home');
      } else {
        router.replace('/ops/console/my-profile');
      }
    }
    redirectRole();
  }, [router, supabase]);

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="font-mono text-xs text-[#ff9900] animate-pulse">
        Directing to Console Dashboard...
      </div>
    </div>
  );
}
