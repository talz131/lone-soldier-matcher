'use client'

import { useState } from 'react'
import type { FamilyFormData } from '@/types'

type Props = {
  data: FamilyFormData
  onChange: (updates: Partial<FamilyFormData>) => void
  onNext: () => void
}

const inp = (err?: string) =>
  `w-full border rounded-xl px-3.5 py-2.5 bg-white text-[#0B2818] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent transition text-sm ${
    err ? 'border-red-400 bg-red-50' : 'border-[#d4c9b8]'
  }`

export default function Step1Contact({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValidPhone = (v: string) => /^05\d{8}$/.test(v)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.contactName.trim()) e.contactName = 'Required'
    if (!data.idNumber.trim()) e.idNumber = 'Required'
    else if (!/^\d+$/.test(data.idNumber)) e.idNumber = 'Numbers only'
    if (!data.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Enter a valid email'
    if (!data.phone.trim()) e.phone = 'Required'
    else if (!isValidPhone(data.phone)) e.phone = 'Please enter a valid Israeli mobile number starting with 05'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-[#0B2818] mb-1">Contact information</h2>
      <p className="text-[#888] text-sm mb-7">How can we reach you? Fields marked * are required.</p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Full Name *</label>
        <input type="text" value={data.contactName} onChange={e => onChange({ contactName: e.target.value })} className={inp(errors.contactName)} />
        {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">ID Number (Teudat Zehut or Passport) *</label>
        <input type="text" inputMode="numeric" value={data.idNumber} onChange={e => { onChange({ idNumber: e.target.value.replace(/\D/g, '') }); setErrors(prev => ({ ...prev, idNumber: '' })) }} className={inp(errors.idNumber)} />
        {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Email Address *</label>
        <input type="email" value={data.email} onChange={e => onChange({ email: e.target.value })} className={inp(errors.email)} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#555] mb-1.5">Phone Number *</label>
        <input type="tel" value={data.phone} onChange={e => { onChange({ phone: e.target.value.replace(/\D/g, '') }); setErrors(prev => ({ ...prev, phone: '' })) }} className={inp(errors.phone)} maxLength={10} />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">City *</label>
          <input type="text" value={data.city} onChange={e => onChange({ city: e.target.value })} className={inp()} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">Neighborhood</label>
          <input type="text" value={data.neighborhood} onChange={e => onChange({ neighborhood: e.target.value })} className={inp()} />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => { if (validate()) onNext() }}
          className="bg-[#0F3D2E] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#534AB7] transition-colors flex items-center gap-2"
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
