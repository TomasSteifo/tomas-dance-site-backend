import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, MapPin, Users, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { serviceOfferingsApi } from '@/lib/api/serviceOfferings';
import { bookingsApi } from '@/lib/api/bookings';
import { clientsApi } from '@/lib/api/clients';
import { type ServiceOfferingDto, ServiceType } from '@/lib/api/types';
import { Skeleton } from '@/components/ui/skeleton';

const Book = () => {
  const { toast } = useToast();
  const { data, isLoading, error } = useQuery<ServiceOfferingDto[]>({
    queryKey: ['service-offerings', 'for-booking'],
    queryFn: serviceOfferingsApi.getAll,
  });

  const services = (data ?? []).filter((service) => service.IsActive !== false);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    locationDetails: '',
    preferredDateTime: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      setSelectedServiceId(services[0].Id);
    }
  }, [services, selectedServiceId]);

  const serviceTypeIcons: Record<ServiceType, typeof User> = {
    [ServiceType.PrivateLesson]: User,
    [ServiceType.EventBooking]: Calendar,
    [ServiceType.Workshop]: Users,
    [ServiceType.Bootcamp]: Zap,
    [ServiceType.Other]: MapPin,
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return 'Duration varies';
    return `${duration} minutes`;
  };

  const formatPrice = (basePrice: number | null) => {
    if (basePrice === null || basePrice === undefined) return 'Pricing on request';
    return `From SEK ${basePrice.toLocaleString('sv-SE')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedServiceId) {
      toast({
        title: 'Select a service',
        description: 'Please choose a service offering before submitting your request.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.preferredDateTime) {
      toast({
        title: 'Pick a time',
        description: 'Please select your preferred date and time.',
        variant: 'destructive',
      });
      return;
    }

    const preferredDateTimeUtc = new Date(formData.preferredDateTime).toISOString();

    try {
      setIsSubmitting(true);
      const client = await clientsApi.create({
        FullName: formData.name,
        Email: formData.email,
        Phone: formData.phone || null,
      });

      await bookingsApi.create({
        ClientId: client.Id,
        ServiceOfferingId: selectedServiceId,
        PreferredDateTime: preferredDateTimeUtc,
        LocationDetails: formData.locationDetails || null,
        Message: formData.message || null,
      });

      toast({
        title: 'Booking request sent',
        description: 'Thank you! We will confirm your booking shortly.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        locationDetails: '',
        preferredDateTime: '',
        message: '',
      });
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Unable to submit your booking.';
      toast({
        title: 'Booking failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
                {isLoading && (
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="p-4 rounded-2xl border border-border bg-card">
                        <Skeleton className="w-8 h-8 mb-2 rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                )}
                {!isLoading && services.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {services.map((service: ServiceOfferingDto) => {
                      const Icon = serviceTypeIcons[service.ServiceType] ?? User;
                      const isSelected = selectedServiceId === service.Id;
                      return (
                        <button
                          key={service.Id}
                          type="button"
                          onClick={() => setSelectedServiceId(service.Id)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {service.Name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDuration(service.DurationMinutes)} · {formatPrice(service.BasePriceSek)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {!isLoading && services.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {error ? 'Unable to load services right now.' : 'No services available at the moment.'}
                  </p>
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
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preferred Date &amp; Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="datetime-local"
                      value={formData.preferredDateTime}
                      onChange={(e) => setFormData({ ...formData, preferredDateTime: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Times are captured in your local timezone and sent as UTC to the booking system.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location Details (optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.locationDetails}
                      onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Studio, venue, or online preference"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
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
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Booking Request'}
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
