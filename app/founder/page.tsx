import React from 'react';
import { FounderStory } from '@/components/features/FounderStory';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function FounderPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: settings } = await supabase.from('site_settings').select('*');
  let founderName = "Founder Name";
  let founderRole = "Founder / Captain";
  let founderQuote = "Cloud architectures shape the future. Let's build it.";
  let avatarUrl = "";
  let bio = "";
  let builderId = "";
  let githubUrl = "";
  let linkedinUrl = "";
  let portfolioUrl = "";
  let headline = "";
  let division = "";
  let branch = "";
  let year = "";
  let certifications: any[] = [];
  let badges: any[] = [];

  const founderSetting = settings?.find(s => s.key === 'founder_section')?.value;
  const pinnedFounderId = settings?.find(s => s.key === 'pinned_founder_id')?.value;

  if (pinnedFounderId && typeof pinnedFounderId === 'string' && pinnedFounderId.trim()) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', pinnedFounderId)
      .single();

    if (profile) {
      founderName = profile.full_name || founderName;
      founderRole = profile.headline || (profile.role === 'admin' ? 'Founder & Lead' : 'Core Member');
      avatarUrl = profile.avatar_url || '';
      bio = profile.bio || '';
      builderId = profile.builder_id || '';
      githubUrl = profile.github_url || '';
      linkedinUrl = profile.linkedin_url || '';
      portfolioUrl = profile.portfolio_url || '';
      headline = profile.headline || '';
      division = profile.division || '';
      branch = profile.branch || '';
      year = profile.year || '';
      certifications = profile.certifications || [];
      badges = profile.badges || [];
      if (profile.quote) founderQuote = profile.quote;
    }
  }

  // Admin overrides from CMS
  if (founderSetting) {
    if (founderSetting.name) founderName = founderSetting.name;
    if (founderSetting.role) founderRole = founderSetting.role;
    if (founderSetting.quote) founderQuote = founderSetting.quote;
    if (founderSetting.bio && typeof founderSetting.bio === 'string' && founderSetting.bio.trim()) {
      bio = founderSetting.bio.trim();
    }
  }

  return (
    <div className="flex flex-col w-full">
      <FounderStory
        name={founderName}
        role={founderRole}
        quote={founderQuote}
        avatarUrl={avatarUrl}
        bio={bio}
        builderId={builderId}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        portfolioUrl={portfolioUrl}
        headline={headline}
        division={division}
        branch={branch}
        year={year}
        certifications={certifications}
        badges={badges}
        timeline={founderSetting?.timeline}
      />
    </div>
  );
}
