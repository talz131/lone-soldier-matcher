import { createClient } from '@/lib/supabase-server'
import Image from 'next/image'
import PortalFlagForm from './PortalFlagForm'

type MatchedFamily = { contact_name: string; city: string | null }

export default async function PortalPage({ params }: { params: { token: string } }) {
  const supabase = createClient()

  const { data: soldier } = await supabase
    .from('soldiers')
    .select('id, first_name, status, portal_token')
    .eq('portal_token', params.token)
    .single()

  if (!soldier) {
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

  // Fetch family info if the soldier is matched
  let family: MatchedFamily | null = null
  if (soldier.status === 'matched') {
    const { data: match } = await supabase
      .from('matches')
      .select('host_families(contact_name, city)')
      .eq('soldier_id', soldier.id)
      .eq('status', 'active')
      .maybeSingle()
    family = (match?.host_families as unknown as MatchedFamily | null) ?? null
  }

  const isMatched = soldier.status === 'matched' && family !== null

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
          Welcome, {soldier.first_name} 🇮🇱
        </h1>
        <p className="text-sm text-[#888] leading-relaxed">
          You&apos;re not alone — we&apos;re here with you.
        </p>
      </div>

      {/* Status card */}
      {isMatched ? (
        <div className="bg-white rounded-2xl border border-[#c6e8d8] p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-[#e6f7f1] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-lg text-[#0B2818] leading-tight">Your family is waiting for you</p>
              <p className="text-xs text-[#1D9E75] font-medium mt-0.5">Match confirmed</p>
            </div>
          </div>
          <p className="text-sm text-[#555] leading-relaxed mb-3">
            You&apos;ve been matched with the{' '}
            <strong className="text-[#0B2818]">{family!.contact_name}</strong> family
            {family!.city ? (
              <> in <strong className="text-[#0B2818]">{family!.city}</strong></>
            ) : null}.
          </p>
          <p className="text-sm text-[#888] leading-relaxed">
            Our coordinator will be in touch soon to make the introduction and share contact details.
            We can&apos;t wait for you to meet them.
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
              <p className="font-serif text-lg text-[#0B2818] leading-tight">We&apos;re finding the right family for you</p>
              <p className="text-xs text-[#EF9F27] font-medium mt-0.5">In progress</p>
            </div>
          </div>
          <p className="text-sm text-[#555] leading-relaxed">
            Your application has been approved and we&apos;re working on finding you the perfect match.
            We&apos;ll be in touch soon — hang in there. 💙
          </p>
        </div>
      )}

      {/* Spacer + flag form */}
      <div className="flex-1" />
      <div className="mt-10 flex justify-center">
        <PortalFlagForm soldierId={soldier.id} />
      </div>
    </div>
  )
}
