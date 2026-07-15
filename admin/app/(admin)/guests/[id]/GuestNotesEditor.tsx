'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function GuestNotesEditor({ guestId, initialNotes }: { guestId: string; initialNotes: string }) {
  const [notes, setNotes]     = useState(initialNotes)
  const [saving, setSaving]   = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  async function save() {
    setSaving(true)
    setMessage(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('guests')
      .update({ notes })
      .eq('id', guestId)
    setSaving(false)
    setMessage(error
      ? { ok: false, text: 'Failed to save notes.' }
      : { ok: true,  text: 'Notes saved.' }
    )
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="card p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Private notes</p>
      <p className="text-[11px] text-white/25 mb-4">Only visible in the admin panel.</p>
      <textarea
        className="input resize-none h-28"
        placeholder="Preferences, special requests, arrival notes..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      <div className="flex items-center gap-3 mt-3">
        <button onClick={save} disabled={saving} className="btn-gold btn-sm">
          {saving ? 'Saving…' : 'Save notes'}
        </button>
        {message && (
          <p className={`text-xs ${message.ok ? 'text-emerald-400' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}
