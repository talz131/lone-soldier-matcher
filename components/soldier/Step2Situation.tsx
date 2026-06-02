'use client'

import type { SoldierFormData } from '@/types'

type Props = {
  data: SoldierFormData
  onChange: (updates: Partial<SoldierFormData>) => void
  onNext: () => void
  onBack: () => void
}

const BASES = [
  'Tel HaShomer', 'Bahad 1 (Mitzpe Ramon)', 'Kirya (Tel Aviv)', 'Ramat David',
  'Nevatim', 'Hatzerim', 'Palmachim', 'Sde Dov', 'Julis', 'Michve Alon',
  'Camp Rabin (Petah Tikva)', 'Other',
]

const LANGUAGES = [
  'English', 'French', 'Russian', 'Spanish', 'Amharic', 'Arabic', 'Portuguese', 'Yiddish', 'Other',
]

const inp = `w-full border border-[#d4c9b8] rounded-xl px-3.5 py-2.5 bg-white text-[#0B2818] text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent transition`

const toggleItem = (list: string[], item: string) =>
  list.includes(item) ? list.filter(l => l !== item) : [...list, item]

export default function Step2Situation({ data, onChange, onNext, onBack }: Props) {
  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">Your service situation</h2>
      <p className="text-[#888] text-sm mb-7">Help us understand your life in uniform.</p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Base / Location</label>
        <select value={data.baseLocation} onChange={e => onChange({ baseLocation: e.target.value })} className={inp}>
          <option value="">Select your base...</option>
          {BASES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Unit / Role (optional)</label>
        <input type="text" value={data.unit} onChange={e => onChange({ unit: e.target.value })} className={inp} placeholder="e.g. Golani, Paratroopers, Intelligence..." />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-0.5">Leave frequency</label>
        <p className="text-xs text-[#888] mb-2">How often do you get out of base?</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Daily (יומיות)',
            '11/3',
            '17/4',
            'Every Thursday (חמשושים)',
            'Irregular',
            'Not yet drafted',
          ].map(opt => (
            <button key={opt} type="button" onClick={() => onChange({ serviceType: opt })}
              className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all text-left ${
                data.serviceType === opt
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#1D9E75] hover:text-[#1D9E75]'
              }`}
            >{opt}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#555] mb-2">
          Languages you speak <span className="text-[#888] font-normal">(besides Hebrew)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button key={lang} type="button" onClick={() => onChange({ languages: toggleItem(data.languages, lang) })}
              className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                data.languages.includes(lang)
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#1D9E75]'
              }`}
            >{lang}</button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Hebrew Level</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'none', label: 'None' },
            { value: 'basic', label: 'Basic' },
            { value: 'conversational', label: 'Conversational' },
            { value: 'fluent', label: 'Fluent' },
          ].map(opt => (
            <button key={opt.value} type="button" onClick={() => onChange({ hebrewLevel: opt.value })}
              className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                data.hebrewLevel === opt.value
                  ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white'
                  : 'border-[#d4c9b8] text-[#555] hover:border-[#1D9E75]'
              }`}
            >{opt.label}</button>
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
