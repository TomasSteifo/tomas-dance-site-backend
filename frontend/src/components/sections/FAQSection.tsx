import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Do I need any prior dance experience?',
    answer: 'Not at all! I welcome students of all levels, from complete beginners to advanced dancers. Private classes are tailored to your current skill level and goals.',
  },
  {
    question: 'What should I wear to a class?',
    answer: 'Comfortable clothing that allows you to move freely. For shoes, flat or low-heeled dance shoes work best. Avoid sneakers with rubber soles as they can stick to the floor.',
  },
  {
    question: 'How long is a typical private class?',
    answer: 'Standard private classes are 60 minutes. I also offer 90-minute intensive sessions for those who want deeper focus on technique or choreography.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 24 hours or more before your scheduled class receive a full refund or reschedule. Cancellations within 24 hours may be subject to a 50% fee. No-shows are non-refundable.',
  },
  {
    question: 'Do you offer package deals?',
    answer: 'Yes! I offer packages of 5 and 10 classes at discounted rates. Contact me for current pricing and to discuss which package suits your goals.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'I accept credit/debit cards, bank transfers, and Swish. Payment is due at the time of booking to secure your spot.',
  },
  {
    question: 'Can I bring a partner to classes?',
    answer: 'Absolutely! Couples classes are a great way to learn together. The per-person rate may be adjusted for couples – ask me for details.',
  },
  {
    question: 'What languages do you teach in?',
    answer: 'I teach in English and Swedish. If you have specific language requirements, let me know and we can discuss options.',
  },
];

export function FAQSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know before booking your first class.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-2xl border border-border px-6 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary py-6 [&[data-state=open]>svg]:rotate-180">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
