import Link from 'next/link'
import SoldierOnboarding from '@/components/soldier/SoldierOnboarding'

export default function SoldierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7f1] to-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#1D9E75] hover:text-[#178a63] mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1D9E75] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Lone Soldier Registration</h1>
          <p className="text-gray-500 mt-2">
            You&apos;re not alone. Let&apos;s find you a family away from home.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <SoldierOnboarding />
        </div>
      </div>
    </div>
  )
}
