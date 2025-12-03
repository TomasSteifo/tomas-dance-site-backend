import { useEffect, useState, useMemo } from "react";
import { getAllServiceOfferings } from "../lib/api/serviceOfferingsApi";
import type { ServiceOfferingDto } from "../types/serviceOffering";
import { Loader } from "../components/common/Loader";

const getServiceCategories = (service: ServiceOfferingDto): string[] => {
  const name = service.name.toLowerCase();
  const categories: string[] = [];

  if (name.includes("private")) categories.push("Private Class");
  if (name.includes("workshop")) categories.push("Workshop");
  if (name.includes("bootcamp")) categories.push("Bootcamp");
  if (name.includes("event") || name.includes("booking")) categories.push("Event");

  if (categories.length === 0) categories.push("Service");
  return categories;
};

export function ServicesPage() {
  const [services, setServices] = useState<ServiceOfferingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllServiceOfferings();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const servicesContent = useMemo(() => {
    if (loading) {
      return <Loader label="Loading services..." />;
    }

    if (error) {
      return <p className="text-red-400">{error}</p>;
    }

    if (services.length === 0) {
      return <p className="text-slate-400">No services available yet.</p>;
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="flex h-full flex-col rounded-2xl border border-white/5 bg-[#111111] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.6)] transition-transform transition-shadow hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.9)]"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {getServiceCategories(service).map((category) => (
                <span
                  key={`${service.id}-${category}`}
                  className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
                >
                  {category}
                </span>
              ))}
            </div>

            <h2 className="mb-2 text-lg font-semibold text-white">
              {service.name}
            </h2>

            <p className="mb-4 flex-1 text-sm text-white/70">
              {service.description ?? "Details coming soon."}
            </p>

            <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-white/70 sm:text-sm">
              {service.durationMinutes != null && (
                <span>Duration: {service.durationMinutes} min</span>
              )}
              {service.basePriceSek != null && (
                <span className="font-semibold text-[#7A00FF]">
                  From {service.basePriceSek} SEK
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    );
  }, [services, loading, error]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-64 w-[40rem] bg-gradient-to-b from-[#7A00FF]/40 via-[#2D00A8]/30 to-transparent blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#7A00FF]" />
            Services & Packages
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Level up your bachata.
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
            From private coaching to full festival weekends – choose the format that fits your goals,
            schedule and experience level.
          </p>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-[#7A00FF] via-[#2D00A8] to-transparent" />
        </div>

        {servicesContent}
      </section>
    </div>
  );
}
