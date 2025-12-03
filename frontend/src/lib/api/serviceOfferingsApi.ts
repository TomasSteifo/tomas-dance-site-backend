import { apiClient } from "./axiosClient";
import type { ServiceOfferingDto } from "../../types/serviceOffering";

export async function getAllServiceOfferings(): Promise<ServiceOfferingDto[]> {
  const response = await apiClient.get<ServiceOfferingDto[]>("/ServiceOfferings");
  return response.data;
}
