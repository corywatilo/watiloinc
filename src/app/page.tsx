export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="flex-1 flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="font-mono text-sm tracking-tight">Watilo Inc.</div>
        <nav className="hidden sm:flex gap-6 text-sm text-neutral-500">
          <a href="#work" className="hover:text-neutral-900 transition-colors">
            Work
          </a>
          <a href="#about" className="hover:text-neutral-900 transition-colors">
            About
          </a>
          <a
            href="mailto:cww@watilo.com"
            className="hover:text-neutral-900 transition-colors"
          >
            Contact
          </a>
        </nav>
      </header>

      <section className="flex-1 flex flex-col justify-center px-8 max-w-3xl">
        <p className="text-sm font-mono uppercase tracking-wider text-neutral-400 mb-6">
          Est. {year}
        </p>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] mb-6">
          A small studio of one.
        </h1>
        <p className="text-lg text-neutral-500 max-w-xl">
          Watilo Inc. is the personal corner of Cory Watilo &mdash; a place to
          ship side projects, write the occasional thought, and pretend to be a
          real company.
        </p>
      </section>

      <footer className="px-8 py-6 text-xs text-neutral-400 font-mono">
        &copy; {year} Watilo Inc.
      </footer>
    </main>
  );
}
