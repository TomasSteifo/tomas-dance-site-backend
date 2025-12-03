export interface CreateBookingDto {
  clientId: number;
  serviceOfferingId: number;
  /** ISO string in UTC when we send it to the backend */
  preferredDateTime: string;
  locationDetails?: string;
  message?: string;
}

// Minimal shape of BookingDto that we care about on the frontend
export interface BookingDto {
  id: number;
  clientId: number;
  serviceOfferingId: number;
  startTimeUtc: string;
  createdAt?: string;
  clientName?: string;
  locationDetails?: string;
  message?: string;
  status?: string;
}
