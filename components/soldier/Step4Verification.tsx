'use client'

import { useRef, useState } from 'react'
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
  const fileRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValidPhone = (v: string) => /^05\d{8}$/.test(v)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.referenceName.trim())  e.referenceName  = 'Required'
    if (!data.referencePhone.trim()) e.referencePhone = 'Required'
    else if (!isValidPhone(data.referencePhone)) e.referencePhone = 'Please enter a valid Israeli mobile number starting with 05'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">Reference &amp; Verification</h2>
      <p className="text-[#888] text-sm mb-7">
        Almost done! Please upload your military ID and provide a reference who can vouch for you.
      </p>

      {/* ── Military ID upload ───────────────────────────────────────────────── */}
      <div
        className="border-2 border-dashed border-[#d4c9b8] rounded-2xl p-8 text-center cursor-pointer hover:border-[#EF9F27] transition-colors mb-4"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={e => onChange({ militaryIdFile: e.target.files?.[0] ?? null })}
        />
        {data.militaryIdFile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-[#e6f7f1] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#0B2818]">{data.militaryIdFile.name}</p>
            <p className="text-xs text-[#888]">Click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-[#F9F6F0] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#555]">Click to upload military ID</p>
            <p className="text-xs text-[#888]">JPG, PNG or PDF, up to 10MB</p>
          </div>
        )}
      </div>

      {/* Privacy note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
        <strong>Privacy note:</strong> Your military ID is used only for verification and is never shared
        with host families. It is stored securely and accessible only to our admin team.
      </div>

      <hr className="gold-rule mb-6" />

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
        <input
          type="tel"
          value={data.referencePhone}
          onChange={e => { onChange({ referencePhone: e.target.value.replace(/\D/g, '') }); setErrors(prev => ({ ...prev, referencePhone: '' })) }}
          className={inp(errors.referencePhone)}
          maxLength={10}
        />
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
