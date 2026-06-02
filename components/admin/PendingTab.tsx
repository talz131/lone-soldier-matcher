'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Soldier, HostFamily } from '@/types'
import MatchSuggestions from './MatchSuggestions'

const adminInp = `w-full border border-[#d4c9b8] rounded-lg px-3 py-2 text-sm bg-white text-[#0B2818] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] resize-none`

interface Props {
  /** Called after a match is created so the parent can e.g. switch tabs. */
  onMatchCreated?: () => void
}

export default function PendingTab({ onMatchCreated }: Props) {
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved'>('pending')
  const [view, setView] = useState<'soldiers' | 'families'>('soldiers')
  const [soldiers, setSoldiers] = useState<Soldier[]>([])
  const [families, setFamilies] = useState<HostFamily[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const supabase = createClient()

  useEffect(() => { fetchAll() }, [statusFilter])

  const fetchAll = async () => {
    setLoading(true)
    setExpanded(null)
    const [{ data: s }, { data: f }] = await Promise.all([
      supabase.from('soldiers').select('*').eq('status', statusFilter).order('created_at', { ascending: false }),
      supabase.from('host_families').select('*').eq('status', statusFilter).order('created_at', { ascending: false }),
    ])
    setSoldiers(s ?? [])
    setFamilies(f ?? [])
    setLoading(false)
  }

  const sendEmail = async (email: string, name: string, entityType: 'soldier' | 'family', status: 'approved' | 'declined') => {
    console.log('[PendingTab] sendEmail called:', { email, name, entityType, status })
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, entityType, status }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error('[PendingTab] Email API returned error:', res.status, json)
        alert(`⚠️ Decision saved, but email failed to send.\n\nError: ${JSON.stringify(json?.error ?? json)}\n\nCheck Vercel logs for details.`)
      } else {
        console.log('[PendingTab] Email sent OK:', json)
      }
    } catch (err) {
      console.error('[PendingTab] Network error sending email:', err)
      alert('⚠️ Decision saved, but email could not be sent (network error).')
    }
  }

  const updateSoldier = async (id: string, status: 'approved' | 'declined') => {
    const soldier = soldiers.find(s => s.id === id)
    console.log('[PendingTab] updateSoldier:', id, status, 'email:', soldier?.email)
    await supabase.from('soldiers').update({ status, admin_notes: notes[id] || null, reviewed_at: new Date().toISOString() }).eq('id', id)
    if (soldier) await sendEmail(soldier.email, soldier.first_name, 'soldier', status)
    fetchAll()
  }

  const updateFamily = async (id: string, status: 'approved' | 'declined') => {
    const family = families.find(f => f.id === id)
    console.log('[PendingTab] updateFamily:', id, status, 'email:', family?.email)
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
      {/* Status toggle: Pending Review / Approved & Unmatched */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: '#F9F6F0', borderRadius: 12, padding: 4 }}>
        {(['pending', 'approved'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              background: statusFilter === s ? 'white' : 'transparent',
              color: statusFilter === s ? '#0B2818' : '#888',
              cursor: 'pointer',
              boxShadow: statusFilter === s ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {s === 'pending' ? 'Pending Review' : 'Approved & Unmatched'}
          </button>
        ))}
      </div>

      {/* Sub-tabs: Lone Soldiers / Host Families */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['soldiers', 'families'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 500,
              border: view === v ? 'none' : '1px solid #e8e0d4',
              background: view === v ? '#0F3D2E' : 'white',
              color: view === v ? 'white' : '#555',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {v === 'soldiers' ? 'Lone Soldiers' : 'Host Families'}
            {count[v] > 0 && (
              <span style={{
                fontSize: 11,
                padding: '1px 6px',
                borderRadius: 99,
                fontWeight: 700,
                background: view === v ? 'white' : '#fef3c7',
                color: view === v ? '#0F3D2E' : '#b45309',
              }}>{count[v]}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#888' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#888' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{statusFilter === 'pending' ? '✅' : '🎯'}</div>
          <p style={{ fontWeight: 500 }}>
            {statusFilter === 'pending'
              ? `All caught up! No pending ${view}.`
              : `No approved unmatched ${view} yet.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => {
            const id = item.id

            // Row 1: name
            const name = view === 'soldiers'
              ? `${(item as Soldier).first_name} ${(item as Soldier).last_name}`
              : (item as HostFamily).contact_name

            // Row 2: base/city + date — filter(Boolean) prevents double dots
            const subParts: string[] = view === 'soldiers'
              ? [
                  (item as Soldier).base_location ?? 'No base',
                  (item as Soldier).country_of_origin ?? '',   // empty string filtered below
                  new Date(item.created_at).toLocaleDateString(),
                ].filter(p => p.trim() !== '')
              : [
                  (item as HostFamily).city ?? 'No city',
                  new Date(item.created_at).toLocaleDateString(),
                ]
            const sub = subParts.join(' · ')

            const isOpen = expanded === id

            return (
              <div key={id} style={{ border: '1px solid #e8e0d4', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: 14, background: 'white' }}>
                  {/* Row 1: name */}
                  <p style={{ fontWeight: 600, color: '#0B2818', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                  {/* Row 2: meta */}
                  <p style={{ fontSize: 12, color: '#888', margin: '3px 0 0' }}>{sub}</p>
                  {/* Row 3: action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                    <button onClick={() => setExpanded(isOpen ? null : id)}
                      style={{ fontSize: 12, color: '#555', padding: '5px 10px', borderRadius: 8, border: '1px solid #e8e0d4', background: 'white', cursor: 'pointer' }}>
                      {isOpen ? 'Collapse' : 'View details'}
                    </button>
                    {statusFilter === 'pending' && (
                      <>
                        <button onClick={() => view === 'soldiers' ? updateSoldier(id, 'declined') : updateFamily(id, 'declined')}
                          style={{ fontSize: 12, fontWeight: 500, color: '#dc2626', padding: '5px 10px', borderRadius: 8, border: '1px solid #fecaca', background: 'white', cursor: 'pointer' }}>
                          Decline
                        </button>
                        <button onClick={() => view === 'soldiers' ? updateSoldier(id, 'approved') : updateFamily(id, 'approved')}
                          style={{ fontSize: 12, fontWeight: 500, color: 'white', padding: '5px 10px', borderRadius: 8, border: 'none', background: '#1D9E75', cursor: 'pointer' }}>
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid #e8e0d4', background: '#F9F6F0', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {view === 'soldiers' && (() => {
                      const s = item as Soldier
                      return (
                        <>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <Detail label="Email" value={s.email} />
                            <Detail label="Phone" value={s.phone} />
                            <Detail label="Date of Birth" value={s.date_of_birth} />
                            <Detail label="Country" value={s.country_of_origin} />
                            <Detail label="Base" value={s.base_location} />
                            <Detail label="Leave Frequency" value={s.service_type} />
                            <Detail label="Hebrew Level" value={s.hebrew_level} />
                            <Detail label="Languages" value={s.languages?.join(', ')} />
                            <Detail label="Observance Pref." value={s.religious_observance} />
                            <Detail label="Pets OK?" value={s.pets_ok ? 'Yes' : 'No'} />
                            <Detail label="Dietary Restrictions" value={s.has_dietary_restrictions ? s.dietary_details || 'Yes' : 'None'} />
                          </div>
                          <MatchSuggestions
                            soldier={s}
                            onMatchCreated={() => { fetchAll(); onMatchCreated?.() }}
                          />
                        </>
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

                    <div>
                      <button
                        onClick={async () => {
                          const desc = prompt('Flag description:')
                          if (desc) await addFlag(view === 'soldiers' ? 'soldier' : 'family', id, desc)
                        }}
                        style={{ fontSize: 12, color: '#b45309', border: '1px solid #fde68a', padding: '5px 10px', borderRadius: 8, background: 'white', cursor: 'pointer' }}
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
