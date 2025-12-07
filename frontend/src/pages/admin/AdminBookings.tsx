import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingApi } from '@/lib/api';
import { BookingDto, BookingStatus } from '@/lib/api/types';
import { Loader2, Eye, Calendar, Clock, Search, Filter, Bell } from 'lucide-react';

const statusLabels: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: 'Pending',
  [BookingStatus.Confirmed]: 'Confirmed',
  [BookingStatus.Cancelled]: 'Cancelled',
  [BookingStatus.Completed]: 'Completed',
};

const statusColors: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: 'bg-yellow-500/10 text-yellow-600',
  [BookingStatus.Confirmed]: 'bg-green-500/10 text-green-600',
  [BookingStatus.Cancelled]: 'bg-red-500/10 text-red-600',
  [BookingStatus.Completed]: 'bg-blue-500/10 text-blue-600',
};

function formatLocalDate(isoString: string): string {
  return new Date(isoString).toLocaleString();
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = searchQuery === '' || 
        booking.id.toString().includes(searchQuery) ||
        booking.clientId.toString().includes(searchQuery) ||
        booking.serviceOfferingId.toString().includes(searchQuery) ||
        booking.locationDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.message?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        booking.status === parseInt(statusFilter);
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const now = new Date().toISOString();
        const data = await BookingApi.search({
          fromDate: now,
          sortBy: 'date',
          descending: false,
        });
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const data = await BookingApi.getAll();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">Bookings</h1>
              <p className="text-muted-foreground">Manage all booking requests</p>
            </div>
            <Button variant="outline" onClick={fetchAllBookings}>
              Show All Bookings
            </Button>
          </div>

          {/* Notifications Placeholder */}
          <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {bookings.filter(b => b.status === BookingStatus.Pending).length} pending bookings require attention
                </p>
              </div>
            </div>
            {/* TODO: Add real-time notifications via WebSocket or polling when backend supports it */}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, client, service, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={BookingStatus.Pending.toString()}>Pending</SelectItem>
                  <SelectItem value={BookingStatus.Confirmed.toString()}>Confirmed</SelectItem>
                  <SelectItem value={BookingStatus.Cancelled.toString()}>Cancelled</SelectItem>
                  <SelectItem value={BookingStatus.Completed.toString()}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-20">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading bookings...
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {bookings.length === 0 ? 'No upcoming bookings found.' : 'No bookings match your filters.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredBookings.length > 0 && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Service ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {formatLocalDate(booking.preferredDateTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                          {statusLabels[booking.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {booking.clientId}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {booking.serviceOfferingId}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatLocalDate(booking.createdAtUtc)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/bookings/${booking.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminBookings;
