export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-slate-800 bg-slate-900/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>© {year} Tomas Dance. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="/privacy" className="hover:text-slate-100">
            Privacy Policy
          </a>
          <a href="/contact" className="hover:text-slate-100">
            Contact
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-100"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
