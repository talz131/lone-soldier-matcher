'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import PendingTab from './PendingTab'
import FamiliesTab from './FamiliesTab'
import MatchesTab from './MatchesTab'
import FlagsTab from './FlagsTab'

type Tab = 'pending' | 'families' | 'matches' | 'flags'

const TABS: { id: Tab; label: string }[] = [
  { id: 'pending', label: 'Pending Review' },
  { id: 'families', label: 'Host Families' },
  { id: 'matches', label: 'Active Matches' },
  { id: 'flags', label: 'Private Flags' },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('pending')
  const [counts, setCounts] = useState({ pending: 0, matches: 0, flags: 0 })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: soldiers }, { count: families }, { count: matches }, { count: flags }] = await Promise.all([
        supabase.from('soldiers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('host_families').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('flags').select('*', { count: 'exact', head: true }).eq('resolved', false),
      ])
      setCounts({
        pending: (soldiers ?? 0) + (families ?? 0),
        matches: matches ?? 0,
        flags: flags ?? 0,
      })
    }
    fetchCounts()
  }, [tab])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const badgeFor = (id: Tab) => {
    if (id === 'pending') return counts.pending
    if (id === 'matches') return counts.matches
    if (id === 'flags') return counts.flags
    return 0
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      {/* Nav */}
      <header className="bg-[#0F3D2E]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#534AB7]" />
            <span className="font-semibold text-white">Lone Soldier Matcher</span>
            <span className="text-white/30">·</span>
            <span className="text-sm text-white/50">Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-white/50 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </header>
      <hr className="gold-rule" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="border-b border-[#e8e0d4] mb-8">
          <div className="flex gap-1">
            {TABS.map(t => {
              const badge = badgeFor(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                    tab === t.id
                      ? 'border-[#EF9F27] text-[#0B2818]'
                      : 'border-transparent text-[#888] hover:text-[#555]'
                  }`}
                >
                  {t.label}
                  {badge > 0 && (
                    <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          {tab === 'pending' && <PendingTab />}
          {tab === 'families' && <FamiliesTab />}
          {tab === 'matches' && <MatchesTab />}
          {tab === 'flags' && <FlagsTab />}
        </div>
      </div>
    </div>
  )
}
