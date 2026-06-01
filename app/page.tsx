import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9F6F0]">
      <div className="max-w-[480px] mx-auto px-6 flex flex-col min-h-screen">

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center pt-16 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1D9E75] to-[#534AB7] mb-6 shadow-md" />

          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-amber-200">
            🇮🇱 Connecting Hearts Across Israel
          </div>

          <h1 className="font-serif text-[2rem] text-[#0B2818] leading-snug mb-4">
            No soldier should feel<br />
            <span className="text-[#1D9E75]">alone</span> away from home.
          </h1>

          <p className="text-[0.95rem] text-[#555] leading-relaxed max-w-xs mx-auto mb-8">
            We match lone soldiers serving in the IDF with warm host families who open their
            homes, their Shabbat tables, and their hearts.
          </p>
        </section>

        {/* Gold divider */}
        <hr className="gold-rule mb-6" />

        {/* Cards */}
        <section className="pb-10 flex flex-col gap-3">
          <Link href="/soldier" className="group block">
            <div className="bg-white rounded-2xl p-5 border border-[#e8e0d4] group-hover:border-[#1D9E75] group-hover:shadow-sm transition-all duration-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e6f7f1] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-[#0B2818] mb-0.5">I&apos;m a Lone Soldier</h2>
                <p className="text-xs text-[#888] leading-relaxed">
                  Find a warm home base — Shabbat dinner, a bed on your day off, or just someone to talk to.
                </p>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full bg-[#0F3D2E] flex items-center justify-center group-hover:bg-[#1D9E75] transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/family" className="group block">
            <div className="bg-white rounded-2xl p-5 border border-[#e8e0d4] group-hover:border-[#534AB7] group-hover:shadow-sm transition-all duration-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#eeedf8] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#534AB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-[#0B2818] mb-0.5">I&apos;m a Host Family</h2>
                <p className="text-xs text-[#888] leading-relaxed">
                  Open your table, your guest room, or just your door to a young soldier far from home.
                </p>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full bg-[#0F3D2E] flex items-center justify-center group-hover:bg-[#534AB7] transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </section>

        {/* Footer */}
        <footer className="py-5 flex justify-between items-center text-xs text-[#888] border-t border-[#e8e0d4]">
          <span>© 2024 Lone Soldier Matcher</span>
          <Link href="/admin/login" className="hover:text-[#555] transition-colors">Admin</Link>
        </footer>

      </div>
    </main>
  )
}
