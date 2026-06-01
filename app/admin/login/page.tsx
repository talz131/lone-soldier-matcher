'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col">
      {/* Nav */}
      <nav className="bg-[#0F3D2E]">
        <div className="px-6 py-3.5 flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#1D9E75] to-[#534AB7]" />
          <span className="text-white text-sm font-semibold">Lone Soldier Matcher</span>
        </div>
      </nav>
      <hr className="gold-rule" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#0F3D2E] mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#EF9F27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl text-[#0B2818]">Admin Access</h1>
            <p className="text-[#888] text-sm mt-1">Lone Soldier Matcher</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#e8e0d4] p-7">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#555] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-[#d4c9b8] rounded-xl px-3.5 py-2.5 text-sm bg-white text-[#0B2818] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:border-transparent transition"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555] mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-[#d4c9b8] rounded-xl px-3.5 py-2.5 text-sm bg-white text-[#0B2818] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F3D2E] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#1D9E75] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-[#888] hover:text-[#555] transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
