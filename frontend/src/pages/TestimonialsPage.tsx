export function TestimonialsPage() {
  const testimonials = [
    {
      name: "Sara, intermediate follower",
      text: "Tomas explains technique in a way that finally made everything click. My balance and body control improved after just a few privates.",
      location: "Gothenburg",
    },
    {
      name: "Johan, social dancer",
      text: "I feel much more confident on the dance floor now. We worked a lot on connection and leading clearly without using force.",
      location: "Copenhagen",
    },
    {
      name: "Elin, dance school organizer",
      text: "Workshops were super structured and easy to follow. Our students loved the mix of technique, flow and small styling details.",
      location: "Stockholm",
    },
    {
      name: "Mark, festival attendee",
      text: "Great balance between fun and clear structure. I got specific tips I could use the same night on the social dance floor.",
      location: "Tallinn",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
          What dancers say
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Feedback from students, socials & organizers.
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          A small selection of comments from dancers and organizers Tomas has
          worked with in classes, privates, bootcamps and events.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((t, index) => (
          <article
            key={index}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between"
          >
            <p className="text-sm text-slate-200 mb-3">&ldquo;{t.text}&rdquo;</p>
            <div className="text-xs text-slate-400">
              <p className="font-semibold text-slate-200">{t.name}</p>
              <p>{t.location}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
