import { Link } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Private Class',
    description: 'One-on-one personalized instruction tailored to your goals.',
    price: '800',
    unit: '/ session',
    features: [
      '60-minute session',
      'Personalized curriculum',
      'Video feedback (optional)',
      'Flexible scheduling',
      'Progress tracking',
    ],
    cta: 'Book a Class',
    popular: false,
  },
  {
    name: 'Bootcamp',
    description: 'Intensive multi-day training to accelerate your progress.',
    price: '3,500',
    unit: '/ weekend',
    features: [
      '12+ hours of instruction',
      'Small group setting',
      'Technique deep-dives',
      'Social dancing practice',
      'Certificate of completion',
      'Networking with dancers',
    ],
    cta: 'Join Bootcamp',
    popular: true,
  },
  {
    name: 'Workshop',
    description: 'Focused group sessions on specific techniques or styles.',
    price: '350',
    unit: '/ person',
    features: [
      '3-hour workshop',
      'Themed content',
      'Group dynamics',
      'Q&A session',
      'Practice time included',
    ],
    cta: 'View Workshops',
    popular: false,
  },
  {
    name: 'Custom Package',
    description: 'Tailored solutions for events, choreography, or ongoing coaching.',
    price: 'Custom',
    unit: '',
    features: [
      'Wedding choreography',
      'Corporate events',
      'Performance coaching',
      'Multi-class packages',
      'Group private lessons',
      'Travel available',
    ],
    cta: 'Contact Me',
    popular: false,
  },
];

const Pricing = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-6">
              Pricing
            </span>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
              Invest in Your
              <span className="text-gradient block mt-2">Dance Journey</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transparent pricing for quality instruction. Choose the format that fits your goals and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-card rounded-3xl p-8 border transition-all duration-500 hover:shadow-card-hover ${
                  tier.popular
                    ? 'border-primary shadow-glow'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-button">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-semibold text-foreground">
                    {tier.price === 'Custom' ? '' : 'SEK '}
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">{tier.unit}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.popular ? 'hero' : 'outline'}
                  className="w-full group"
                  asChild
                >
                  <Link to={tier.name === 'Custom Package' ? '/contact' : '/book'}>
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              All prices are in Swedish Kronor (SEK). Package discounts available for multiple bookings.
            </p>
            <Button variant="ghost" asChild>
              <Link to="/contact" className="text-primary hover:text-primary/80">
                Have questions? Get in touch →
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Pricing;
