import { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Send, Instagram, Youtube, Loader2, CheckCircle } from 'lucide-react';
import { ContactApi } from '@/lib/api/contact';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@tomasdance.com',
    href: 'mailto:hello@tomasdance.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+46 70 123 4567',
    href: 'tel:+46701234567',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Stockholm, Sweden',
    href: '#',
  },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Email must be less than 255 characters';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const response = await ContactApi.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        message: formData.message.trim(),
      });
      
      if (response.success) {
        setSubmitted(true);
        toast.success(response.message);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions? Want to discuss a custom project? I'd love to hear
              from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-8">
                Contact Information
              </h2>

              <div className="space-y-6 mb-12">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-foreground font-medium">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-4">
                  Follow Me
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-8">
                Send a Message
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thanks for reaching out! I'll get back to you soon.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.name ? 'border-destructive' : 'border-border'
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.email ? 'border-destructive' : 'border-border'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="+46 70 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[160px] resize-none ${
                        errors.message ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="Your message..."
                    />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
