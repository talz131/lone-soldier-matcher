'use client'

import type { SoldierFormData } from '@/types'

type Props = {
  data: SoldierFormData
  onChange: (updates: Partial<SoldierFormData>) => void
  onNext: () => void
  onBack: () => void
}

const VIBES = [
  { value: 'quiet', label: 'Quiet & peaceful' },
  { value: 'lively', label: 'Lively & social' },
  { value: 'young_kids', label: 'Young children at home' },
  { value: 'teens', label: 'Teenagers' },
  { value: 'empty_nest', label: 'Empty nesters' },
  { value: 'outdoor', label: 'Outdoorsy' },
]

const OBSERVANCE = [
  { value: 'hiloni', label: 'Hiloni' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'dati_leumi', label: 'Dati Leumi' },
  { value: 'haredi', label: 'Haredi' },
  { value: 'chabad', label: 'Chabad' },
  { value: 'no_preference', label: 'No preference' },
]

const toggleItem = (list: string[], item: string) =>
  list.includes(item) ? list.filter(l => l !== item) : [...list, item]

const inp = `w-full border border-[#d4c9b8] rounded-xl px-3.5 py-2.5 bg-white text-[#0B2818] text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent transition`

export default function Step3Preferences({ data, onChange, onNext, onBack }: Props) {
  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">Family preferences</h2>
      <p className="text-[#888] text-sm mb-7">
        Tell us what kind of home environment would feel right for you. There are no wrong answers.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">Religious preferences</label>
        <div className="flex flex-wrap gap-2">
          {OBSERVANCE.map(opt => (
            <button key={opt.value} type="button" onClick={() => onChange({ religiousObservance: opt.value })}
              className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                data.religiousObservance === opt.value
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#1D9E75]'
              }`}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">
          Family vibe <span className="text-[#888] font-normal">(choose all that appeal to you)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VIBES.map(opt => (
            <button key={opt.value} type="button" onClick={() => onChange({ familyVibe: toggleItem(data.familyVibe, opt.value) })}
              className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                data.familyVibe.includes(opt.value)
                  ? 'bg-[#e6f7f1] border-[#1D9E75] text-[#0F3D2E]'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#1D9E75]'
              }`}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">Are you comfortable with pets in the home?</label>
        <div className="flex gap-3">
          {[
            { value: true, label: 'Yes, no problem!' },
            { value: false, label: 'Prefer no pets' },
          ].map(opt => (
            <button key={String(opt.value)} type="button" onClick={() => onChange({ petsOk: opt.value })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                data.petsOk === opt.value
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#1D9E75]'
              }`}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-[#555] mb-2">Do you have dietary restrictions or needs?</label>
        <div className="flex gap-3 mb-3">
          {[
            { value: false, label: 'No restrictions' },
            { value: true, label: 'Yes, I do' },
          ].map(opt => (
            <button key={String(opt.value)} type="button" onClick={() => onChange({ hasDietaryRestrictions: opt.value })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                data.hasDietaryRestrictions === opt.value
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#1D9E75]'
              }`}
            >{opt.label}</button>
          ))}
        </div>
        {data.hasDietaryRestrictions && (
          <textarea value={data.dietaryDetails} onChange={e => onChange({ dietaryDetails: e.target.value })} className={inp} rows={2} placeholder="e.g. kosher, vegetarian, allergic to nuts..." />
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="text-[#888] px-6 py-2.5 rounded-full text-sm font-semibold hover:text-[#555] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button onClick={onNext} className="bg-[#0F3D2E] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1D9E75] transition-colors flex items-center gap-2">
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
