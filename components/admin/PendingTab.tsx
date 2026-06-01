'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Soldier, HostFamily } from '@/types'

export default function PendingTab() {
  const [view, setView] = useState<'soldiers' | 'families'>('soldiers')
  const [soldiers, setSoldiers] = useState<Soldier[]>([])
  const [families, setFamilies] = useState<HostFamily[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const supabase = createClient()

  useEffect(() => {
    fetchAll()
  }, [])

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
    } catch (err) {
      console.error('Email failed:', err)
    }
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
    await supabase.from('flags').insert({
      entity_type: entityType,
      entity_id: entityId,
      flag_type: 'note',
      description,
    })
  }

  const items = view === 'soldiers' ? soldiers : families
  const count = { soldiers: soldiers.length, families: families.length }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(['soldiers', 'families'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              view === v
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {v === 'soldiers' ? 'Lone Soldiers' : 'Host Families'}
            {count[v] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                view === v ? 'bg-white text-gray-800' : 'bg-orange-100 text-orange-600'
              }`}>
                {count[v]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
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
              ? `${(item as Soldier).base_location ?? 'No base'} · ${(item as Soldier).country_of_origin ?? ''}`
              : `${(item as HostFamily).city ?? 'No city'}`
            const isOpen = expanded === id

            return (
              <div key={id} className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-white">
                  <div>
                    <p className="font-semibold text-gray-800">{name}</p>
                    <p className="text-sm text-gray-400">{sub} · {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpanded(isOpen ? null : id)}
                      className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                    >
                      {isOpen ? 'Collapse' : 'View details'}
                    </button>
                    <button
                      onClick={() => view === 'soldiers' ? updateSoldier(id, 'declined') : updateFamily(id, 'declined')}
                      className="text-sm font-medium text-red-500 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => view === 'soldiers' ? updateSoldier(id, 'approved') : updateFamily(id, 'approved')}
                      className="text-sm font-medium text-white bg-green-500 px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
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
                      <label className="block text-xs font-medium text-gray-500 mb-1">Admin notes (saved with decision)</label>
                      <textarea
                        value={notes[id] ?? ''}
                        onChange={e => setNotes(prev => ({ ...prev, [id]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                        rows={2}
                        placeholder="Private note..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const desc = prompt('Flag description:')
                          if (desc) await addFlag(view === 'soldiers' ? 'soldier' : 'family', id, desc)
                        }}
                        className="text-xs text-orange-500 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition"
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
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-gray-700 font-medium mt-0.5">{value}</p>
    </div>
  )
}
