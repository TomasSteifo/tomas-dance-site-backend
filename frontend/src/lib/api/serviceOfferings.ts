import { apiClient } from "./client";
import {
  type CreateServiceOfferingDto,
  type ServiceOfferingDto,
  type UpdateServiceOfferingDto,
} from "./types";

export const serviceOfferingsApi = {
  getAll(): Promise<ServiceOfferingDto[]> {
    return apiClient.get<ServiceOfferingDto[]>("/api/ServiceOfferings");
  },

  getById(id: number): Promise<ServiceOfferingDto> {
    return apiClient.get<ServiceOfferingDto>(`/api/ServiceOfferings/${id}`);
  },

  create(payload: CreateServiceOfferingDto): Promise<ServiceOfferingDto> {
    return apiClient.post<ServiceOfferingDto>("/api/ServiceOfferings", payload);
  },

  update(id: number, payload: UpdateServiceOfferingDto): Promise<ServiceOfferingDto> {
    return apiClient.put<ServiceOfferingDto>(`/api/ServiceOfferings/${id}`, payload);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/ServiceOfferings/${id}`);
  },
};
