'use client'

import { useState } from 'react'
import type { SoldierFormData } from '@/types'

type Props = {
  data: SoldierFormData
  onChange: (updates: Partial<SoldierFormData>) => void
  onSubmit: () => void
  onBack: () => void
  loading: boolean
  error: string
}

const inp = (err?: string) =>
  `w-full border rounded-xl px-3.5 py-2.5 bg-white text-[#0B2818] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent transition text-sm ${
    err ? 'border-red-400 bg-red-50' : 'border-[#d4c9b8]'
  }`

export default function Step4Verification({ data, onChange, onSubmit, onBack, loading, error }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.referenceName.trim())  e.referenceName  = 'Required'
    if (!data.referencePhone.trim()) e.referencePhone = 'Required'
    else if (data.referencePhone.replace(/\D/g, '').length < 6) e.referencePhone = 'Enter a valid phone number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const COUNTRY_CODES = [
    { code: '+972', label: '🇮🇱 +972' },
    { code: '+1',   label: '🇺🇸 +1' },
    { code: '+44',  label: '🇬🇧 +44' },
    { code: '+33',  label: '🇫🇷 +33' },
    { code: '+7',   label: '🇷🇺 +7' },
    { code: '+61',  label: '🇦🇺 +61' },
    { code: '+27',  label: '🇿🇦 +27' },
    { code: '+54',  label: '🇦🇷 +54' },
    { code: '+55',  label: '🇧🇷 +55' },
    { code: '+49',  label: '🇩🇪 +49' },
    { code: '+34',  label: '🇪🇸 +34' },
    { code: '+39',  label: '🇮🇹 +39' },
  ]

  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">Reference &amp; Verification</h2>
      <p className="text-[#888] text-sm mb-7">
        Almost done! Please provide a reference who can vouch for you.
      </p>

      {/* ── Reference section ────────────────────────────────────────────────── */}
      <h3 className="font-serif text-base text-[#0B2818] mb-1">Your reference</h3>
      <p className="text-[#888] text-sm mb-5">
        We may reach out to your reference to confirm your application.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Reference Full Name *</label>
        <input
          type="text"
          value={data.referenceName}
          onChange={e => { onChange({ referenceName: e.target.value }); setErrors(prev => ({ ...prev, referenceName: '' })) }}
          className={inp(errors.referenceName)}
        />
        {errors.referenceName && <p className="text-red-500 text-xs mt-1">{errors.referenceName}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Reference Phone Number *</label>
        <div className="flex gap-2">
          <select
            value={data.referenceCountryCode}
            onChange={e => onChange({ referenceCountryCode: e.target.value })}
            className="border border-[#d4c9b8] rounded-xl px-2 py-2.5 bg-white text-[#0B2818] text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent transition shrink-0"
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
          <input
            type="tel"
            value={data.referencePhone}
            onChange={e => { onChange({ referencePhone: e.target.value.replace(/\D/g, '') }); setErrors(prev => ({ ...prev, referencePhone: '' })) }}
            className={`flex-1 ${inp(errors.referencePhone)}`}
          />
        </div>
        {errors.referencePhone && <p className="text-red-500 text-xs mt-1">{errors.referencePhone}</p>}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-[#555] mb-1.5">
          Relationship to You
          <span className="ml-1 font-normal text-[#888]">(optional)</span>
        </label>
        <input
          type="text"
          value={data.referenceRelationship}
          onChange={e => onChange({ referenceRelationship: e.target.value })}
          className={inp()}
          placeholder=""
        />
      </div>

      {/* Family-member restriction note */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
        <span className="text-lg leading-none mt-px shrink-0">⚠</span>
        <p>
          <strong>Your reference cannot be a family member</strong> — we need someone who can vouch
          for you independently.
        </p>
      </div>

      <hr className="gold-rule mt-6 mb-6" />

      {/* ── Optional extra notes ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#555] mb-1.5">
          Anything else you&apos;d like us to know?
          <span className="ml-1 font-normal text-[#888]">(optional)</span>
        </label>
        <textarea
          value={data.additionalNotes}
          onChange={e => onChange({ additionalNotes: e.target.value })}
          className={inp()}
          rows={3}
          placeholder=""
          style={{ resize: 'vertical' }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-600">{error}</div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="text-[#888] px-6 py-2.5 rounded-full text-sm font-semibold hover:text-[#555] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={() => { if (validate()) onSubmit() }}
          disabled={loading}
          className="bg-[#0F3D2E] text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1D9E75] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
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
