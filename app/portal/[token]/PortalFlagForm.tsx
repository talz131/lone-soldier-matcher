'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function PortalFlagForm({ soldierId }: { soldierId: string }) {
  const [open, setOpen]           = useState(false)
  const [message, setMessage]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const submit = async () => {
    if (!message.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('flags').insert({
      entity_type: 'soldier',
      entity_id:   soldierId,
      flag_type:   'concern',
      description: message.trim(),
    })
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-[#555]">Thank you — our team will follow up with you soon.</p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#aaa] hover:text-[#888] transition-colors underline-offset-2 hover:underline"
      >
        Something doesn&apos;t feel right
      </button>
    )
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-[#e8e0d4] p-5">
      <h3 className="font-serif text-base text-[#0B2818] mb-1">Tell us what&apos;s on your mind</h3>
      <p className="text-xs text-[#888] mb-4">
        This goes directly to our team — it&apos;s completely private.
      </p>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        className="w-full border border-[#d4c9b8] rounded-xl px-3.5 py-2.5 text-sm text-[#0B2818] bg-[#F9F6F0] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent transition resize-none mb-4"
        placeholder="What's going on?"
      />
      <div className="flex gap-3">
        <button
          onClick={() => { setOpen(false); setMessage('') }}
          className="flex-1 py-2.5 rounded-full border border-[#d4c9b8] text-sm text-[#555] hover:border-[#888] transition"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading || !message.trim()}
          className="flex-1 py-2.5 rounded-full bg-[#0F3D2E] text-white text-sm font-semibold hover:bg-[#1D9E75] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </div>
  )
}
