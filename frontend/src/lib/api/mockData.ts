// ============= Fallback Mock Data =============
// Used when the backend API is unavailable (e.g., during demos or development without backend)

import { ServiceOfferingDto, ServiceType } from './types';

export const mockServices: ServiceOfferingDto[] = [
  {
    id: 1,
    name: 'Private Bachata Lessons',
    description: 'One-on-one instruction tailored to your skill level and goals. Perfect for beginners or those looking to refine their technique.',
    serviceType: ServiceType.PrivateLesson,
    basePriceSek: 800,
    durationMinutes: 60,
    isActive: true,
  },
  {
    id: 2,
    name: 'Group Workshops',
    description: 'Intensive workshops focusing on specific techniques, styling, or partner work. Great for meeting other dancers.',
    serviceType: ServiceType.Workshop,
    basePriceSek: 350,
    durationMinutes: 120,
    isActive: true,
  },
  {
    id: 3,
    name: 'Event & Wedding Choreography',
    description: 'Custom choreography for special occasions. Includes rehearsal sessions and day-of coordination.',
    serviceType: ServiceType.EventBooking,
    basePriceSek: 3500,
    durationMinutes: null,
    isActive: true,
  },
  {
    id: 4,
    name: 'Weekend Bootcamp',
    description: 'Immersive multi-day experience to accelerate your learning. Includes multiple daily sessions and social dancing.',
    serviceType: ServiceType.Bootcamp,
    basePriceSek: 2500,
    durationMinutes: null,
    isActive: true,
  },
];
