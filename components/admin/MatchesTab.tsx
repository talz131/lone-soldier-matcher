'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Match, Soldier, HostFamily } from '@/types'

const adminInp = `w-full border border-[#d4c9b8] rounded-xl px-3 py-2 text-sm bg-white text-[#0B2818] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] resize-none`

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-[#888] uppercase tracking-wide">{label}</p>
      <p className="text-[#0B2818] font-medium mt-0.5 text-sm">{value}</p>
    </div>
  )
}

function PortalLink({ url, color = '#0F3D2E' }: { url: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <code className="flex-1 text-xs bg-[#F9F6F0] rounded-lg px-2 py-1.5 text-[#0B2818] overflow-hidden text-ellipsis whitespace-nowrap block">
        {url}
      </code>
      <button
        onClick={() => navigator.clipboard.writeText(url)}
        className="shrink-0 text-xs text-white px-3 py-1.5 rounded-lg transition"
        style={{ backgroundColor: color }}
      >
        Copy
      </button>
    </div>
  )
}

export default function MatchesTab() {
  const [matches, setMatches]   = useState<Match[]>([])
  const [soldiers, setSoldiers] = useState<Pick<Soldier, 'id' | 'first_name' | 'last_name' | 'base_location'>[]>([])
  const [families, setFamilies] = useState<Pick<HostFamily, 'id' | 'contact_name' | 'city'>[]>([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm]         = useState({ soldierId: '', familyId: '', notes: '' })
  const [saving, setSaving]     = useState(false)

  const supabase = createClient()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: m }, { data: s }, { data: f }] = await Promise.all([
      supabase.from('matches').select('*, soldiers(*), host_families(*)').order('created_at', { ascending: false }),
      supabase.from('soldiers').select('id, first_name, last_name, base_location').eq('status', 'approved'),
      supabase.from('host_families').select('id, contact_name, city').eq('status', 'approved'),
    ])
    setMatches(m ?? [])
    setSoldiers(s ?? [])
    setFamilies(f ?? [])
    setLoading(false)
  }

  const createMatch = async () => {
    if (!form.soldierId || !form.familyId) return
    setSaving(true)
    await supabase.from('matches').insert({ soldier_id: form.soldierId, family_id: form.familyId, notes: form.notes || null })
    await Promise.all([
      supabase.from('soldiers').update({ status: 'matched' }).eq('id', form.soldierId),
      supabase.from('host_families').update({ status: 'matched' }).eq('id', form.familyId),
    ])
    setForm({ soldierId: '', familyId: '', notes: '' })
    setCreating(false)
    setSaving(false)
    fetchAll()
  }

  const removeMatch = async (matchId: string, soldierId: string, familyId: string) => {
    if (!confirm('Remove this match? Both the soldier and family will return to the approved pool.')) return
    await supabase.from('matches').delete().eq('id', matchId)
    await Promise.all([
      supabase.from('soldiers').update({ status: 'approved' }).eq('id', soldierId),
      supabase.from('host_families').update({ status: 'approved' }).eq('id', familyId),
    ])
    fetchAll()
  }

  const updateMatch = async (id: string, status: string) => {
    await supabase.from('matches').update({ status }).eq('id', id)
    fetchAll()
  }

  const STATUS_COLORS: Record<string, string> = {
    active:    'bg-emerald-100 text-emerald-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-[#F9F6F0] text-[#888]',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-[#0B2818]">Active Matches</h3>
          <p className="text-sm text-[#888]">{matches.length} total</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="bg-[#0F3D2E] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#1D9E75] transition flex items-center gap-2">
          + Create Match
        </button>
      </div>

      {creating && (
        <div className="bg-white border border-[#e8e0d4] rounded-2xl p-5 mb-6">
          <h4 className="font-semibold text-[#0B2818] mb-4">New Match</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">Soldier</label>
              <select value={form.soldierId} onChange={e => setForm(f => ({ ...f, soldierId: e.target.value }))} className={adminInp}>
                <option value="">Select soldier...</option>
                {soldiers.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.base_location ?? 'No base'})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">Host Family</label>
              <select value={form.familyId} onChange={e => setForm(f => ({ ...f, familyId: e.target.value }))} className={adminInp}>
                <option value="">Select family...</option>
                {families.map(f => <option key={f.id} value={f.id}>{f.contact_name} ({f.city ?? 'No city'})</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#888] mb-1.5">Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={adminInp} rows={2} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setCreating(false)} className="px-4 py-2 text-sm text-[#888] hover:text-[#555] transition">Cancel</button>
            <button onClick={createMatch} disabled={!form.soldierId || !form.familyId || saving}
              className="bg-[#0F3D2E] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1D9E75] transition disabled:opacity-50">
              {saving ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-[#888]">Loading...</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 text-[#888]">
          <div className="text-4xl mb-3">🤝</div>
          <p className="font-medium">No matches yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map(m => {
            const soldier = m.soldiers as unknown as Soldier | undefined
            const family  = m.host_families as unknown as HostFamily | undefined
            const isOpen  = expanded === m.id
            const origin  = typeof window !== 'undefined' ? window.location.origin : ''

            return (
              <div key={m.id} className="border border-[#e8e0d4] rounded-2xl overflow-hidden bg-white">
                {/* Summary row */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-[#e6f7f1] rounded-full flex items-center justify-center text-[#1D9E75] font-bold text-sm mx-auto mb-1">
                          {soldier?.first_name?.[0]}
                        </div>
                        <p className="text-xs font-semibold text-[#0B2818]">{soldier?.first_name} {soldier?.last_name}</p>
                        <p className="text-xs text-[#888]">{soldier?.base_location ?? '—'}</p>
                      </div>
                      <div className="text-[#EF9F27] text-xl font-light">↔</div>
                      <div className="text-center">
                        <div className="w-10 h-10 bg-[#eeedf8] rounded-full flex items-center justify-center text-[#534AB7] font-bold text-sm mx-auto mb-1">
                          {family?.contact_name?.[0]}
                        </div>
                        <p className="text-xs font-semibold text-[#0B2818]">{family?.contact_name}</p>
                        <p className="text-xs text-[#888]">{family?.city ?? '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[m.status]}`}>{m.status}</span>
                      <button
                        onClick={() => setExpanded(isOpen ? null : m.id)}
                        className="text-xs px-3 py-1.5 border border-[#e8e0d4] text-[#555] rounded-lg hover:bg-[#F9F6F0] transition"
                      >
                        {isOpen ? 'Collapse' : 'Details'}
                      </button>
                      {m.status === 'active' && (
                        <>
                          <button onClick={() => updateMatch(m.id, 'completed')}
                            className="text-xs px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition">Complete</button>
                          <button
                            onClick={() => removeMatch(m.id, m.soldier_id, m.family_id)}
                            className="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                          >
                            Remove match
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {m.notes && <p className="text-xs text-[#888] mt-3 pt-3 border-t border-[#e8e0d4]">{m.notes}</p>}
                  <p className="text-xs text-[#888]/60 mt-1">Matched {new Date(m.created_at).toLocaleDateString()}</p>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-[#e8e0d4] bg-[#F9F6F0] p-4 space-y-5">
                    {/* Soldier */}
                    <div>
                      <p className="text-xs font-bold text-[#1D9E75] uppercase tracking-wide mb-3">🪖 Soldier</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Detail label="Full Name" value={`${soldier?.first_name ?? ''} ${soldier?.last_name ?? ''}`} />
                        <Detail label="Email" value={soldier?.email} />
                        <Detail label="Phone" value={soldier?.phone} />
                        <Detail label="WhatsApp" value={soldier?.whatsapp_phone} />
                        <Detail label="Gender" value={soldier?.gender} />
                        <Detail label="ID Number" value={soldier?.id_number} />
                        <Detail label="Date of Birth" value={soldier?.date_of_birth} />
                        <Detail label="Country of Origin" value={soldier?.country_of_origin} />
                        <Detail label="Unit / Role" value={soldier?.unit} />
                        <Detail label="Leave Frequency" value={soldier?.service_type} />
                        <Detail label="Hebrew Level" value={soldier?.hebrew_level} />
                        <Detail label="Languages" value={soldier?.languages?.join(', ')} />
                        <Detail label="Observance Pref." value={soldier?.religious_observance} />
                        <Detail label="Family Vibe" value={soldier?.family_vibe?.join(', ')} />
                        <Detail label="Preferred Location" value={soldier?.base_location} />
                        <Detail label="Pets OK?" value={soldier?.pets_ok != null ? (soldier.pets_ok ? 'Yes' : 'No') : undefined} />
                        <Detail label="Dietary Restrictions" value={soldier?.has_dietary_restrictions ? soldier.dietary_details || 'Yes' : 'None'} />
                        <Detail label="Reference" value={soldier?.reference_name} />
                        <Detail label="Reference Phone" value={soldier?.reference_phone} />
                        <Detail label="Reference Relationship" value={soldier?.reference_relationship} />
                        {soldier?.additional_notes && <div className="col-span-2"><Detail label="Additional Notes" value={soldier.additional_notes} /></div>}
                      </div>
                      {soldier?.portal_token && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-[#555] mb-1">🔗 Soldier Portal</p>
                          <PortalLink url={`${origin}/portal/${soldier.portal_token}`} color="#0F3D2E" />
                        </div>
                      )}
                    </div>

                    <hr className="border-[#e8e0d4]" />

                    {/* Family */}
                    <div>
                      <p className="text-xs font-bold text-[#534AB7] uppercase tracking-wide mb-3">🏠 Host Family</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Detail label="Contact Name" value={family?.contact_name} />
                        <Detail label="Email" value={family?.email} />
                        <Detail label="Phone" value={family?.phone} />
                        <Detail label="ID Number" value={family?.id_number} />
                        <Detail label="City" value={family?.city} />
                        <Detail label="Neighborhood" value={family?.neighborhood} />
                        <Detail label="Family Size" value={family?.family_size?.toString()} />
                        <Detail label="Has Children" value={family?.has_children ? `Yes (${family.children_ages ?? ''})` : 'No'} />
                        <Detail label="Hosting Type" value={family?.available_space} />
                        <Detail label="Observance" value={family?.religious_observance} />
                        <Detail label="Languages" value={(family as unknown as Record<string, unknown> & { languages?: string[] })?.languages?.join(', ')} />
                        <Detail label="Pets" value={family?.pets} />
                        <Detail label="Can Offer" value={[
                          family?.can_offer_room      && 'Room',
                          family?.can_offer_meals     && 'Meals',
                          family?.can_offer_shabbat   && 'Shabbat',
                          family?.can_offer_activities && 'Activities',
                          family?.can_offer_laundry   && 'Laundry',
                        ].filter(Boolean).join(', ')} />
                        <Detail label="Reference" value={family?.reference_name ? `${family.reference_name} (${family.reference_relationship})` : undefined} />
                        {family?.additional_notes && <div className="col-span-2"><Detail label="Additional Notes" value={family.additional_notes} /></div>}
                      </div>
                      {family?.portal_token && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-[#555] mb-1">🔗 Family Portal</p>
                          <PortalLink url={`${origin}/family-portal/${family.portal_token}`} color="#534AB7" />
                        </div>
                      )}
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
