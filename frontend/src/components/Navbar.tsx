import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Book Lesson', path: '/book' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-foreground hover:text-primary transition-colors duration-300"
        >
          Tomas Dance
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                location.pathname === link.path
                  ? 'text-foreground bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button variant="hero" size="sm" asChild>
            <Link to="/book">Book Now</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden transition-all duration-300',
          isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container mx-auto px-6 py-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-3 text-base font-medium rounded-xl transition-all duration-300',
                location.pathname === link.path
                  ? 'text-foreground bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button variant="hero" className="mt-4" asChild>
            <Link to="/book">Book Now</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
