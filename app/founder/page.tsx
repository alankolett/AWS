import React from 'react';
import { FounderStory } from '@/components/features/FounderStory';
import { CoLeadSection } from '@/components/features/CoLeadSection';
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
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: settings } = await supabase.from('site_settings').select('*');

  // Chapter Lead Data
  let founderName = 'Founder Name';
  let founderRole = 'Founder / Chapter Captain';
  let founderQuote = "Cloud architectures shape the future. Let's build it.";
  let avatarUrl = '';
  let bio = '';
  let builderId = '';
  let githubUrl = '';
  let linkedinUrl = '';
  let portfolioUrl = '';
  let headline = '';
  let division = '';
  let branch = '';
  let year = '';
  let certifications: any[] = [];
  let badges: any[] = [];

  const founderSetting = settings?.find((s) => s.key === 'founder_section')?.value;
  const pinnedFounderId = settings?.find((s) => s.key === 'pinned_founder_id')?.value;

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

  // Chapter Lead Admin overrides from CMS
  if (founderSetting) {
    if (founderSetting.name) founderName = founderSetting.name;
    if (founderSetting.role) founderRole = founderSetting.role;
    if (founderSetting.quote) founderQuote = founderSetting.quote;
    if (founderSetting.bio && typeof founderSetting.bio === 'string' && founderSetting.bio.trim()) {
      bio = founderSetting.bio.trim();
    }
  }

  // Co-Chapter Lead Data (Requirement 5)
  let coLeadName = '';
  let coLeadRole = 'Co-Chapter Lead';
  let coLeadQuote = '';
  let coLeadAvatarUrl = '';
  let coLeadBio = '';
  let coLeadBuilderId = '';
  let coLeadGithub = '';
  let coLeadLinkedin = '';
  let coLeadPortfolio = '';
  let coLeadHeadline = '';
  let coLeadDivision = '';
  let coLeadBranch = '';
  let coLeadYear = '';
  let coLeadCerts: any[] = [];
  let coLeadBadges: any[] = [];

  const pinnedCoLeadId = settings?.find((s) => s.key === 'pinned_co_lead_id')?.value;
  const coLeadSetting = settings?.find((s) => s.key === 'co_lead_section')?.value;

  if (pinnedCoLeadId && typeof pinnedCoLeadId === 'string' && pinnedCoLeadId.trim()) {
    const { data: coProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', pinnedCoLeadId)
      .single();

    if (coProfile) {
      coLeadName = coProfile.full_name || coProfile.email?.split('@')[0] || 'Co-Chapter Lead';
      coLeadRole = coProfile.headline || 'Co-Chapter Lead & Technical Architect';
      coLeadAvatarUrl = coProfile.avatar_url || '';
      coLeadBio = coProfile.bio || '';
      coLeadBuilderId = coProfile.builder_id || '';
      coLeadGithub = coProfile.github_url || '';
      coLeadLinkedin = coProfile.linkedin_url || '';
      coLeadPortfolio = coProfile.portfolio_url || '';
      coLeadHeadline = coProfile.headline || '';
      coLeadDivision = coProfile.division || '';
      coLeadBranch = coProfile.branch || '';
      coLeadYear = coProfile.year || '';
      coLeadCerts = coProfile.certifications || [];
      coLeadBadges = coProfile.badges || [];
      if (coProfile.quote) coLeadQuote = coProfile.quote;
    }
  }

  // Co-Lead Admin overrides
  if (coLeadSetting) {
    if (coLeadSetting.role) coLeadRole = coLeadSetting.role;
    if (coLeadSetting.quote) coLeadQuote = coLeadSetting.quote;
    if (coLeadSetting.bio && typeof coLeadSetting.bio === 'string' && coLeadSetting.bio.trim()) {
      coLeadBio = coLeadSetting.bio.trim();
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Chapter Lead / Founder Story with Narrative Timeline */}
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

      {/* 2. Co-Chapter Lead Section (Rendered below Chapter Lead) */}
      {coLeadName ? (
        <CoLeadSection
          name={coLeadName}
          role={coLeadRole}
          quote={coLeadQuote}
          avatarUrl={coLeadAvatarUrl}
          bio={coLeadBio}
          builderId={coLeadBuilderId}
          githubUrl={coLeadGithub}
          linkedinUrl={coLeadLinkedin}
          portfolioUrl={coLeadPortfolio}
          headline={coLeadHeadline}
          division={coLeadDivision}
          branch={coLeadBranch}
          year={coLeadYear}
          certifications={coLeadCerts}
          badges={coLeadBadges}
        />
      ) : null}
    </div>
  );
}
