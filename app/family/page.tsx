import Link from 'next/link'
import Image from 'next/image'
import FamilyOnboarding from '@/components/family/FamilyOnboarding'

export default function FamilyPage() {
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
            <svg className="w-6 h-6 text-[#534AB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-[#0B2818]">Host Family Registration</h1>
          <p className="text-[#888] text-sm mt-1">Thank you for opening your heart and home.</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e8e0d4] p-6">
          <FamilyOnboarding />
        </div>
      </div>
    </div>
  )
}
