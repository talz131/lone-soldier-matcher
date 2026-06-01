import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="h-screen bg-[#F9F6F0] overflow-hidden">
      {/* Hard-code the shell constraint inline so it cannot be purged */}
      <div style={{ maxWidth: 420, margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', padding: '0 16px' }}>

        {/* Hero — flex-1 centres content vertically in remaining space */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Image
            src="/logo.png"
            alt="Lone Soldier Matcher"
            width={70}
            height={70}
            className="rounded-full shadow-md"
            style={{ marginBottom: 10 }}
            priority
          />

          <h1 className="font-serif" style={{ fontSize: 18, color: '#0B2818', lineHeight: 1.3, marginBottom: 6 }}>
            No soldier should feel<br />
            <span style={{ color: '#1D9E75' }}>alone</span> away from home.
          </h1>

          <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>
            We match lone soldiers serving in the IDF with warm host families who open their
            homes, their Shabbat tables, and their hearts.
          </p>
        </section>

        {/* Gold divider */}
        <hr className="gold-rule" style={{ marginBottom: 10 }} />

        {/* Cards */}
        <section style={{ paddingBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link href="/soldier" className="group block">
            <div className="bg-white border border-[#e8e0d4] group-hover:border-[#1D9E75] group-hover:shadow-sm transition-all duration-200"
              style={{ borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: '#e6f7f1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg style={{ width: 18, height: 18, color: '#1D9E75' }} fill="none" viewBox="0 0 24 24" stroke="#1D9E75" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0B2818', margin: 0 }}>I&apos;m a Lone Soldier</p>
                <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0', lineHeight: 1.35 }}>
                  Find a warm home base — Shabbat dinner, a bed on your day off, or just someone to talk to.
                </p>
              </div>
              <div className="group-hover:bg-[#1D9E75] transition-colors"
                style={{ width: 26, height: 26, borderRadius: '50%', background: '#0F3D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/family" className="group block">
            <div className="bg-white border border-[#e8e0d4] group-hover:border-[#534AB7] group-hover:shadow-sm transition-all duration-200"
              style={{ borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: '#eeedf8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="#534AB7" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0B2818', margin: 0 }}>I&apos;m a Host Family</p>
                <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0', lineHeight: 1.35 }}>
                  Open your table, your guest room, or just your door to a young soldier far from home.
                </p>
              </div>
              <div className="group-hover:bg-[#534AB7] transition-colors"
                style={{ width: 26, height: 26, borderRadius: '50%', background: '#0F3D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </section>

        {/* Footer */}
        <footer style={{ padding: '8px 0', display: 'flex', justifyContent: 'flex-end', fontSize: 11, color: '#888', borderTop: '1px solid #e8e0d4' }}>
          <Link href="/admin/login" style={{ color: '#888' }} className="hover:text-[#555] transition-colors">Admin</Link>
        </footer>

      </div>
    </main>
  )
}
