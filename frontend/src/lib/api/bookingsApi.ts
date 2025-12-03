import { apiClient } from "./axiosClient";
import type { CreateBookingDto, BookingDto } from "../../types/booking";

export async function createBooking(
  dto: CreateBookingDto
): Promise<BookingDto> {
  const response = await apiClient.post<BookingDto>("/Bookings", dto);
  return response.data;
}

export async function getAllBookings(): Promise<BookingDto[]> {
  const response = await apiClient.get<BookingDto[]>("/Bookings");
  return response.data;
}
