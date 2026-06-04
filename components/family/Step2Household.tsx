'use client'

import type { FamilyFormData } from '@/types'

type Props = {
  data: FamilyFormData
  onChange: (updates: Partial<FamilyFormData>) => void
  onNext: () => void
  onBack: () => void
}

const LANGUAGES = [
  'English', 'Hebrew', 'French', 'Spanish', 'Russian', 'Arabic', 'Amharic', 'Yiddish', 'Portuguese', 'Other',
]

const toggleItem = (list: string[], item: string) =>
  list.includes(item) ? list.filter(l => l !== item) : [...list, item]

const inp = `w-full border border-[#d4c9b8] rounded-xl px-3.5 py-2.5 bg-white text-[#0B2818] text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent transition`

export default function Step2Household({ data, onChange, onNext, onBack }: Props) {
  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">Your household</h2>
      <p className="text-[#888] text-sm mb-7">Help us understand your home so we can find the right match.</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">How many people live in your home?</label>
        <div className="flex gap-2">
          {['1', '2', '3', '4', '5', '6+'].map(n => (
            <button key={n} type="button" onClick={() => onChange({ familySize: n })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                data.familySize === n
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#534AB7]'
              }`}
            >{n}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">Do you have children at home?</label>
        <div className="flex gap-3 mb-3">
          {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map(opt => (
            <button key={String(opt.value)} type="button" onClick={() => onChange({ hasChildren: opt.value })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                data.hasChildren === opt.value
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#534AB7]'
              }`}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">Type of home</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'house', label: 'House' },
            { value: 'apartment', label: 'Apartment' },
            { value: 'other', label: 'Other' },
          ].map(opt => (
            <button key={opt.value} type="button" onClick={() => onChange({ livingSituation: opt.value })}
              className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                data.livingSituation === opt.value
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#534AB7]'
              }`}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">Soldier gender preference</label>
        <div className="flex gap-2">
          {[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'no_preference', label: 'No preference' },
          ].map(opt => (
            <button key={opt.value} type="button" onClick={() => onChange({ soldierGenderPreference: opt.value })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                data.soldierGenderPreference === opt.value
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#534AB7]'
              }`}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">
          Languages spoken at home
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button key={lang} type="button" onClick={() => onChange({ languages: toggleItem(data.languages, lang) })}
              className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                data.languages.includes(lang)
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#534AB7]'
              }`}
            >{lang}</button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="text-[#888] px-6 py-2.5 rounded-full text-sm font-semibold hover:text-[#555] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button onClick={onNext} className="bg-[#0F3D2E] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#534AB7] transition-colors flex items-center gap-2">
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
