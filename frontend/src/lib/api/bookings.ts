import { apiClient } from "./client";
import {
  type BookingDto,
  type BookingQueryParameters,
  type CreateBookingDto,
  type UpdateBookingDto,
} from "./types";

export const bookingsApi = {
  getAll(): Promise<BookingDto[]> {
    return apiClient.get<BookingDto[]>("/api/Bookings");
  },

  search(params: BookingQueryParameters): Promise<BookingDto[]> {
    const query = {
      status: params.Status,
      clientId: params.ClientId,
      serviceOfferingId: params.ServiceOfferingId,
      fromDate: params.FromDate,
      toDate: params.ToDate,
      sortBy: params.SortBy,
      descending: params.Descending,
    };

    return apiClient.get<BookingDto[]>("/api/Bookings/search", query);
  },

  getById(id: number): Promise<BookingDto> {
    return apiClient.get<BookingDto>(`/api/Bookings/${id}`);
  },

  create(payload: CreateBookingDto): Promise<BookingDto> {
    return apiClient.post<BookingDto>("/api/Bookings", payload);
  },

  update(id: number, payload: UpdateBookingDto): Promise<BookingDto> {
    return apiClient.put<BookingDto>(`/api/Bookings/${id}`, payload);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/Bookings/${id}`);
  },
};
