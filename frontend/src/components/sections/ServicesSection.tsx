import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, User, Users, Calendar, Zap, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
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

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading, error } = useQuery<ServiceOfferingDto[]>({
    queryKey: ['service-offerings', 'home'],
    queryFn: serviceOfferingsApi.getAll,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h2
              className={cn(
                'text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-4 transition-all duration-700',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              Services
            </h2>
            <p
              className={cn(
                'text-lg text-muted-foreground max-w-xl transition-all duration-700 delay-100',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              Choose the experience that fits your journey
            </p>
          </div>
          <Link
            to="/services"
            className={cn(
              'group flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-all duration-500',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
            style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
          >
            View All Services
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && (
            <>
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-8 lg:p-10 rounded-3xl border bg-card border-border/50',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  )}
                >
                  <Skeleton className="w-12 h-12 mb-6 rounded-xl" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </>
          )}

          {!isLoading &&
            data
              ?.filter((service) => service.IsActive !== false)
              .slice(0, 4)
              .map((service: ServiceOfferingDto, index) => {
                const Icon = serviceTypeIcons[service.ServiceType] ?? User;
                return (
                  <Link
                    key={service.Id}
                    to="/services"
                    className={cn(
                      'group relative p-8 lg:p-10 rounded-3xl border transition-all duration-500 bg-card border-border/50 hover:border-primary/30',
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    )}
                    style={{
                      transitionDelay: isVisible ? `${(index + 2) * 100}ms` : '0ms',
                    }}
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-500">
                      <Icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      {service.Name}
                      <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.Description || 'Personalized instruction to fit your goals.'}
                    </p>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span>{formatPrice(service.BasePriceSek)}</span>
                      <span aria-hidden="true">•</span>
                      <span>{formatDuration(service.DurationMinutes)}</span>
                    </div>
                  </Link>
                );
              })}

          {!isLoading && !data?.length && (
            <div className="col-span-2 text-muted-foreground">
              {error ? 'Unable to load services right now.' : 'No services available at the moment.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
