'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { HostFamily } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  matched: 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
}

export default function FamiliesTab() {
  const [families, setFamilies] = useState<HostFamily[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('host_families')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setFamilies(data ?? [])
        setLoading(false)
      })
  }, [])

  const displayed = filter === 'all' ? families : families.filter(f => f.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'approved', 'pending', 'matched', 'declined'].map(f => (
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
        <span className="text-sm text-gray-400">{displayed.length} families</span>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No families found.</div>
      ) : (
        <div className="space-y-3">
          {displayed.map(f => (
            <div key={f.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#eeedf8] rounded-full flex items-center justify-center text-[#534AB7] font-bold text-sm">
                    {f.contact_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{f.contact_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[f.status]}`}>
                        {f.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {f.city} · {f.family_size ? `${f.family_size} people` : ''} ·{' '}
                      {[
                        f.can_offer_room && 'Room',
                        f.can_offer_meals && 'Meals',
                        f.can_offer_shabbat && 'Shabbat',
                      ].filter(Boolean).join(', ') || 'No offerings listed'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                >
                  {expanded === f.id ? 'Collapse' : 'View'}
                </button>
              </div>

              {expanded === f.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <Detail label="Email" value={f.email} />
                    <Detail label="Phone" value={f.phone} />
                    <Detail label="Neighborhood" value={f.neighborhood} />
                    <Detail label="Living Situation" value={f.living_situation} />
                    <Detail label="Available Space" value={f.available_space} />
                    <Detail label="Has Children" value={f.has_children ? `Yes (${f.children_ages ?? ''})` : 'No'} />
                    <Detail label="Pets" value={f.pets} />
                    <Detail label="Observance" value={f.religious_observance} />
                    <Detail label="Meal Frequency" value={f.meal_frequency} />
                    {f.activities_description && <Detail label="Activities" value={f.activities_description} />}
                    {f.additional_notes && <div className="col-span-3"><Detail label="Notes" value={f.additional_notes} /></div>}
                    {f.admin_notes && <div className="col-span-3"><Detail label="Admin Notes" value={f.admin_notes} /></div>}
                    <Detail label="Reference" value={f.reference_name ? `${f.reference_name} · ${f.reference_phone}` : undefined} />
                    <Detail label="Registered" value={new Date(f.created_at).toLocaleDateString()} />
                  </div>
                </div>
              )}
            </div>
          ))}
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
