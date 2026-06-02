'use client'

import { useState } from 'react'
import type { SoldierFormData } from '@/types'

type Props = {
  data: SoldierFormData
  onChange: (updates: Partial<SoldierFormData>) => void
  onNext: () => void
}

const inp = (err?: string) =>
  `w-full border rounded-xl px-3.5 py-2.5 bg-white text-[#0B2818] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent transition text-sm ${
    err ? 'border-red-400 bg-red-50' : 'border-[#d4c9b8]'
  }`

export default function Step1Personal({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.firstName.trim()) e.firstName = 'Required'
    if (!data.lastName.trim()) e.lastName = 'Required'
    if (!data.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Enter a valid email'
    if (!data.phone.trim()) e.phone = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">Tell us about yourself</h2>
      <p className="text-[#888] text-sm mb-7">Fields marked * are required.</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">First Name *</label>
          <input type="text" value={data.firstName} onChange={e => onChange({ firstName: e.target.value })} className={inp(errors.firstName)} placeholder="Yoni" />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">Last Name *</label>
          <input type="text" value={data.lastName} onChange={e => onChange({ lastName: e.target.value })} className={inp(errors.lastName)} placeholder="Cohen" />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Email Address *</label>
        <input type="email" value={data.email} onChange={e => onChange({ email: e.target.value })} className={inp(errors.email)} placeholder="yoni@example.com" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Israeli Phone Number *</label>
        <input type="tel" value={data.phone} onChange={e => onChange({ phone: e.target.value })} className={inp(errors.phone)} placeholder="+972 50 000 0000" />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">
          WhatsApp Number
          <span className="ml-1 font-normal text-[#888]">(if different)</span>
        </label>
        <input type="tel" value={data.whatsappPhone} onChange={e => onChange({ whatsappPhone: e.target.value })} className={inp()} placeholder="+1 212 000 0000" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Date of Birth</label>
        <input type="date" value={data.dateOfBirth} onChange={e => onChange({ dateOfBirth: e.target.value })} className={inp()} />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Country of Origin</label>
        <input type="text" value={data.countryOfOrigin} onChange={e => onChange({ countryOfOrigin: e.target.value })} className={inp()} placeholder="United States" />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => { if (validate()) onNext() }}
          className="bg-[#0F3D2E] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1D9E75] transition-colors flex items-center gap-2"
        >
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
