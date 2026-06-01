'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Soldier, HostFamily } from '@/types'
import MatchSuggestions from './MatchSuggestions'

const adminInp = `w-full border border-[#d4c9b8] rounded-lg px-3 py-2 text-sm bg-white text-[#0B2818] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] resize-none`

export default function PendingTab() {
  const [view, setView] = useState<'soldiers' | 'families'>('soldiers')
  const [soldiers, setSoldiers] = useState<Soldier[]>([])
  const [families, setFamilies] = useState<HostFamily[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const supabase = createClient()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: s }, { data: f }] = await Promise.all([
      supabase.from('soldiers').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('host_families').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    ])
    setSoldiers(s ?? [])
    setFamilies(f ?? [])
    setLoading(false)
  }

  const sendEmail = async (email: string, name: string, entityType: 'soldier' | 'family', status: 'approved' | 'declined') => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, entityType, status }),
      })
    } catch (err) { console.error('Email failed:', err) }
  }

  const updateSoldier = async (id: string, status: 'approved' | 'declined') => {
    const soldier = soldiers.find(s => s.id === id)
    await supabase.from('soldiers').update({ status, admin_notes: notes[id] || null, reviewed_at: new Date().toISOString() }).eq('id', id)
    if (soldier) await sendEmail(soldier.email, soldier.first_name, 'soldier', status)
    fetchAll()
  }

  const updateFamily = async (id: string, status: 'approved' | 'declined') => {
    const family = families.find(f => f.id === id)
    await supabase.from('host_families').update({ status, admin_notes: notes[id] || null, reviewed_at: new Date().toISOString() }).eq('id', id)
    if (family) await sendEmail(family.email, family.contact_name, 'family', status)
    fetchAll()
  }

  const addFlag = async (entityType: 'soldier' | 'family', entityId: string, description: string) => {
    await supabase.from('flags').insert({ entity_type: entityType, entity_id: entityId, flag_type: 'note', description })
  }

  const items = view === 'soldiers' ? soldiers : families
  const count = { soldiers: soldiers.length, families: families.length }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(['soldiers', 'families'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              view === v ? 'bg-[#0F3D2E] text-white' : 'bg-white border border-[#e8e0d4] text-[#555] hover:border-[#0F3D2E]'
            }`}
          >
            {v === 'soldiers' ? 'Lone Soldiers' : 'Host Families'}
            {count[v] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                view === v ? 'bg-white text-[#0F3D2E]' : 'bg-amber-100 text-amber-700'
              }`}>{count[v]}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#888]">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-[#888]">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-medium">All caught up! No pending {view}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const id = item.id
            const name = view === 'soldiers'
              ? `${(item as Soldier).first_name} ${(item as Soldier).last_name}`
              : (item as HostFamily).contact_name
            const sub = view === 'soldiers'
              ? [
                  (item as Soldier).base_location ?? 'No base',
                  (item as Soldier).country_of_origin,
                  new Date(item.created_at).toLocaleDateString(),
                ].filter(Boolean).join(' · ')
              : [
                  (item as HostFamily).city ?? 'No city',
                  new Date(item.created_at).toLocaleDateString(),
                ].join(' · ')
            const isOpen = expanded === id

            return (
              <div key={id} className="border border-[#e8e0d4] rounded-2xl overflow-hidden">
                <div className="p-4 bg-white">
                  {/* Row 1: name + meta */}
                  <p className="font-semibold text-[#0B2818] truncate">{name}</p>
                  <p className="text-xs text-[#888] mt-0.5">{sub}</p>
                  {/* Row 2: action buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => setExpanded(isOpen ? null : id)}
                      className="text-xs text-[#555] hover:text-[#0B2818] px-3 py-1.5 rounded-lg border border-[#e8e0d4] hover:bg-[#F9F6F0] transition">
                      {isOpen ? 'Collapse' : 'View details'}
                    </button>
                    <button onClick={() => view === 'soldiers' ? updateSoldier(id, 'declined') : updateFamily(id, 'declined')}
                      className="text-xs font-medium text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition">
                      Decline
                    </button>
                    <button onClick={() => view === 'soldiers' ? updateSoldier(id, 'approved') : updateFamily(id, 'approved')}
                      className="text-xs font-medium text-white bg-[#1D9E75] px-3 py-1.5 rounded-lg hover:bg-[#178a63] transition">
                      Approve
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-[#e8e0d4] bg-[#F9F6F0] p-4 space-y-3">
                    {view === 'soldiers' && (() => {
                      const s = item as Soldier
                      return (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <Detail label="Email" value={s.email} />
                          <Detail label="Phone" value={s.phone} />
                          <Detail label="Date of Birth" value={s.date_of_birth} />
                          <Detail label="Country" value={s.country_of_origin} />
                          <Detail label="Base" value={s.base_location} />
                          <Detail label="Service Type" value={s.service_type} />
                          <Detail label="Hebrew Level" value={s.hebrew_level} />
                          <Detail label="Languages" value={s.languages?.join(', ')} />
                          <Detail label="Observance Pref." value={s.religious_observance} />
                          <Detail label="Pets OK?" value={s.pets_ok ? 'Yes' : 'No'} />
                          <Detail label="Dietary Restrictions" value={s.has_dietary_restrictions ? s.dietary_details || 'Yes' : 'None'} />
                          <Detail label="Military ID" value={s.military_id_url ? '✅ Uploaded' : '❌ Not uploaded'} />
                        </div>
                        <MatchSuggestions soldier={s} />
                      )
                    })()}

                    {view === 'families' && (() => {
                      const f = item as HostFamily
                      return (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <Detail label="Email" value={f.email} />
                          <Detail label="Phone" value={f.phone} />
                          <Detail label="City" value={f.city} />
                          <Detail label="Family Size" value={f.family_size?.toString()} />
                          <Detail label="Has Children" value={f.has_children ? `Yes (${f.children_ages})` : 'No'} />
                          <Detail label="Available Space" value={f.available_space} />
                          <Detail label="Observance" value={f.religious_observance} />
                          <Detail label="Pets" value={f.pets} />
                          <Detail label="Can Offer" value={[
                            f.can_offer_room && 'Room',
                            f.can_offer_meals && 'Meals',
                            f.can_offer_activities && 'Activities',
                            f.can_offer_laundry && 'Laundry',
                            f.can_offer_shabbat && 'Shabbat',
                          ].filter(Boolean).join(', ')} />
                          <Detail label="Reference" value={f.reference_name ? `${f.reference_name} (${f.reference_relationship})` : undefined} />
                        </div>
                      )
                    })()}

                    <div>
                      <label className="block text-xs font-medium text-[#888] mb-1">Admin notes (saved with decision)</label>
                      <textarea value={notes[id] ?? ''} onChange={e => setNotes(prev => ({ ...prev, [id]: e.target.value }))} className={adminInp} rows={2} placeholder="Private note..." />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const desc = prompt('Flag description:')
                          if (desc) await addFlag(view === 'soldiers' ? 'soldier' : 'family', id, desc)
                        }}
                        className="text-xs text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition"
                      >
                        🚩 Add Flag
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-[#888] uppercase tracking-wide">{label}</p>
      <p className="text-[#0B2818] font-medium mt-0.5">{value}</p>
    </div>
  )
}
