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

export default function Step4Verification({ data, onChange, onSubmit, onBack, loading, error }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [referencePhoneError, setReferencePhoneError] = useState('')

  const handleSubmit = () => {
    if (!data.referencePhone.trim()) {
      setReferencePhoneError('Reference contact number is required')
      return
    }
    setReferencePhoneError('')
    onSubmit()
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Almost there!</h2>
      <p className="text-gray-400 text-sm mb-7">
        Please upload your military ID so we can verify your service. This information is kept strictly private.
      </p>

      <div
        className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#1D9E75] transition-colors mb-6"
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
            <p className="text-sm font-medium text-gray-700">{data.militaryIdFile.name}</p>
            <p className="text-xs text-gray-400">Click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600">Click to upload military ID</p>
            <p className="text-xs text-gray-400">JPG, PNG or PDF, up to 10MB</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
        <strong>Privacy note:</strong> Your military ID is used only for verification and is never shared
        with host families. It is stored securely and accessible only to our admin team.
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Reference contact number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={data.referencePhone}
          onChange={e => { onChange({ referencePhone: e.target.value }); setReferencePhoneError('') }}
          placeholder="+972 50 000 0000"
          className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${referencePhoneError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#1D9E75]'}`}
        />
        {referencePhoneError && <p className="text-red-500 text-xs mt-1">{referencePhoneError}</p>}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="text-gray-400 px-6 py-2.5 rounded-full text-sm font-semibold hover:text-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#1D9E75] text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#178a63] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  )
}
