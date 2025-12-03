import { Link } from "react-router-dom";

export function ThankYouPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center space-y-6">
      <h1 className="text-3xl font-semibold text-emerald-400">
        Thank you for your booking request!
      </h1>
      <p className="text-slate-300 text-sm max-w-xl mx-auto">
        Your message has been received. Tomas will review your request and get
        back to you with availability and next steps.
      </p>

      <div className="flex justify-center gap-3 pt-4">
        <Link
          to="/"
          className="px-4 py-2 text-sm rounded-md bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400"
        >
          Back to home
        </Link>

        <Link
          to="/services"
          className="px-4 py-2 text-sm rounded-md border border-slate-700 text-slate-200 hover:text-emerald-300 hover:border-emerald-400"
        >
          See services
        </Link>
      </div>
    </section>
  );
}
