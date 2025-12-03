export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
}

export interface ClientDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  clientType?: number;
  notes?: string;
}
