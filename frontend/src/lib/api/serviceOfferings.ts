// ============= Service Offerings API Module =============

import { apiClient } from './client';
import {
  ServiceOfferingDto,
  CreateServiceOfferingDto,
  UpdateServiceOfferingDto,
} from './types';

const BASE_PATH = '/api/ServiceOfferings';

export const ServiceOfferingApi = {
  getAll(): Promise<ServiceOfferingDto[]> {
    return apiClient.get<ServiceOfferingDto[]>(BASE_PATH);
  },

  getById(id: number): Promise<ServiceOfferingDto> {
    return apiClient.get<ServiceOfferingDto>(`${BASE_PATH}/${id}`);
  },

  create(payload: CreateServiceOfferingDto): Promise<ServiceOfferingDto> {
    return apiClient.post<ServiceOfferingDto>(BASE_PATH, payload);
  },

  update(id: number, payload: UpdateServiceOfferingDto): Promise<ServiceOfferingDto> {
    return apiClient.put<ServiceOfferingDto>(`${BASE_PATH}/${id}`, payload);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },
};
