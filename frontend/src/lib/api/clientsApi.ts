import { apiClient } from "./axiosClient";
import type { CreateClientDto, ClientDto } from "../../types/client";

export async function createClient(
  dto: CreateClientDto
): Promise<ClientDto> {
  const response = await apiClient.post<ClientDto>("/Clients", dto);
  return response.data;
}
