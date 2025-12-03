import { useEffect, useMemo, useState } from "react";
import { getAllBookings } from "../lib/api/bookingsApi";
import type { BookingDto } from "../types/booking";
import type { ServiceOfferingDto } from "../types/serviceOffering";
import { getAllServiceOfferings } from "../lib/api/serviceOfferingsApi";
import { Loader } from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";

interface BookingWithServiceName extends BookingDto {
  serviceName?: string;
}

export function AdminPage() {
  const [bookings, setBookings] = useState<BookingWithServiceName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<
    "date" | "createdAt" | "service" | "client" | "status"
  >("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [bookingsResponse, servicesResponse] = await Promise.all([
          getAllBookings(),
          getAllServiceOfferings(),
        ]);

        const serviceMap = new Map<number, ServiceOfferingDto>();
        for (const service of servicesResponse) {
          serviceMap.set(service.id, service);
        }

        const enriched: BookingWithServiceName[] = bookingsResponse.map(
          (b) => ({
            ...b,
            serviceName: serviceMap.get(b.serviceOfferingId)?.name,
          })
        );

        setBookings(enriched);
      } catch (err) {
        console.error(err);
        const fallbackBookings: BookingWithServiceName[] = [
          {
            id: 1,
            clientId: 101,
            serviceOfferingId: 1,
            startTimeUtc: new Date().toISOString(),
            locationDetails: "Studio Downtown",
            status: "Pending",
            serviceName: "Private Lesson (Placeholder)",
            clientName: "Sample Client",
          },
          {
            id: 2,
            clientId: 102,
            serviceOfferingId: 2,
            startTimeUtc: new Date(Date.now() + 3600 * 1000).toISOString(),
            locationDetails: "Online",
            status: "Confirmed",
            serviceName: "Workshop (Placeholder)",
            clientName: "Fallback Booking",
          },
        ];
        setBookings(fallbackBookings);
        setError(
          "Failed to load bookings from the API. Showing placeholder data."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSort = (
    field: "date" | "createdAt" | "service" | "client" | "status"
  ) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getComparable = (value: unknown): string =>
    String(value ?? "").toLowerCase();

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.startTimeUtc ?? 0);

      if (statusFilter !== "all") {
        if (getComparable(booking.status) !== statusFilter) {
          return false;
        }
      }

      if (fromDate) {
        const from = new Date(fromDate);
        if (bookingDate < from) {
          return false;
        }
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (bookingDate > to) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, statusFilter, fromDate, toDate]);

  const sortedFilteredBookings = useMemo(() => {
    const copy = [...filteredBookings];

    copy.sort((a, b) => {
      let result = 0;

      switch (sortField) {
        case "status": {
          result = getComparable(a.status).localeCompare(
            getComparable(b.status)
          );
          break;
        }
        case "service": {
          result = getComparable(a.serviceName).localeCompare(
            getComparable(b.serviceName)
          );
          break;
        }
        case "client": {
          result = getComparable(a.clientName ?? `client-${a.clientId}`).localeCompare(
            getComparable(b.clientName ?? `client-${b.clientId}`)
          );
          break;
        }
        case "date": {
          const aDate = new Date(a.startTimeUtc ?? 0).getTime();
          const bDate = new Date(b.startTimeUtc ?? 0).getTime();
          result = aDate - bDate;
          break;
        }
        case "createdAt": {
          const aCreated = new Date(a.createdAt ?? 0).getTime();
          const bCreated = new Date(b.createdAt ?? 0).getTime();
          result = aCreated - bCreated;
          break;
        }
        default:
          result = 0;
      }

      return sortDirection === "asc" ? result : -result;
    });

    return copy;
  }, [filteredBookings, sortDirection, sortField]);

  const handleResetFilters = () => {
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    setSortField("date");
    setSortDirection("asc");
  };

  const renderHeader = (field: typeof sortField, label: string) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-slate-100"
    >
      <span>{label}</span>
      {sortField === field && (
        <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
      )}
    </button>
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin / Test – Bookings</h1>
      <p className="text-slate-300 mb-4 text-sm">
        This page shows all bookings from the backend. Use it to verify that
        the booking form and API are working correctly.
      </p>

      {loading && <Loader label="Loading bookings..." />}

      {error && (
        <p className="text-red-400 text-sm mb-4">
          {error}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="text-sm text-slate-400">
          Showing {sortedFilteredBookings.length} booking
          {sortedFilteredBookings.length === 1 ? "" : "s"}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-700 bg-slate-950/50 rounded px-3 py-2 text-sm text-slate-100"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-slate-700 bg-slate-950/50 rounded px-3 py-2 text-sm text-slate-100"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-slate-700 bg-slate-950/50 rounded px-3 py-2 text-sm text-slate-100"
        />

        <button
          type="button"
          onClick={handleResetFilters}
          className="text-sm px-3 py-2 border border-slate-700 rounded-md text-slate-100 hover:bg-slate-900/60"
        >
          Clear filters
        </button>
      </div>

      {!loading && !error && bookings.length === 0 && (
        <p className="text-slate-400 text-sm">
          No bookings found yet. Create one via the "Book Lesson" page.
        </p>
      )}

      {!loading && sortedFilteredBookings.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80 border-b border-slate-800">
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">
                  {renderHeader("client", "Client")}
                </th>
                <th className="px-3 py-2">
                  {renderHeader("service", "Service")}
                </th>
                <th className="px-3 py-2">
                  {renderHeader("date", "Start (UTC)")}
                </th>
                <th className="px-3 py-2">
                  {renderHeader("createdAt", "Created")}
                </th>
                <th className="px-3 py-2">
                  {renderHeader("status", "Status")}
                </th>
                <th className="px-3 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-slate-800 hover:bg-slate-900/80"
                >
                  <td className="px-3 py-2 text-slate-200">{booking.id}</td>
                  <td className="px-3 py-2 text-slate-300">
                    {booking.clientName ?? `#${booking.clientId}`}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {booking.serviceName ?? `Service ${booking.serviceOfferingId}`}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {new Date(booking.startTimeUtc).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-300">
                    <StatusBadge status={booking.status ?? undefined} />
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400">
                    {booking.locationDetails ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
