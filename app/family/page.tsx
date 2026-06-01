import Link from 'next/link'
import FamilyOnboarding from '@/components/family/FamilyOnboarding'

export default function FamilyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eeedf8] to-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#534AB7] hover:text-[#4339a0] mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#534AB7] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Host Family Registration</h1>
          <p className="text-gray-500 mt-2">
            Thank you for opening your heart and home.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <FamilyOnboarding />
        </div>
      </div>
    </div>
  )
}
