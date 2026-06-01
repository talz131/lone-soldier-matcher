'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import StepIndicator from '@/components/StepIndicator'
import Step1Personal from './Step1Personal'
import Step2Situation from './Step2Situation'
import Step3Preferences from './Step3Preferences'
import Step4Verification from './Step4Verification'
import type { SoldierFormData } from '@/types'

const DEFAULT: SoldierFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  whatsappPhone: '',
  dateOfBirth: '',
  countryOfOrigin: '',
  baseLocation: '',
  unit: '',
  serviceType: '',
  languages: [],
  hebrewLevel: '',
  religiousObservance: '',
  familyVibe: [],
  petsOk: true,
  hasDietaryRestrictions: false,
  dietaryDetails: '',
  militaryIdFile: null,
}

const STEPS = ['Personal Info', 'Situation', 'Preferences', 'Verification']

export default function SoldierOnboarding() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SoldierFormData>(DEFAULT)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (updates: Partial<SoldierFormData>) =>
    setData(prev => ({ ...prev, ...updates }))

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      let militaryIdUrl: string | null = null

      if (data.militaryIdFile) {
        const file = data.militaryIdFile
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
        const { data: upload } = await supabase.storage
          .from('military-ids')
          .upload(fileName, file)
        if (upload) militaryIdUrl = upload.path
      }

      const { error: dbError } = await supabase.from('soldiers').insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        whatsapp_phone: data.whatsappPhone || null,
        date_of_birth: data.dateOfBirth || null,
        country_of_origin: data.countryOfOrigin || null,
        base_location: data.baseLocation || null,
        unit: data.unit || null,
        service_type: data.serviceType || null,
        languages: data.languages,
        hebrew_level: data.hebrewLevel || null,
        religious_observance: data.religiousObservance || null,
        family_vibe: data.familyVibe,
        pets_ok: data.petsOk,
        has_dietary_restrictions: data.hasDietaryRestrictions,
        dietary_details: data.dietaryDetails || null,
        military_id_url: militaryIdUrl,
      })

      if (dbError) throw dbError
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-[#e6f7f1] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Application received!</h3>
        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
          Thank you for registering. Our team will review your application and reach out within
          3–5 business days. You&apos;re not alone — we&apos;ve got you.
        </p>
      </div>
    )
  }

  return (
    <>
      <StepIndicator currentStep={step} totalSteps={4} steps={STEPS} color="#1D9E75" />

      {step === 1 && <Step1Personal data={data} onChange={update} onNext={() => setStep(2)} />}
      {step === 2 && <Step2Situation data={data} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <Step3Preferences data={data} onChange={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <Step4Verification data={data} onChange={update} onSubmit={handleSubmit} onBack={() => setStep(3)} loading={loading} error={error} />}
    </>
  )
}
