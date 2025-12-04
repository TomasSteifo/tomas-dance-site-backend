import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BookingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-glow opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Card */}
          <div
            className={cn(
              'relative bg-card rounded-3xl p-10 md:p-16 shadow-card overflow-hidden transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            )}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative">
              {/* Label */}
              <span className="inline-block text-sm font-medium text-primary uppercase tracking-wider mb-4">
                Start Your Journey
              </span>

              {/* Heading */}
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
                Ready to Transform
                <br />
                Your Dance?
              </h2>

              {/* Description */}
              <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
                Book your first private lesson and experience the difference of
                personalized instruction. Flexible scheduling, all levels welcome.
              </p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Flexible Scheduling</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>60-90 Min Sessions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Multiple Locations</span>
                </div>
              </div>

              {/* CTA */}
              <Button variant="hero" size="lg" asChild>
                <Link to="/book" className="group">
                  Book Your Lesson
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
