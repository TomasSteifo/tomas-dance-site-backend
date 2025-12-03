import { apiClient } from "./axiosClient";

export interface CreateEventRequestPayload {
  organizerName: string;
  email: string;
  phone?: string;
  eventName: string;
  city: string;
  country: string;
  eventStartDate: string;
  eventEndDate?: string;
  requestType: string;
  numberOfWorkshops?: number;
  budget?: string;
  message?: string;
}

export async function createEventRequest(payload: CreateEventRequestPayload) {
  const response = await apiClient.post("/EventRequests", payload);
  return response.data;
}
