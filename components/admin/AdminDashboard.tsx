'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'
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

      {/* Nav — intentionally full-width, no max-width constraint */}
      <header style={{ background: '#0F3D2E', width: '100%' }}>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
            <span style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>Lone Soldier Matcher</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Dashboard</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <button onClick={handleLogout} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-white transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>
      <hr className="gold-rule" />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Tabs — all four on one line, 11px, minimal padding */}
        <div style={{ borderBottom: '1px solid #e8e0d4', marginBottom: 24 }}>
          <div style={{ display: 'flex' }}>
            {TABS.map(t => {
              const badge = badgeFor(t.id)
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    padding: '8px 2px',
                    fontSize: 11,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    borderBottom: active ? '2px solid #EF9F27' : '2px solid transparent',
                    color: active ? '#0B2818' : '#888',
                    background: 'none',
                    border: 'none',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: 2,
                    borderBottomColor: active ? '#EF9F27' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    transition: 'color 0.15s',
                  }}
                >
                  {t.label}
                  {badge > 0 && (
                    <span style={{ background: '#fef3c7', color: '#b45309', fontSize: 10, padding: '1px 5px', borderRadius: 99, fontWeight: 700 }}>
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          {tab === 'pending'  && <PendingTab />}
          {tab === 'families' && <FamiliesTab />}
          {tab === 'matches'  && <MatchesTab />}
          {tab === 'flags'    && <FlagsTab />}
        </div>
      </div>
    </div>
  )
}
