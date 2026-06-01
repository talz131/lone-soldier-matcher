'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Soldier, HostFamily } from '@/types'

// ─── Scoring ──────────────────────────────────────────────────────────────────

const OBS_GROUP: Record<string, string> = {
  hiloni: 'secular',
  traditional: 'traditional',
  sefardi: 'traditional',
  ashkenazi: 'traditional',
  dati: 'religious',
  chabad: 'religious',
  haredi: 'ultraorthodox',
  no_preference: 'any',
}

const GROUP_DISTANCE: Record<string, Record<string, number>> = {
  secular:       { secular: 0, traditional: 1, religious: 2, ultraorthodox: 3, any: 0 },
  traditional:   { secular: 1, traditional: 0, religious: 1, ultraorthodox: 2, any: 0 },
  religious:     { secular: 2, traditional: 1, religious: 0, ultraorthodox: 1, any: 0 },
  ultraorthodox: { secular: 3, traditional: 2, religious: 1, ultraorthodox: 0, any: 0 },
  any:           { secular: 0, traditional: 0, religious: 0, ultraorthodox: 0, any: 0 },
}

function scoreObservance(soldierObs?: string, familyObs?: string): { pts: number; reason?: string } {
  if (!soldierObs || soldierObs === 'no_preference') return { pts: 35, reason: 'Soldier is open to any observance level' }
  if (!familyObs) return { pts: 20 }

  if (soldierObs === familyObs) return { pts: 40, reason: `Both are ${soldierObs} — exact match` }

  const sg = OBS_GROUP[soldierObs] ?? 'any'
  const fg = OBS_GROUP[familyObs] ?? 'any'

  if (sg === fg) return { pts: 35, reason: 'Very similar observance backgrounds' }

  const dist = GROUP_DISTANCE[sg]?.[fg] ?? 3
  if (dist === 1) return { pts: 25, reason: 'Observance levels are compatible' }
  if (dist === 2) return { pts: 10 }
  return { pts: 0 }
}

function scoreHosting(serviceType?: string, family?: HostFamily): { pts: number; reason?: string } {
  if (!serviceType || !family) return { pts: 15 }

  const daily    = /daily|יומיות/i.test(serviceType)
  const weekend  = /11\/3|12\/2/.test(serviceType)
  const thursday = /thursday|חמשושים/i.test(serviceType)
  const notDraft = /not yet drafted/i.test(serviceType)

  const offersRoom    = family.can_offer_room    || family.available_space === 'full_time'
  const offersShabbat = family.can_offer_shabbat || family.available_space === 'full_shabbat' || family.available_space === 'shabbat_meals'
  const offersMeals   = family.can_offer_meals   || family.available_space === 'shabbat_meals'

  if (daily) {
    if (offersMeals)   return { pts: 30, reason: 'Family offers meals — ideal for frequent day-offs' }
    if (offersShabbat) return { pts: 20, reason: 'Family can host for Shabbat' }
    return { pts: 10 }
  }
  if (weekend) {
    if (offersRoom)    return { pts: 30, reason: 'Family has a room — great for regular weekend stays' }
    if (offersShabbat) return { pts: 25, reason: 'Family offers Shabbat hosting — fits weekend schedule' }
    if (offersMeals)   return { pts: 15, reason: 'Family can offer meals on weekends' }
    return { pts: 10 }
  }
  if (thursday) {
    if (offersShabbat) return { pts: 30, reason: 'Family offers Shabbat hosting — ideal for Thursday release' }
    if (offersRoom)    return { pts: 25, reason: 'Family has a room for Shabbat stays' }
    return { pts: 10 }
  }
  if (notDraft) {
    if (offersMeals || offersShabbat) return { pts: 25, reason: 'Family can provide warmth and meals before service begins' }
    return { pts: 20, reason: 'Family can be a home base before service begins' }
  }
  // Irregular
  if (offersRoom || offersMeals) return { pts: 25, reason: 'Family is flexible and can accommodate an irregular schedule' }
  return { pts: 15, reason: 'Family can offer some support around your schedule' }
}

