import Link from 'next/link'
import Image from 'next/image'
import SoldierOnboarding from '@/components/soldier/SoldierOnboarding'

export default function SoldierPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      {/* Nav */}
      <nav className="bg-[#0F3D2E]">
        <div className="page-shell px-5 py-3.5 flex items-center gap-3">
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors mr-1"
            aria-label="Back"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-full shrink-0" loading="lazy" />
          <span className="text-white text-sm font-semibold">Lone Soldier Matcher</span>
        </div>
      </nav>
      <hr className="gold-rule" />

      <div className="page-shell px-4 py-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#0F3D2E] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-[#0B2818]">Lone Soldier Registration</h1>
          <p className="text-[#888] text-sm mt-1">You&apos;re not alone. Let&apos;s find you a family away from home.</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e8e0d4] p-6">
          <SoldierOnboarding />
        </div>
      </div>
    </div>
  )
}
