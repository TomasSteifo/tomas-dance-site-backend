import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { BookingApi, ClientApi, ServiceOfferingApi, toUtcIsoString } from '@/lib/api';
import { BookingDto, ClientDto, ServiceOfferingDto, BookingStatus } from '@/lib/api/types';
import { Loader2, ArrowLeft, Save, Calendar, User, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const statusOptions = [
  { value: BookingStatus.Pending, label: 'Pending' },
  { value: BookingStatus.Confirmed, label: 'Confirmed' },
  { value: BookingStatus.Cancelled, label: 'Cancelled' },
  { value: BookingStatus.Completed, label: 'Completed' },
];

function toLocalDateTimeValue(isoString: string): string {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

const AdminBookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookingId = parseInt(id || '0', 10);

  const [booking, setBooking] = useState<BookingDto | null>(null);
  const [client, setClient] = useState<ClientDto | null>(null);
  const [service, setService] = useState<ServiceOfferingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    status: BookingStatus.Pending,
    preferredDateTime: '',
    locationDetails: '',
    message: '',
  });

  useEffect(() => {
    async function fetchData() {
      if (!bookingId) {
        setError('Invalid booking ID');
        setLoading(false);
        return;
      }

      try {
        const bookingData = await BookingApi.getById(bookingId);
        setBooking(bookingData);
        setFormData({
          status: bookingData.status,
          preferredDateTime: toLocalDateTimeValue(bookingData.preferredDateTime),
          locationDetails: bookingData.locationDetails || '',
          message: bookingData.message || '',
        });

        // Fetch client and service in parallel
        const [clientData, serviceData] = await Promise.all([
          ClientApi.getById(bookingData.clientId),
          ServiceOfferingApi.getById(bookingData.serviceOfferingId),
        ]);
        setClient(clientData);
        setService(serviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bookingId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await BookingApi.update(bookingId, {
        status: formData.status,
        preferredDateTime: toUtcIsoString(formData.preferredDateTime),
        locationDetails: formData.locationDetails || null,
        message: formData.message || null,
      });
      toast.success('Booking updated successfully');
      navigate('/admin/bookings');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="pt-40 pb-20">
          <div className="container mx-auto px-6 flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error || !booking) {
    return (
      <MainLayout>
        <section className="pt-40 pb-20">
          <div className="container mx-auto px-6 text-center py-20">
            <p className="text-destructive mb-4">{error || 'Booking not found'}</p>
            <Button variant="outline" onClick={() => navigate('/admin/bookings')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookings
            </Button>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <Button variant="ghost" onClick={() => navigate('/admin/bookings')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>

          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold text-foreground mb-8">
              Booking #{booking.id}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Client Info */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-medium text-foreground">Client</h2>
                </div>
                {client ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground font-medium">{client.fullName}</p>
                    <p className="text-muted-foreground">{client.email}</p>
                    {client.phone && <p className="text-muted-foreground">{client.phone}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Client ID: {booking.clientId}</p>
                )}
              </div>

              {/* Service Info */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-medium text-foreground">Service</h2>
                </div>
                {service ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground font-medium">{service.name}</p>
                    {service.description && (
                      <p className="text-muted-foreground">{service.description}</p>
                    )}
                    {service.basePriceSek && (
                      <p className="text-muted-foreground">{service.basePriceSek} SEK</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Service ID: {booking.serviceOfferingId}</p>
                )}
              </div>
            </div>

            {/* Edit Form */}
            <div className="p-8 rounded-2xl border border-border bg-card space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) as BookingStatus })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.preferredDateTime}
                  onChange={(e) => setFormData({ ...formData, preferredDateTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location Details
                </label>
                <input
                  type="text"
                  value={formData.locationDetails}
                  onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Studio address or online"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none"
                  placeholder="Notes about the booking..."
                />
              </div>

              <Button variant="hero" onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminBookingDetail;
