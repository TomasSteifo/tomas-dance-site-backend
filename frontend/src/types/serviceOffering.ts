export interface ServiceOfferingDto {
  id: number;
  name: string;
  description?: string;
  basePriceSek?: number;
  durationMinutes?: number;
  isActive?: boolean;
}
