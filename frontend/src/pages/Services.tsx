import { useState, useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Users, Calendar, Zap, Check, Loader2 } from 'lucide-react';
import { ServiceOfferingApi } from '@/lib/api';
import { ServiceOfferingDto, ServiceType } from '@/lib/api/types';
import { mockServices } from '@/lib/api/mockData';

// Map ServiceType enum to icon and features
const serviceTypeConfig: Record<ServiceType, { 
  icon: typeof User; 
  features: string[];
  duration: string;
}> = {
  [ServiceType.PrivateLesson]: {
    icon: User,
    features: [
      'Personalized curriculum',
      'Flexible scheduling',
      'Video analysis included',
      'Practice materials provided',
    ],
    duration: '60-90 minutes',
  },
  [ServiceType.Workshop]: {
    icon: Users,
    features: [
      'Small group sizes',
      'Topic-focused learning',
      'Partner rotation',
      'Social practice time',
    ],
    duration: '2-3 hours',
  },
  [ServiceType.EventBooking]: {
    icon: Calendar,
    features: [
      'Custom choreography',
      'Costume consultation',
      'Rehearsal sessions',
      'Day-of coordination',
    ],
    duration: 'Project-based',
  },
  [ServiceType.Bootcamp]: {
    icon: Zap,
    features: [
      'Immersive experience',
      'Multiple daily sessions',
      'Guest instructors',
      'Community building',
    ],
    duration: '2-4 days',
  },
  [ServiceType.Other]: {
    icon: Calendar,
    features: [
      'Custom experience',
      'Flexible format',
      'Personalized approach',
    ],
    duration: 'Varies',
  },
};

function formatPrice(basePriceSek: number | null): string {
  if (basePriceSek === null) return 'Custom quote';
  return `From ${basePriceSek} SEK`;
}

const Services = () => {
  const [services, setServices] = useState<ServiceOfferingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await ServiceOfferingApi.getAll();
        // Filter to only show active services
        setServices(data.filter((s) => s.isActive));
        setUsingMockData(false);
      } catch (err) {
        // Fallback to mock data when API is unavailable
        console.warn('API unavailable, using mock data:', err);
        setServices(mockServices);
        setUsingMockData(true);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Determine "featured" as first PrivateLesson
  const featuredId = services.find((s) => s.serviceType === ServiceType.PrivateLesson)?.id;

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
          {loading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-20">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading services...
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No services available at this time.</p>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service) => {
                const config = serviceTypeConfig[service.serviceType] || serviceTypeConfig[ServiceType.Other];
                const IconComponent = config.icon;
                const isFeatured = service.id === featuredId;
                const duration = service.durationMinutes 
                  ? `${service.durationMinutes} minutes` 
                  : config.duration;

                return (
                  <div
                    key={service.id}
                    className={`relative p-8 lg:p-10 rounded-3xl border transition-all duration-500 hover:shadow-card ${
                      isFeatured
                        ? 'bg-gradient-to-br from-primary/5 via-card to-card border-primary/20'
                        : 'bg-card border-border/50 hover:border-primary/30'
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                        Most Popular
                      </div>
                    )}

                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>

                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                      {service.name}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {service.description || 'Contact us for more details.'}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {config.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          {formatPrice(service.basePriceSek)}
                        </p>
                        <p className="text-sm text-muted-foreground">{duration}</p>
                      </div>
                      <Button variant={isFeatured ? 'hero' : 'outline'} asChild>
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
        </div>
      </section>
    </MainLayout>
  );
};

export default Services;
