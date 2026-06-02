'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import StepIndicator from '@/components/StepIndicator'
import Step1Personal from './Step1Personal'
import Step2Situation from './Step2Situation'
import Step3Preferences from './Step3Preferences'
import Step4Verification from './Step4Verification'
import type { SoldierFormData } from '@/types'

// ─── Draft persistence ────────────────────────────────────────────────────────

const DRAFT_KEY = 'lsm_soldier_draft'

// File objects can't be JSON-serialised, so we always store militaryIdFile as null.
type SerializableData = Omit<SoldierFormData, 'militaryIdFile'> & { militaryIdFile: null }
type Draft = { step: number; data: SerializableData }

function saveDraft(step: number, data: SoldierFormData) {
  try {
    const payload: Draft = { step, data: { ...data, militaryIdFile: null } }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
  } catch { /* quota errors, private browsing, etc. */ }
}

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
}

function hasMeaningfulProgress(draft: Draft): boolean {
  return draft.step > 1 || !!(draft.data.firstName || draft.data.email)
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT: SoldierFormData = {
  firstName: '',
  lastName: '',
  gender: '',
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
  referencePhone: '',
  militaryIdFile: null,
}

const STEPS = ['Personal Info', 'Situation', 'Preferences', 'Verification']

// ─── Component ────────────────────────────────────────────────────────────────

export default function SoldierOnboarding() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SoldierFormData>(DEFAULT)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasDraft, setHasDraft] = useState(false)
  // hydrated prevents writing blank defaults back before the draft is loaded
  const [hydrated, setHydrated] = useState(false)

  // On mount: restore saved draft (runs client-side only — localStorage is unavailable on the server)
  useEffect(() => {
    const draft = loadDraft()
    if (draft && hasMeaningfulProgress(draft)) {
      setData({ ...draft.data, militaryIdFile: null })
      setStep(draft.step)
      setHasDraft(true)
    }
    setHydrated(true)
  }, [])

  // Auto-save whenever data or step change, but only after the draft has been loaded
  useEffect(() => {
    if (!hydrated) return
    saveDraft(step, data)
  }, [data, step, hydrated])

  const update = (updates: Partial<SoldierFormData>) =>
    setData(prev => ({ ...prev, ...updates }))

  const startFresh = () => {
    clearDraft()
    setData(DEFAULT)
    setStep(1)
    setHasDraft(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      let militaryIdUrl: string | null = null

      if (data.militaryIdFile) {
        const file = data.militaryIdFile
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
        const { data: upload, error: uploadError } = await supabase.storage
          .from('military-ids')
          .upload(fileName, file)
        if (uploadError) throw uploadError
        if (upload) militaryIdUrl = upload.path
      }

      const { error: dbError } = await supabase.from('soldiers').insert({
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender || null,
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
        reference_phone: data.referencePhone || null,
      })

      if (dbError) throw dbError
      clearDraft()
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
        <h3 className="font-serif text-2xl text-[#0B2818] mb-3">Application received!</h3>
        <p className="text-[#555] max-w-sm mx-auto leading-relaxed">
          Thank you for registering. Our team will review your application and reach out within
          3–5 business days. You&apos;re not alone — we&apos;ve got you.
        </p>
      </div>
    )
  }

  return (
    <>
      {hasDraft && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#c6e8d8] bg-[#edf7f2] px-4 py-3 text-sm">
          <span className="text-[#0F3D2E]">↩ Continuing where you left off</span>
          <button
            onClick={startFresh}
            className="shrink-0 text-xs text-[#1D9E75] underline hover:text-[#0F3D2E] transition-colors"
          >
            Start fresh
          </button>
        </div>
      )}
      <StepIndicator currentStep={step} totalSteps={4} steps={STEPS} color="#1D9E75" />
      {step === 1 && <Step1Personal data={data} onChange={update} onNext={() => setStep(2)} />}
      {step === 2 && <Step2Situation data={data} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <Step3Preferences data={data} onChange={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <Step4Verification data={data} onChange={update} onSubmit={handleSubmit} onBack={() => setStep(3)} loading={loading} error={error} />}
    </>
  )
}
