import { apiClient } from '@/shared/lib/api-client';
import type { Farm, FarmSummary } from '@/shared/types/domain';

export async function getFarms(): Promise<Farm[]> {
  const { data } = await apiClient.get<Farm[]>('/Farms');
  return data;
}

export async function getFarm(farmId: string): Promise<Farm> {
  const { data } = await apiClient.get<Farm>(`/Farms/${farmId}`);
  return data;
}

export async function getFarmSummary(farmId: string): Promise<FarmSummary> {
  const { data } = await apiClient.get<FarmSummary>(`/farms/${farmId}/summary`);
  return data;
}
