import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[480px] mx-auto">
        <header className="bg-white border-b border-gray-100">
          <div className="px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#534AB7]" />
            <span className="text-lg font-bold text-gray-800">Lone Soldier Matcher</span>
          </div>
        </header>

        <section className="px-6 py-14 text-center">
          <div className="inline-block bg-amber-50 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-amber-200">
            🇮🇱 Connecting Hearts Across Israel
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            No soldier should feel<br />
            <span className="text-[#1D9E75]">alone</span> away from home.
          </h2>
          <p className="text-base text-gray-500 mx-auto mb-10 leading-relaxed">
            We match lone soldiers serving in the IDF with warm host families who open their
            homes, their Shabbat tables, and their hearts.
          </p>

          <div className="flex flex-col gap-4">
            <Link href="/soldier" className="group block text-left">
              <div className="bg-white rounded-3xl shadow-md p-6 border-2 border-transparent group-hover:border-[#1D9E75] group-hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-[#e6f7f1] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1D9E75] mb-2">I&apos;m a Lone Soldier</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  Serving far from family? Find a warm home base in Israel. Whether it&apos;s a Shabbat
                  dinner, a bed on your day off, or just someone to talk to — you deserve to feel at home.
                </p>
                <span className="inline-flex items-center gap-2 bg-[#1D9E75] text-white px-5 py-2 rounded-full text-sm font-semibold group-hover:bg-[#178a63] transition-colors">
                  Register now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/family" className="group block text-left">
              <div className="bg-white rounded-3xl shadow-md p-6 border-2 border-transparent group-hover:border-[#534AB7] group-hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-[#eeedf8] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#534AB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#534AB7] mb-2">I&apos;m a Host Family</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  Your home has room for one more. Open your table, your guest room, or just your door
                  to a young soldier serving our country far from their own family.
                </p>
                <span className="inline-flex items-center gap-2 bg-[#534AB7] text-white px-5 py-2 rounded-full text-sm font-semibold group-hover:bg-[#4339a0] transition-colors">
                  Register now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </section>

        <footer className="border-t border-gray-200 py-6 px-6 flex justify-between items-center text-sm text-gray-400">
          <span>© 2024 Lone Soldier Matcher</span>
          <Link href="/admin/login" className="hover:text-gray-600 transition-colors">
            Admin
          </Link>
        </footer>
      </div>
    </main>
  )
}
