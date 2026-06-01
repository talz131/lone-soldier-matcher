'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Match, Soldier, HostFamily } from '@/types'

const adminInp = `w-full border border-[#d4c9b8] rounded-xl px-3 py-2 text-sm bg-white text-[#0B2818] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] resize-none`

export default function MatchesTab() {
  const [matches, setMatches] = useState<Match[]>([])
  const [soldiers, setSoldiers] = useState<Pick<Soldier, 'id' | 'first_name' | 'last_name' | 'base_location'>[]>([])
  const [families, setFamilies] = useState<Pick<HostFamily, 'id' | 'contact_name' | 'city'>[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ soldierId: '', familyId: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: m }, { data: s }, { data: f }] = await Promise.all([
      supabase.from('matches').select('*, soldiers(first_name, last_name, base_location, country_of_origin), host_families(contact_name, city)').order('created_at', { ascending: false }),
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

  const updateMatch = async (id: string, status: string) => {
    await supabase.from('matches').update({ status }).eq('id', id)
    fetchAll()
  }

  const STATUS_COLORS: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
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
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={adminInp} rows={2} placeholder="Why this pair? Any special considerations..." />
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
          {matches.map(m => (
            <div key={m.id} className="border border-[#e8e0d4] rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#e6f7f1] rounded-full flex items-center justify-center text-[#1D9E75] font-bold text-sm mx-auto mb-1">
                      {m.soldiers?.first_name?.[0]}
                    </div>
                    <p className="text-xs font-semibold text-[#0B2818]">{m.soldiers?.first_name} {m.soldiers?.last_name}</p>
                    <p className="text-xs text-[#888]">{m.soldiers?.base_location}</p>
                  </div>

                  <div className="text-[#EF9F27] text-xl font-light">↔</div>

                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#eeedf8] rounded-full flex items-center justify-center text-[#534AB7] font-bold text-sm mx-auto mb-1">
                      {m.host_families?.contact_name?.[0]}
                    </div>
                    <p className="text-xs font-semibold text-[#0B2818]">{m.host_families?.contact_name}</p>
                    <p className="text-xs text-[#888]">{m.host_families?.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[m.status]}`}>{m.status}</span>
                  {m.status === 'active' && (
                    <div className="flex gap-1">
                      <button onClick={() => updateMatch(m.id, 'completed')}
                        className="text-xs px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition">Complete</button>
                      <button onClick={() => updateMatch(m.id, 'cancelled')}
                        className="text-xs px-3 py-1.5 border border-[#e8e0d4] text-[#888] rounded-lg hover:bg-[#F9F6F0] transition">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
              {m.notes && <p className="text-xs text-[#888] mt-3 pt-3 border-t border-[#e8e0d4]">{m.notes}</p>}
              <p className="text-xs text-[#888]/60 mt-1">Matched {new Date(m.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
