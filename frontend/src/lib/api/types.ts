// ============= Backend DTOs & Enums =============

// Enums (matching C# backend)
export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
  Completed = 3,
}

export enum ClientType {
  Organizer = 1,
  Student = 2,
  Other = 3,
}

export enum LocationType {
  OnSite = 1,
  AtVenue = 2,
  Online = 3,
}

export enum ServiceType {
  PrivateLesson = 1,
  EventBooking = 2,
  Workshop = 3,
  Bootcamp = 4,
  Other = 5,
}

// Client DTOs
export interface ClientDto {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  createdAtUtc: string; // ISO 8601
}

export interface CreateClientDto {
  fullName: string;
  email: string;
  phone?: string | null;
}

export interface UpdateClientDto {
  fullName: string;
  email: string;
  phone?: string | null;
}

// Service Offering DTOs
export interface ServiceOfferingDto {
  id: number;
  name: string;
  description: string | null;
  serviceType: ServiceType;
  basePriceSek: number | null;
  durationMinutes: number | null;
  isActive: boolean;
}

export interface CreateServiceOfferingDto {
  name: string;
  description?: string | null;
  serviceType: ServiceType;
  basePriceSek?: number | null;
  durationMinutes?: number | null;
}

export interface UpdateServiceOfferingDto {
  name: string;
  description?: string | null;
  serviceType: ServiceType;
  basePriceSek?: number | null;
  durationMinutes?: number | null;
  isActive: boolean;
}

// Booking DTOs
export interface BookingDto {
  id: number;
  clientId: number;
  serviceOfferingId: number;
  preferredDateTime: string; // ISO 8601 UTC
  locationDetails: string | null;
  message: string | null;
  status: BookingStatus;
  createdAtUtc: string; // ISO 8601 UTC
}

export interface CreateBookingDto {
  clientId: number;
  serviceOfferingId: number;
  preferredDateTime: string; // ISO 8601 UTC
  locationDetails?: string | null;
  message?: string | null;
}

export interface UpdateBookingDto {
  preferredDateTime?: string | null; // ISO 8601 UTC
  locationDetails?: string | null;
  message?: string | null;
  status?: BookingStatus | null;
}

export interface BookingQueryParameters {
  status?: BookingStatus | null;
  clientId?: number | null;
  serviceOfferingId?: number | null;
  fromDate?: string | null; // ISO 8601 UTC
  toDate?: string | null; // ISO 8601 UTC
  sortBy?: 'date' | 'created' | 'status' | null;
  descending?: boolean | null;
}
