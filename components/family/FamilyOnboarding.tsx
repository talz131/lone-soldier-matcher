'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  languages: [],
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
  // Debounce ref: localStorage writes are synchronous I/O — batch them
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Debounced auto-save: waits 600ms after the last change before writing to localStorage
  useEffect(() => {
    if (!hydrated) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveDraft(step, data), 600)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [data, step, hydrated])

  // Stable callbacks — new function objects are not created on every render
  const update = useCallback(
    (updates: Partial<FamilyFormData>) => setData(prev => ({ ...prev, ...updates })),
    []
  )

  const goStep1 = useCallback(() => setStep(1), [])
  const goStep2 = useCallback(() => setStep(2), [])
  const goStep3 = useCallback(() => setStep(3), [])
  const goStep4 = useCallback(() => setStep(4), [])

  const startFresh = useCallback(() => {
    clearDraft()
    setData(DEFAULT)
    setStep(1)
    setHasDraft(false)
  }, [])

  const handleSubmit = useCallback(async () => {
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
        languages: data.languages,
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
  }, [data])

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-[#eeedf8] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-[#534AB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-[#0B2818] mb-3">Application received!</h3>
        <p className="text-[#555] leading-relaxed">
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
      {step === 1 && <Step1Contact data={data} onChange={update} onNext={goStep2} />}
      {step === 2 && <Step2Household data={data} onChange={update} onNext={goStep3} onBack={goStep1} />}
      {step === 3 && <Step3Offerings data={data} onChange={update} onNext={goStep4} onBack={goStep2} />}
      {step === 4 && <Step4Reference data={data} onChange={update} onSubmit={handleSubmit} onBack={goStep3} loading={loading} error={error} />}
    </>
  )
}
