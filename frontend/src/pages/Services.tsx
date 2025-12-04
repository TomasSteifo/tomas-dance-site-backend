import { MainLayout } from '@/layouts/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Users, Calendar, Zap, Check, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { serviceOfferingsApi } from '@/lib/api/serviceOfferings';
import { type ServiceOfferingDto, ServiceType } from '@/lib/api/types';
import { Skeleton } from '@/components/ui/skeleton';

const serviceTypeIcons: Record<ServiceType, typeof User> = {
  [ServiceType.PrivateLesson]: User,
  [ServiceType.EventBooking]: Calendar,
  [ServiceType.Workshop]: Users,
  [ServiceType.Bootcamp]: Zap,
  [ServiceType.Other]: MapPin,
};

function formatPrice(basePrice: number | null) {
  if (basePrice === null || basePrice === undefined) return 'Pricing on request';
  return `From SEK ${basePrice.toLocaleString('sv-SE')}`;
}

function formatDuration(duration: number | null) {
  if (!duration) return 'Duration varies';
  return `${duration} minutes`;
}

const Services = () => {
  const { data, isLoading, error } = useQuery<ServiceOfferingDto[]>({
    queryKey: ['service-offerings', 'list'],
    queryFn: serviceOfferingsApi.getAll,
  });
  const services = (data ?? []).filter((service) => service.IsActive !== false);

  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From private lessons to immersive bootcamps, find the perfect path
              to elevate your bachata journey.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="p-8 lg:p-10 rounded-3xl border bg-card border-border/50">
                  <Skeleton className="w-14 h-14 rounded-2xl mb-6" />
                  <Skeleton className="h-6 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-11/12 mb-2" />
                  <Skeleton className="h-4 w-4/5 mb-8" />
                  <div className="space-y-3 mb-8">
                    {[...Array(4)].map((__, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-3">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-28 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && services.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service: ServiceOfferingDto) => {
                const Icon = serviceTypeIcons[service.ServiceType] ?? User;
                return (
                  <div
                    key={service.Id}
                    className="relative p-8 lg:p-10 rounded-3xl border transition-all duration-500 hover:shadow-card bg-card border-border/50 hover:border-primary/30"
                  >
                    {service.IsActive && (
                      <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                        Available
                      </div>
                    )}

                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>

                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                      {service.Name}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {service.Description || 'Learn more about this experience.'}
                    </p>

                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {formatDuration(service.DurationMinutes)}
                      </li>
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {formatPrice(service.BasePriceSek)}
                      </li>
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        Type: {ServiceType[service.ServiceType]}
                      </li>
                    </ul>

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <div>
                        <p className="text-lg font-semibold text-foreground">{formatPrice(service.BasePriceSek)}</p>
                        <p className="text-sm text-muted-foreground">{formatDuration(service.DurationMinutes)}</p>
                      </div>
                      <Button variant="hero" asChild>
                        <Link to="/book">
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && services.length === 0 && (
            <div className="p-8 rounded-3xl border border-border/50 bg-card text-muted-foreground">
              {error ? 'Unable to load services at the moment.' : 'No services available right now.'}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Services;
