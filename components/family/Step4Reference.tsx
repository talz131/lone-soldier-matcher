'use client'

import { useState } from 'react'
import type { FamilyFormData } from '@/types'

type Props = {
  data: FamilyFormData
  onChange: (updates: Partial<FamilyFormData>) => void
  onSubmit: () => void
  onBack: () => void
  loading: boolean
  error: string
}

const inp = (err?: string) =>
  `w-full border rounded-xl px-3.5 py-2.5 bg-white text-[#0B2818] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent transition text-sm ${
    err ? 'border-red-400 bg-red-50' : 'border-[#d4c9b8]'
  }`

export default function Step4Reference({ data, onChange, onSubmit, onBack, loading, error }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValidPhone = (v: string) => /^05\d{8}$/.test(v)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.referenceName.trim()) e.referenceName = 'Required'
    if (!data.referencePhone.trim()) e.referencePhone = 'Required'
    else if (!isValidPhone(data.referencePhone)) e.referencePhone = 'Please enter a valid Israeli mobile number starting with 05'
    if (!data.agreedToTerms) e.terms = 'Please agree to continue'
    if (!data.acknowledgedTerms) e.acknowledgedTerms = 'Please confirm before submitting'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">One last thing — a reference</h2>
      <p className="text-[#888] text-sm mb-7">
        We may reach out to your reference to confirm your application. This helps us keep our soldiers safe.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Reference Full Name *</label>
        <input type="text" value={data.referenceName} onChange={e => onChange({ referenceName: e.target.value })} className={inp(errors.referenceName)} />
        {errors.referenceName && <p className="text-red-500 text-xs mt-1">{errors.referenceName}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Reference Phone *</label>
        <input type="tel" value={data.referencePhone} onChange={e => { onChange({ referencePhone: e.target.value.replace(/\D/g, '') }); setErrors(prev => ({ ...prev, referencePhone: '' })) }} className={inp(errors.referencePhone)} maxLength={10} />
        {errors.referencePhone && <p className="text-red-500 text-xs mt-1">{errors.referencePhone}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Relationship to Your Family</label>
        <input type="text" value={data.referenceRelationship} onChange={e => onChange({ referenceRelationship: e.target.value })} className={inp()} />
      </div>

      {/* Gold divider */}
      <hr className="gold-rule mb-6" />

      <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer mb-8 transition-colors ${
        errors.terms ? 'border-red-400 bg-red-50' : data.agreedToTerms ? 'border-[#534AB7] bg-[#eeedf8]' : 'border-[#d4c9b8]'
      }`}>
        <input type="checkbox" checked={data.agreedToTerms} onChange={e => onChange({ agreedToTerms: e.target.checked })} className="w-4 h-4 mt-0.5 accent-[#534AB7]" />
        <span className="text-sm text-[#555] leading-relaxed">
          I understand that the team may contact my reference to verify my application, and I give
          permission to do so. I confirm that the information I&apos;ve provided is accurate.
        </span>
      </label>
      {errors.terms && <p className="text-red-500 text-xs -mt-6 mb-6">{errors.terms}</p>}

      <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer mb-2 transition-colors ${
        errors.acknowledgedTerms ? 'border-red-400 bg-red-50' : data.acknowledgedTerms ? 'border-[#534AB7] bg-[#eeedf8]' : 'border-[#d4c9b8]'
      }`}>
        <input type="checkbox" checked={data.acknowledgedTerms} onChange={e => { onChange({ acknowledgedTerms: e.target.checked }); setErrors(prev => ({ ...prev, acknowledgedTerms: '' })) }} className="w-4 h-4 mt-0.5 accent-[#534AB7]" />
        <span className="text-sm text-[#555] leading-relaxed">
          I understand that this is a voluntary matching service. The program coordinator will review
          our application before making any match. I confirm that the information I have provided is
          accurate and that we are opening our home voluntarily.
        </span>
      </label>
      {errors.acknowledgedTerms && <p className="text-red-500 text-xs mb-6">{errors.acknowledgedTerms}</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-600">{error}</div>
      )}

      <div className="flex justify-between">
        <button onClick={onBack} disabled={loading} className="text-[#888] px-6 py-2.5 rounded-full text-sm font-semibold hover:text-[#555] transition-colors flex items-center gap-2 disabled:opacity-50">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button onClick={() => { if (validate()) onSubmit() }} disabled={loading} className="bg-[#0F3D2E] text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#534AB7] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}
