import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center space-y-6">
      <h1 className="text-4xl font-bold text-emerald-400">404</h1>
      <p className="text-xl text-slate-300">Page not found</p>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Link
        to="/"
        className="inline-block mt-6 px-4 py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400"
      >
        Back to Home
      </Link>
    </section>
  );
}
