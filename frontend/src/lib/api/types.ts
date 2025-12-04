// Shared DTOs and enums that mirror the backend contracts

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

export interface ClientDto {
  Id: number;
  FullName: string;
  Email: string;
  Phone: string | null;
  CreatedAtUtc: string;
}

export interface CreateClientDto {
  FullName: string;
  Email: string;
  Phone: string | null | undefined;
}

export interface UpdateClientDto {
  FullName: string;
  Email: string;
  Phone: string | null | undefined;
}

export interface ServiceOfferingDto {
  Id: number;
  Name: string;
  Description: string | null;
  ServiceType: ServiceType;
  BasePriceSek: number | null;
  DurationMinutes: number | null;
  IsActive: boolean;
}

export interface CreateServiceOfferingDto {
  Name: string;
  Description: string | null | undefined;
  ServiceType: ServiceType;
  BasePriceSek: number | null | undefined;
  DurationMinutes: number | null | undefined;
}

export interface UpdateServiceOfferingDto {
  Name: string;
  Description: string | null | undefined;
  ServiceType: ServiceType;
  BasePriceSek: number | null | undefined;
  DurationMinutes: number | null | undefined;
  IsActive: boolean;
}

export interface BookingDto {
  Id: number;
  ClientId: number;
  ServiceOfferingId: number;
  PreferredDateTime: string;
  LocationDetails: string | null;
  Message: string | null;
  Status: BookingStatus;
  CreatedAtUtc: string;
}

export interface CreateBookingDto {
  ClientId: number;
  ServiceOfferingId: number;
  PreferredDateTime: string;
  LocationDetails: string | null | undefined;
  Message: string | null | undefined;
}

export interface UpdateBookingDto {
  PreferredDateTime: string | null | undefined;
  LocationDetails: string | null | undefined;
  Message: string | null | undefined;
  Status: BookingStatus | null | undefined;
}

export interface BookingQueryParameters {
  Status?: BookingStatus | null;
  ClientId?: number | null;
  ServiceOfferingId?: number | null;
  FromDate?: string | null;
  ToDate?: string | null;
  SortBy?: string | null;
  Descending: boolean;
}
