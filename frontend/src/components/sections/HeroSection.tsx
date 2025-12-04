import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div
          className="max-w-3xl mx-auto bg-card rounded-3xl p-10 md:p-16 shadow-card hover:shadow-card-hover transition-shadow duration-500 animate-float"
          style={{ animationDuration: '8s' }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Now accepting new students
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6 opacity-0 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Master the Art of
            <span className="text-gradient block mt-2">Bachata</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl opacity-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            Premium private classes designed to transform your technique,
            musicality, and connection. Dance with confidence.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <Button variant="hero" size="lg" asChild>
              <Link to="/book" className="group">
                Book a Private Class
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </div>
    </section>
  );
}
