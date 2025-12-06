import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, User, Users, Calendar, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceOfferingApi } from '@/lib/api';
import { ServiceOfferingDto, ServiceType } from '@/lib/api/types';
import { mockServices } from '@/lib/api/mockData';

// Map ServiceType enum to icon
const serviceTypeIcons: Record<ServiceType, typeof User> = {
  [ServiceType.PrivateLesson]: User,
  [ServiceType.Workshop]: Users,
  [ServiceType.EventBooking]: Calendar,
  [ServiceType.Bootcamp]: Zap,
  [ServiceType.Other]: Calendar,
};

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState<ServiceOfferingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await ServiceOfferingApi.getAll();
        // Filter active and take first 4
        setServices(data.filter((s) => s.isActive).slice(0, 4));
      } catch (err) {
        // Fallback to mock data when API is unavailable
        console.warn('API unavailable, using mock data:', err);
        setServices(mockServices.slice(0, 4));
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Mark first PrivateLesson as featured
  const featuredId = services.find((s) => s.serviceType === ServiceType.PrivateLesson)?.id;

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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading services...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services available at this time.</p>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const IconComponent = serviceTypeIcons[service.serviceType] || Calendar;
              const isFeatured = service.id === featuredId;

              return (
                <Link
                  key={service.id}
                  to="/book"
                  className={cn(
                    'group relative p-8 lg:p-10 rounded-3xl border transition-all duration-500',
                    isFeatured
                      ? 'bg-gradient-to-br from-primary/5 via-card to-card border-primary/20 hover:border-primary/40'
                      : 'bg-card border-border/50 hover:border-primary/30',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  )}
                  style={{
                    transitionDelay: isVisible ? `${(index + 2) * 100}ms` : '0ms',
                  }}
                >
                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                      Most Popular
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-500">
                    <IconComponent className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    {service.name}
                    <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description || 'Contact us for more details about this service.'}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