function scorePets(petsOk?: boolean, familyPets?: string): { pts: number; warning?: string } {
  if (petsOk === true || petsOk === undefined) return { pts: 20 }
  if (!familyPets || familyPets === 'No pets') return { pts: 20 }
  return { pts: 0, warning: `Family has ${familyPets.toLowerCase()} — soldier prefers no pets` }
}

function scoreDietary(hasDietary?: boolean, family?: HostFamily): { pts: number; note?: string } {
  if (!hasDietary) return { pts: 10 }
  if (family?.can_offer_meals) return { pts: 5, note: 'Has dietary needs — confirm with family before matching' }
  return { pts: 8 }
}

interface ScoredFamily {
  family: HostFamily
  score: number
  reasons: string[]
  warnings: string[]
  notes: string[]
}

function scoreFamily(soldier: Soldier, family: HostFamily): ScoredFamily {
  const obs     = scoreObservance(soldier.religious_observance, family.religious_observance)
  const hosting = scoreHosting(soldier.service_type, family)
  const pets    = scorePets(soldier.pets_ok, family.pets ?? undefined)
  const dietary = scoreDietary(soldier.has_dietary_restrictions, family)

  const score = obs.pts + hosting.pts + pets.pts + dietary.pts

  const reasons:  string[] = [obs.reason, hosting.reason].filter(Boolean) as string[]
  const warnings: string[] = [pets.warning].filter(Boolean) as string[]
  const notes:    string[] = [dietary.note].filter(Boolean) as string[]

  return { family, score, reasons, warnings, notes }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  soldier: Soldier
}

export default function MatchSuggestions({ soldier }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [results, setResults] = useState<ScoredFamily[]>([])
  const supabase = createClient()

  const load = async () => {
    setState('loading')
    const { data: families } = await supabase
      .from('host_families')
      .select('*')
      .eq('status', 'approved')

    const top3 = (families ?? [])
      .map(f => scoreFamily(soldier, f))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    setResults(top3)
    setState('done')
  }

  if (state === 'idle') {
    return (
      <button
        onClick={load}
        className="text-xs bg-[#0F3D2E] text-white px-3 py-1.5 rounded-lg hover:bg-[#1D9E75] transition flex items-center gap-1.5"
      >
        ✨ Suggested matches
      </button>
    )
  }

  if (state === 'loading') {
    return <p className="text-xs text-[#888] italic">Finding best matches…</p>
  }

  return (
    <div className="mt-1 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#0B2818]">Top suggested families</p>
        <button onClick={() => setState('idle')} className="text-xs text-[#888] hover:text-[#555] transition">
          Close
        </button>
      </div>

      {results.length === 0 ? (
        <p className="text-xs text-[#888]">No approved, unmatched families available right now.</p>
      ) : (
        results.map(({ family, score, reasons, warnings, notes }) => {
          const pct  = Math.round(score)
          const color = pct >= 70 ? '#1D9E75' : pct >= 45 ? '#EF9F27' : '#888'
          const label = pct >= 70 ? 'Strong match' : pct >= 45 ? 'Possible match' : 'Weak match'

          return (
            <div key={family.id} className="bg-white rounded-xl border border-[#e8e0d4] p-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-semibold text-[#0B2818]">{family.contact_name}</p>
                  <p className="text-xs text-[#888]">
                    {[family.city, family.religious_observance].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold leading-none" style={{ color }}>{pct}<span className="text-xs font-normal">/100</span></p>
                  <p className="text-xs mt-0.5" style={{ color }}>{label}</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-1 rounded-full bg-[#e8e0d4] mb-2 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>

              {/* Reasons */}
              {reasons.map((r, i) => (
                <p key={i} className="text-xs text-[#555] flex items-start gap-1 leading-snug">
                  <span className="text-[#1D9E75] shrink-0 mt-px">✓</span> {r}
                </p>
              ))}

              {/* Warnings */}
              {warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-600 flex items-start gap-1 leading-snug mt-0.5">
                  <span className="shrink-0 mt-px">⚠</span> {w}
                </p>
              ))}

              {/* Notes */}
              {notes.map((n, i) => (
                <p key={i} className="text-xs text-[#888] flex items-start gap-1 leading-snug mt-0.5">
                  <span className="shrink-0 mt-px">ℹ</span> {n}
                </p>
              ))}
            </div>
          )
        })
      )}
    </div>
  )
}
