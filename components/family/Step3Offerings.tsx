'use client'

import type { FamilyFormData } from '@/types'

type Props = {
  data: FamilyFormData
  onChange: (updates: Partial<FamilyFormData>) => void
  onNext: () => void
  onBack: () => void
}

const inp = `w-full border border-[#d4c9b8] rounded-xl px-3.5 py-2.5 bg-white text-[#0B2818] text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent transition`

const HOSTING_OPTIONS = [
  { value: 'shabbat_meals', title: 'Shabbat meals', description: 'The soldier joins us for Friday night dinner and/or lunch', emoji: '🕯️' },
  { value: 'full_shabbat', title: 'Full Shabbat stays', description: 'The soldier sleeps over from Friday to Saturday night', emoji: '🛏️' },
  { value: 'full_time', title: 'Full-time hosting', description: 'The soldier lives with us while they serve', emoji: '🏠' },
]

const OBSERVANCE = [
  { value: 'hiloni', label: 'Hiloni (secular)' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'chabad', label: 'Chabad' },
  { value: 'dati', label: 'Dati (religious)' },
]

export default function Step3Offerings({ data, onChange, onNext, onBack }: Props) {
  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">What you can offer</h2>
      <p className="text-[#888] text-sm mb-7">Choose the option that best describes what your family can provide.</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-3">Hosting type</label>
        <div className="space-y-3">
          {HOSTING_OPTIONS.map(opt => (
            <button key={opt.value} type="button" onClick={() => onChange({ hostingType: opt.value })}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                data.hostingType === opt.value
                  ? 'bg-[#eeedf8] border-[#534AB7]'
                  : 'border-[#d4c9b8] hover:border-[#534AB7]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                data.hostingType === opt.value ? 'border-[#534AB7] bg-[#534AB7]' : 'border-[#d4c9b8]'
              }`}>
                {data.hostingType === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0B2818]">{opt.emoji} {opt.title}</p>
                <p className="text-sm text-[#888] mt-0.5">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">Our family observance level</label>
        <div className="flex flex-wrap gap-2">
          {OBSERVANCE.map(opt => (
            <button key={opt.value} type="button" onClick={() => onChange({ religiousObservance: opt.value })}
              className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                data.religiousObservance === opt.value
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#534AB7]'
              }`}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Pets in the home</label>
        <div className="flex flex-wrap gap-2">
          {['No pets', 'Dog', 'Cat', 'Multiple pets', 'Other'].map(pet => (
            <button key={pet} type="button" onClick={() => onChange({ pets: pet })}
              className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                data.pets === pet
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#534AB7]'
              }`}
            >{pet}</button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Anything else you&apos;d like to share?</label>
        <textarea value={data.additionalNotes} onChange={e => onChange({ additionalNotes: e.target.value })} className={inp} rows={3} placeholder="Tell us a bit about your family, your home, or what you hope to give a soldier..." />
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
