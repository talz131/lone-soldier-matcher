import { createClient } from '@/lib/supabase-server'
import Image from 'next/image'
import FamilyPortalFlagForm from './FamilyPortalFlagForm'

type MatchedSoldier = { first_name: string; country_of_origin: string | null; base_location: string | null }

export default async function FamilyPortalPage({ params }: { params: { token: string } }) {
  const supabase = createClient()

  const { data: family } = await supabase
    .from('host_families')
    .select('id, contact_name, status, portal_token')
    .eq('portal_token', params.token)
    .single()

  if (!family) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-2xl mb-3">🔒</p>
          <p className="font-serif text-lg text-[#0B2818] mb-2">Link not found</p>
          <p className="text-sm text-[#888]">This link may have expired or is not valid.</p>
        </div>
      </div>
    )
  }

  // Fetch soldier info if the family is matched
  let soldier: MatchedSoldier | null = null
  if (family.status === 'matched') {
    const { data: match } = await supabase
      .from('matches')
      .select('soldiers(first_name, country_of_origin, base_location)')
      .eq('family_id', family.id)
      .eq('status', 'active')
      .maybeSingle()
    soldier = (match?.soldiers as unknown as MatchedSoldier | null) ?? null
  }

  const isMatched = family.status === 'matched' && soldier !== null

  // Get first name (first word of contact_name)
  const firstName = family.contact_name.split(' ')[0]

  return (
    <div className="min-h-screen px-5 py-8 flex flex-col">

      {/* Header */}
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.png"
          alt="Lone Soldier Matcher"
          width={72}
          height={72}
          className="rounded-full shadow-sm"
          priority
        />
      </div>

      <hr className="gold-rule mb-6" />

      {/* Welcome */}
      <div className="text-center mb-7">
        <h1 className="font-serif text-2xl text-[#0B2818] mb-2">
          Welcome, {firstName} 🏠
        </h1>
        <p className="text-sm text-[#888] leading-relaxed">
          Thank you for opening your home. It means everything.
        </p>
      </div>

      {/* Status card */}
      {isMatched ? (
        <div className="bg-white rounded-2xl border border-[#c6e8d8] p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-[#e6f7f1] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-lg text-[#0B2818] leading-tight">Your soldier is on the way</p>
              <p className="text-xs text-[#1D9E75] font-medium mt-0.5">Match confirmed</p>
            </div>
          </div>
          <p className="text-sm text-[#555] leading-relaxed mb-3">
            You&apos;ve been matched with{' '}
            <strong className="text-[#0B2818]">{soldier!.first_name}</strong>
            {soldier!.country_of_origin ? (
              <>, originally from <strong className="text-[#0B2818]">{soldier!.country_of_origin}</strong></>
            ) : null}
            {soldier!.base_location ? (
              <>, currently based near <strong className="text-[#0B2818]">{soldier!.base_location}</strong></>
            ) : null}.
          </p>
          <p className="text-sm text-[#888] leading-relaxed">
            Our coordinator will be in touch soon to make the introduction. Your warmth and generosity
            will make a real difference to this soldier. 🇮🇱
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e8e0d4] p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-[#fef9ec] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#EF9F27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-lg text-[#0B2818] leading-tight">We&apos;re finding the right soldier for you</p>
              <p className="text-xs text-[#EF9F27] font-medium mt-0.5">In progress</p>
            </div>
          </div>
          <p className="text-sm text-[#555] leading-relaxed">
            Your application has been approved and we&apos;re working on finding you the perfect match.
            We&apos;ll be in touch soon — thank you for your patience and your generous heart. 💙
          </p>
        </div>
      )}

      {/* Spacer + flag form */}
      <div className="flex-1" />
      <div className="mt-10 flex justify-center">
        <FamilyPortalFlagForm familyId={family.id} />
      </div>
    </div>
  )
}
