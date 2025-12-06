// ============= Clients API Module =============

import { apiClient } from './client';
import { ClientDto, CreateClientDto, UpdateClientDto } from './types';

const BASE_PATH = '/api/Clients';

export const ClientApi = {
  getAll(): Promise<ClientDto[]> {
    return apiClient.get<ClientDto[]>(BASE_PATH);
  },

  getById(id: number): Promise<ClientDto> {
    return apiClient.get<ClientDto>(`${BASE_PATH}/${id}`);
  },

  create(payload: CreateClientDto): Promise<ClientDto> {
    return apiClient.post<ClientDto>(BASE_PATH, payload);
  },

  update(id: number, payload: UpdateClientDto): Promise<ClientDto> {
    return apiClient.put<ClientDto>(`${BASE_PATH}/${id}`, payload);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },
};
