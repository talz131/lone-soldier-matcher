'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Flag } from '@/types'

const FLAG_COLORS: Record<string, string> = {
  red_flag: 'bg-red-100 text-red-700 border-red-200',
  concern: 'bg-orange-100 text-orange-700 border-orange-200',
  follow_up: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  note: 'bg-gray-100 text-gray-600 border-gray-200',
}

const FLAG_LABELS: Record<string, string> = {
  red_flag: '🚩 Red Flag',
  concern: '⚠️ Concern',
  follow_up: '📋 Follow Up',
  note: '📝 Note',
}

export default function FlagsTab() {
  const [flags, setFlags] = useState<Flag[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open')
  const [form, setForm] = useState({
    entityType: 'soldier' as 'soldier' | 'family',
    entityId: '',
    flagType: 'note' as Flag['flag_type'],
    description: '',
  })
  const [entities, setEntities] = useState<{ id: string; name: string }[]>([])
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    fetchEntities(form.entityType)
  }, [form.entityType])

  const fetchAll = async () => {
    setLoading(true)
    const { data } = await supabase.from('flags').select('*').order('created_at', { ascending: false })
    setFlags(data ?? [])
    setLoading(false)
  }

  const fetchEntities = async (type: 'soldier' | 'family') => {
    if (type === 'soldier') {
      const { data } = await supabase.from('soldiers').select('id, first_name, last_name')
      setEntities(data?.map(s => ({ id: s.id, name: `${s.first_name} ${s.last_name}` })) ?? [])
    } else {
      const { data } = await supabase.from('host_families').select('id, contact_name')
      setEntities(data?.map(f => ({ id: f.id, name: f.contact_name })) ?? [])
    }
  }

  const addFlag = async () => {
    if (!form.entityId || !form.description.trim()) return
    setSaving(true)
    await supabase.from('flags').insert({
      entity_type: form.entityType,
      entity_id: form.entityId,
      flag_type: form.flagType,
      description: form.description,
    })
    setForm({ entityType: 'soldier', entityId: '', flagType: 'note', description: '' })
    setShowForm(false)
    setSaving(false)
    fetchAll()
  }

  const resolve = async (id: string) => {
    await supabase.from('flags').update({ resolved: true, resolved_at: new Date().toISOString() }).eq('id', id)
    fetchAll()
  }

  const displayed = flags.filter(f =>
    filter === 'all' ? true : filter === 'open' ? !f.resolved : f.resolved
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['open', 'all', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filter === f ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition"
        >
          + Add Flag
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
          <h4 className="font-semibold text-gray-700 mb-4">New Flag</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Entity Type</label>
              <select
                value={form.entityType}
                onChange={e => setForm(f => ({ ...f, entityType: e.target.value as 'soldier' | 'family', entityId: '' }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
              >
                <option value="soldier">Soldier</option>
                <option value="family">Host Family</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Person</label>
              <select
                value={form.entityId}
                onChange={e => setForm(f => ({ ...f, entityId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">Select...</option>
                {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Flag Type</label>
            <div className="flex gap-2 flex-wrap">
              {(['note', 'follow_up', 'concern', 'red_flag'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, flagType: t }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    form.flagType === t ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {FLAG_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
              rows={2}
              placeholder="What's the concern?"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
            <button
              onClick={addFlag}
              disabled={!form.entityId || !form.description.trim() || saving}
              className="bg-gray-800 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Flag'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🏳️</div>
          <p className="font-medium">No {filter === 'open' ? 'open' : ''} flags.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(flag => (
            <div key={flag.id} className={`border rounded-2xl p-4 ${flag.resolved ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap ${FLAG_COLORS[flag.flag_type]}`}>
                    {FLAG_LABELS[flag.flag_type]}
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      {flag.entity_type} · {new Date(flag.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700">{flag.description}</p>
                  </div>
                </div>
                {!flag.resolved && (
                  <button
                    onClick={() => resolve(flag.id)}
                    className="text-xs text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition whitespace-nowrap ml-4"
                  >
                    Mark resolved
                  </button>
                )}
                {flag.resolved && (
                  <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                    Resolved {flag.resolved_at ? new Date(flag.resolved_at).toLocaleDateString() : ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
