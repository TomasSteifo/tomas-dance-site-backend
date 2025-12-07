import { MainLayout } from '@/layouts/MainLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { ValuesSection } from '@/components/sections/ValuesSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { FAQSection } from '@/components/sections/FAQSection';
import { BookingSection } from '@/components/sections/BookingSection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ValuesSection />
      <ServicesSection />
      <TestimonialsSection />
      <GallerySection />
      <FAQSection />
      <BookingSection />
    </MainLayout>
  );
};

export default Index;
