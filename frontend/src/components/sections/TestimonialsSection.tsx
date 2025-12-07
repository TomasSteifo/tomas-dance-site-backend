import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maria S.',
    role: 'Bachata student – Level 3',
    quote: 'Tomas completely transformed my technique. His attention to detail and patience made me feel confident on the dance floor in just a few weeks.',
  },
  {
    name: 'Carlos R.',
    role: 'Beginner student',
    quote: 'I had zero dance experience before starting with Tomas. Now I can lead confidently at social events. Best investment I\'ve made!',
  },
  {
    name: 'Emma L.',
    role: 'Advanced dancer',
    quote: 'Even as an experienced dancer, Tomas helped me refine subtle aspects of my musicality and connection. Truly next-level coaching.',
  },
  {
    name: 'David K.',
    role: 'Workshop participant',
    quote: 'The bootcamp was intense but incredibly rewarding. Tomas creates a supportive environment where you push your limits.',
  },
  {
    name: 'Sofia M.',
    role: 'Private class student',
    quote: 'The private classes fit perfectly into my busy schedule. Tomas adapts to your pace and goals – it\'s truly personalized.',
  },
  {
    name: 'James T.',
    role: 'Couple\'s class',
    quote: 'My partner and I took couples classes. Not only did our dancing improve, but we also learned to communicate better. Amazing experience!',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-glow opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-4">
            Student Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            What Students Are Saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from dancers who have transformed their skills with private coaching.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-8 border border-border hover:border-primary/30 shadow-card hover:shadow-card-hover transition-all duration-500 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4 group-hover:text-primary/40 transition-colors" />
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
