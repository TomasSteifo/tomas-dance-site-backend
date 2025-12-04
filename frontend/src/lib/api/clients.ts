import { apiClient } from "./client";
import { type ClientDto, type CreateClientDto, type UpdateClientDto } from "./types";

export const clientsApi = {
  getAll(): Promise<ClientDto[]> {
    return apiClient.get<ClientDto[]>("/api/Clients");
  },

  getById(id: number): Promise<ClientDto> {
    return apiClient.get<ClientDto>(`/api/Clients/${id}`);
  },

  create(payload: CreateClientDto): Promise<ClientDto> {
    return apiClient.post<ClientDto>("/api/Clients", payload);
  },

  update(id: number, payload: UpdateClientDto): Promise<ClientDto> {
    return apiClient.put<ClientDto>(`/api/Clients/${id}`, payload);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/Clients/${id}`);
  },
};
