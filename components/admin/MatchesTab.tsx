'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Match, Soldier, HostFamily } from '@/types'

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
      supabase
        .from('matches')
        .select('*, soldiers(first_name, last_name, base_location, country_of_origin), host_families(contact_name, city)')
        .order('created_at', { ascending: false }),
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
    await supabase.from('matches').insert({
      soldier_id: form.soldierId,
      family_id: form.familyId,
      notes: form.notes || null,
    })
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
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">Active Matches</h3>
          <p className="text-sm text-gray-400">{matches.length} total</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition flex items-center gap-2"
        >
          + Create Match
        </button>
      </div>

      {creating && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
          <h4 className="font-semibold text-gray-700 mb-4">New Match</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Soldier</label>
              <select
                value={form.soldierId}
                onChange={e => setForm(f => ({ ...f, soldierId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Select soldier...</option>
                {soldiers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name} ({s.base_location ?? 'No base'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Host Family</label>
              <select
                value={form.familyId}
                onChange={e => setForm(f => ({ ...f, familyId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Select family...</option>
                {families.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.contact_name} ({f.city ?? 'No city'})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              rows={2}
              placeholder="Why this pair? Any special considerations..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setCreating(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={createMatch}
              disabled={!form.soldierId || !form.familyId || saving}
              className="bg-gray-800 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🤝</div>
          <p className="font-medium">No matches yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map(m => (
            <div key={m.id} className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#e6f7f1] rounded-full flex items-center justify-center text-[#1D9E75] font-bold text-sm mx-auto mb-1">
                      {m.soldiers?.first_name?.[0]}
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      {m.soldiers?.first_name} {m.soldiers?.last_name}
                    </p>
                    <p className="text-xs text-gray-400">{m.soldiers?.base_location}</p>
                  </div>

                  <div className="text-gray-300 text-xl font-light">↔</div>

                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#eeedf8] rounded-full flex items-center justify-center text-[#534AB7] font-bold text-sm mx-auto mb-1">
                      {m.host_families?.contact_name?.[0]}
                    </div>
                    <p className="text-xs font-semibold text-gray-700">{m.host_families?.contact_name}</p>
                    <p className="text-xs text-gray-400">{m.host_families?.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[m.status]}`}>
                    {m.status}
                  </span>
                  {m.status === 'active' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateMatch(m.id, 'completed')}
                        className="text-xs px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateMatch(m.id, 'cancelled')}
                        className="text-xs px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {m.notes && (
                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">{m.notes}</p>
              )}
              <p className="text-xs text-gray-300 mt-1">
                Matched {new Date(m.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
