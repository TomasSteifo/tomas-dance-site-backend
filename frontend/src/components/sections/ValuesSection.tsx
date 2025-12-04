import { useEffect, useRef, useState } from 'react';
import { Sparkles, Music, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const values = [
  {
    icon: Sparkles,
    title: 'Clean Technique',
    description:
      'Build a solid foundation with precise footwork, body movement, and lead-follow fundamentals.',
  },
  {
    icon: Music,
    title: 'Musicality & Flow',
    description:
      'Learn to interpret the music, hit every instrument, and flow effortlessly with the rhythm.',
  },
  {
    icon: Heart,
    title: 'Connection & Confidence',
    description:
      'Develop authentic partner connection and the confidence to express yourself on any dance floor.',
  },
];

export function ValuesSection() {
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
    <section ref={sectionRef} className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className={cn(
              'text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-4 transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            What Sets Us Apart
          </h2>
          <p
            className={cn(
              'text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            Three pillars that define the Tomas Dance experience
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={cn(
                'group relative p-8 lg:p-10 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-card',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
              style={{
                transitionDelay: isVisible ? `${(index + 2) * 100}ms` : '0ms',
              }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <value.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
