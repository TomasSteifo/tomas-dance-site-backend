import { MainLayout } from '@/layouts/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Globe, Heart, Users } from 'lucide-react';

const stats = [
  { value: '10+', label: 'Years Teaching' },
  { value: '500+', label: 'Students Trained' },
  { value: '20+', label: 'Countries Visited' },
  { value: '50+', label: 'Events Performed' },
];

const About = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
                About Tomas
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Passionate about bachata and dedicated to helping dancers of all
                levels discover their potential on the dance floor.
              </p>
              <Button variant="hero" asChild>
                <Link to="/book" className="group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Placeholder for photo */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-primary/10 via-secondary to-accent/10 flex items-center justify-center">
                <span className="text-muted-foreground">Photo coming soon</span>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-semibold text-gradient mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
              My Journey
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                My love affair with bachata began over a decade ago in a small
                dance studio. What started as a way to stay active quickly became
                a lifelong passion that has taken me around the world.
              </p>
              <p>
                Over the years, I've trained with some of the best dancers and
                instructors in the bachata community, constantly refining my
                technique and teaching methodology. My approach combines
                traditional fundamentals with modern sensual bachata styling.
              </p>
              <p>
                Today, I'm dedicated to sharing this beautiful art form with
                students of all levels. Whether you're taking your first steps or
                preparing for a performance, I believe everyone can dance with
                confidence and joy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-16">
            Teaching Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Excellence',
                description: 'Committed to the highest standards of instruction.',
              },
              {
                icon: Heart,
                title: 'Passion',
                description: 'Every lesson is infused with genuine love for dance.',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Building connections through shared dance experiences.',
              },
              {
                icon: Globe,
                title: 'Culture',
                description: 'Honoring the rich traditions of bachata music and dance.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
