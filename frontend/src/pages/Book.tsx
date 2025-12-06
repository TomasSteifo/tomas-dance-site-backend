import { useState, useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, MapPin, Loader2 } from 'lucide-react';
import { ServiceOfferingApi, ClientApi, BookingApi, toUtcIsoString } from '@/lib/api';
import { ServiceOfferingDto, ServiceType } from '@/lib/api/types';
import { mockServices } from '@/lib/api/mockData';
import { toast } from 'sonner';

// Map ServiceType enum to icon
const serviceTypeIcons: Record<ServiceType, typeof User> = {
  [ServiceType.PrivateLesson]: User,
  [ServiceType.Workshop]: Calendar,
  [ServiceType.EventBooking]: Calendar,
  [ServiceType.Bootcamp]: Clock,
  [ServiceType.Other]: Calendar,
};

const Book = () => {
  const [services, setServices] = useState<ServiceOfferingDto[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDateTime: '',
    locationDetails: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch active service offerings with fallback to mock data
  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await ServiceOfferingApi.getAll();
        const activeServices = data.filter((s) => s.isActive);
        setServices(activeServices);
        if (activeServices.length > 0) {
          setSelectedServiceId(activeServices[0].id);
        }
        setUsingMockData(false);
      } catch (err) {
        // Fallback to mock data when API is unavailable
        console.warn('API unavailable, using mock data:', err);
        setServices(mockServices);
        setSelectedServiceId(mockServices[0]?.id ?? null);
        setUsingMockData(true);
        setServicesError(null); // Clear error since we have fallback data
      } finally {
        setLoadingServices(false);
      }
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedServiceId) {
      toast.error('Please select a service');
      return;
    }

    if (!formData.preferredDateTime) {
      toast.error('Please select a preferred date and time');
      return;
    }

    setSubmitting(true);

    try {
      // First, create or find client
      const client = await ClientApi.create({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone || null,
      });

      // Then create booking
      await BookingApi.create({
        clientId: client.id,
        serviceOfferingId: selectedServiceId,
        preferredDateTime: toUtcIsoString(formData.preferredDateTime),
        locationDetails: formData.locationDetails || null,
        message: formData.message || null,
      });

      toast.success('Booking request submitted! I\'ll be in touch within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDateTime: '',
        locationDetails: '',
        message: '',
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
              Book a Lesson
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Take the first step on your dance journey. Fill out the form below
              and I'll be in touch within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  What are you interested in?
                </label>

                {usingMockData && (
                  <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm">
                    Demo mode: Backend unavailable. Showing sample services.
                  </div>
                )}
                
                {loadingServices && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading services...
                  </div>
                )}

                {servicesError && (
                  <p className="text-destructive text-sm">{servicesError}</p>
                )}

                {!loadingServices && !servicesError && services.length === 0 && (
                  <p className="text-muted-foreground text-sm">No services available at this time.</p>
                )}

                {!loadingServices && !servicesError && services.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {services.map((service) => {
                      const IconComponent = serviceTypeIcons[service.serviceType] || Calendar;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setSelectedServiceId(service.id)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                            selectedServiceId === service.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 mb-2 ${
                              selectedServiceId === service.id ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                          <span
                            className={`text-sm font-medium block ${
                              selectedServiceId === service.id ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {service.name}
                          </span>
                          {service.basePriceSek && (
                            <span className="text-xs text-muted-foreground">
                              From {service.basePriceSek} SEK
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone (optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="+46 70 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preferred Date & Time
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="datetime-local"
                      value={formData.preferredDateTime}
                      onChange={(e) => setFormData({ ...formData, preferredDateTime: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location (optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.locationDetails}
                      onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Studio address or online"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message (optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] resize-none"
                      placeholder="Tell me about your dance experience and goals..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={submitting || loadingServices}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Send Booking Request'
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                I typically respond within 24 hours. Looking forward to dancing with you!
              </p>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Book;
