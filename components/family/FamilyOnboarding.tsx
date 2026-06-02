'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import StepIndicator from '@/components/StepIndicator'
import Step1Contact from './Step1Contact'
import Step2Household from './Step2Household'
import Step3Offerings from './Step3Offerings'
import Step4Reference from './Step4Reference'
import type { FamilyFormData } from '@/types'

// ─── Draft persistence ────────────────────────────────────────────────────────

const DRAFT_KEY = 'lsm_family_draft'

// FamilyFormData contains only primitives/arrays — fully JSON-serialisable.
type Draft = { step: number; data: FamilyFormData }

function saveDraft(step: number, data: FamilyFormData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, data }))
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
  return draft.step > 1 || !!(draft.data.contactName || draft.data.email)
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT: FamilyFormData = {
  contactName: '',
  email: '',
  phone: '',
  city: '',
  neighborhood: '',
  familySize: '',
  hasChildren: false,
  childrenAges: '',
  livingSituation: '',
  availableSpace: '',
  hostingType: '',
  religiousObservance: '',
  soldierGenderPreference: '',
  pets: '',
  additionalNotes: '',
  referenceName: '',
  referencePhone: '',
  referenceRelationship: '',
  agreedToTerms: false,
}

const STEPS = ['Contact Info', 'Household', 'Offerings', 'Reference']

// ─── Component ────────────────────────────────────────────────────────────────

export default function FamilyOnboarding() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FamilyFormData>(DEFAULT)
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
      setData(draft.data)
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

  const update = (updates: Partial<FamilyFormData>) =>
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

      const { error: dbError } = await supabase.from('host_families').insert({
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone || null,
        city: data.city || null,
        neighborhood: data.neighborhood || null,
        family_size: data.familySize ? parseInt(data.familySize) : null,
        has_children: data.hasChildren,
        children_ages: data.childrenAges || null,
        living_situation: data.livingSituation || null,
        available_space: data.hostingType || null,
        religious_observance: data.religiousObservance || null,
        soldier_gender_preference: data.soldierGenderPreference || null,
        pets: data.pets || null,
        additional_notes: data.additionalNotes || null,
        reference_name: data.referenceName || null,
        reference_phone: data.referencePhone || null,
        reference_relationship: data.referenceRelationship || null,
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
        <div className="w-16 h-16 bg-[#eeedf8] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-[#534AB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-[#0B2818] mb-3">Application received!</h3>
        <p className="text-[#555] max-w-sm mx-auto leading-relaxed">
          Thank you for opening your heart and home. We&apos;ll review your application and be in
          touch soon. Your generosity means the world to these soldiers.
        </p>
      </div>
    )
  }

  return (
    <>
      {hasDraft && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#c8c5e8] bg-[#f0effe] px-4 py-3 text-sm">
          <span className="text-[#2d2780]">↩ Continuing where you left off</span>
          <button
            onClick={startFresh}
            className="shrink-0 text-xs text-[#534AB7] underline hover:text-[#2d2780] transition-colors"
          >
            Start fresh
          </button>
        </div>
      )}
      <StepIndicator currentStep={step} totalSteps={4} steps={STEPS} color="#534AB7" />
      {step === 1 && <Step1Contact data={data} onChange={update} onNext={() => setStep(2)} />}
      {step === 2 && <Step2Household data={data} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <Step3Offerings data={data} onChange={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <Step4Reference data={data} onChange={update} onSubmit={handleSubmit} onBack={() => setStep(3)} loading={loading} error={error} />}
    </>
  )
}
