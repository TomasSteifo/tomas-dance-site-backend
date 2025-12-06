// ============= Bookings API Module =============

import { apiClient, QueryParams } from './client';
import {
  BookingDto,
  BookingQueryParameters,
  CreateBookingDto,
  UpdateBookingDto,
} from './types';

const BASE_PATH = '/api/Bookings';

export const BookingApi = {
  getAll(): Promise<BookingDto[]> {
    return apiClient.get<BookingDto[]>(BASE_PATH);
  },

  search(params: BookingQueryParameters): Promise<BookingDto[]> {
    const query: QueryParams = {
      status: params.status ?? undefined,
      clientId: params.clientId ?? undefined,
      serviceOfferingId: params.serviceOfferingId ?? undefined,
      fromDate: params.fromDate ?? undefined,
      toDate: params.toDate ?? undefined,
      sortBy: params.sortBy ?? undefined,
      descending: params.descending ?? undefined,
    };
    return apiClient.get<BookingDto[]>(`${BASE_PATH}/search`, query);
  },

  getById(id: number): Promise<BookingDto> {
    return apiClient.get<BookingDto>(`${BASE_PATH}/${id}`);
  },

  create(payload: CreateBookingDto): Promise<BookingDto> {
    return apiClient.post<BookingDto>(BASE_PATH, payload);
  },

  update(id: number, payload: UpdateBookingDto): Promise<BookingDto> {
    return apiClient.put<BookingDto>(`${BASE_PATH}/${id}`, payload);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },
};

// Helper to convert local datetime-local input to UTC ISO string
export function toUtcIsoString(localDateTimeValue: string): string {
  return new Date(localDateTimeValue).toISOString();
}
