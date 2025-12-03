import { Link } from "react-router-dom";
import { EventRequestForm } from "../components/forms/EventRequestForm";

export function OrganizersPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
          For organizers & festivals
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Book Tomas for workshops, bootcamps & shows.
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Ideal for festivals, weekender events, socials and special concept
          nights. Tomas brings clear teaching, strong connection focus and
          a mix of sensual & urban bachata styling tailored to your crowd.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3 text-sm">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold mb-2">Workshops</h2>
          <p className="text-xs text-slate-300 mb-2">
            1–2h workshops in bachata sensual, urban styling, technique or
            musicality. Adapted to your event&apos;s level and schedule.
          </p>
          <p className="text-xs text-slate-400">
            Example: 2× 60 min workshops for Level 2–3 groups.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold mb-2">Bootcamps</h2>
          <p className="text-xs text-slate-300 mb-2">
            Intensive half-day or full-day bootcamps for schools and events
            that want deeper progress and a clear structure.
          </p>
          <p className="text-xs text-slate-400">
            Example: 3–4h &quot;Flow & Connection&quot; bootcamp for
            intermediate dancers.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold mb-2">Shows & concepts</h2>
          <p className="text-xs text-slate-300 mb-2">
            Demo shows, concept classes or special theme nights in
            collaboration with your DJ or school.
          </p>
          <p className="text-xs text-slate-400">
            Example: &quot;Urban Sensual Night&quot; with class + demo + social.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Typical booking package</h2>
        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
          <li>1–3 workshops (60–90 min each)</li>
          <li>Optional bootcamp or intensive for regular students</li>
          <li>Social dancing presence and connection with your community</li>
          <li>Flexible collaboration on schedule, themes and marketing</li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold mb-1">
            Interested in booking Tomas?
          </h2>
          <p className="text-xs text-slate-300 max-w-md">
            Send a booking request with your preferred dates, city, type of
            event and rough plan. You&apos;ll get a reply with availability,
            suggested formats and package options.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/book-lesson"
            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Send booking request
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            View packages
          </Link>
        </div>
      </section>

      <EventRequestForm />
    </section>
  );
}
