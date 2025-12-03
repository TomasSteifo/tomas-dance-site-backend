import { Link } from "react-router-dom";

const highlights = [
  {
    title: "1:1 Coaching",
    copy: "Tailored private sessions that refine technique, expression and social dance confidence.",
  },
  {
    title: "Workshops & Bootcamps",
    copy: "Immersive formats for dance schools, festivals and corporate experiences across Europe.",
  },
  {
    title: "Shows & Creative Direction",
    copy: "Concept pieces, demos and collaborative storytelling for unforgettable event moments.",
  },
];

const testimonials = [
  {
    quote:
      "Tomas’ coaching changed how I move. Everything finally clicked and I feel confident when I dance.",
    name: "Sara, Gothenburg",
  },
  {
    quote:
      "Classes were structured, musical and fun. Booking & communication were seamless for our festival.",
    name: "Elin, Organizer",
  },
  {
    quote:
      "Technique, flow and connection came together in a way I hadn’t experienced before.",
    name: "Johan, Copenhagen",
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 mx-auto h-64 w-[45rem] bg-gradient-to-b from-[#7A00FF]/40 via-[#2D00A8]/30 to-transparent blur-[140px]" />
        <div className="absolute inset-y-0 right-0 h-full w-72 bg-gradient-to-l from-[#2D00A8]/25 to-transparent blur-[120px]" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 space-y-16">
        <div className="grid gap-12 lg:grid-cols-[3fr,2fr]">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#7A00FF]" />
              Bachata · Flow · Presence
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Modern bachata coaching for dancers & events.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70">
              Private lessons, workshops and collaborations with Tomas — combining
              clean technique, musicality and contemporary styling with grounded connection.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/book-lesson"
                className="inline-flex items-center justify-center rounded-full bg-[#7A00FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(122,0,255,0.25)] transition hover:bg-[#8f28ff]"
              >
                Book a private lesson
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40"
              >
                Explore services
              </Link>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/5 bg-[#2B2B2B] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Available formats
            </p>
            <ul className="space-y-4 text-sm text-white/80">
              <li>• 1:1 private coaching in Gothenburg or online</li>
              <li>• Weekend workshops, mini bootcamps & intensives</li>
              <li>• Festival bookings, conceptual shows, DJ collabs</li>
              <li>• Bootcamp direction & creative consulting</li>
            </ul>
            <div className="rounded-2xl bg-black/40 p-4 text-xs text-white/60">
              Based in Sweden, collaborating globally. Available for travel, residencies and long-term mentorships.
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-semibold">Why dance with Tomas</h2>
            <p className="text-sm text-white/60">
              Technique + emotion, delivered with clear structure and effortless flow.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/5 bg-[#111111] p-5 shadow-[0_14px_30px_rgba(0,0,0,0.5)]"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/70">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">What dancers say</h2>
            <Link
              to="/testimonials"
              className="text-sm text-[#7A00FF] underline-offset-4 hover:underline"
            >
              Read more stories
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimony) => (
              <article
                key={testimony.name}
                className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm text-white/80"
              >
                <p className="mb-3 italic">&ldquo;{testimony.quote}&rdquo;</p>
                <p className="text-xs text-white/60">{testimony.name}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#7A00FF]/30 via-[#2D00A8]/30 to-transparent p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Ready to move?
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Let’s craft your next chapter — private or event.
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Send a booking request for lessons, workshops, or creative collaborations. Tomas will
                respond personally with availability, structure and next steps.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/book-lesson"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
              >
                Book a lesson
              </Link>
              <Link
                to="/organizers"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                Event request
              </Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
