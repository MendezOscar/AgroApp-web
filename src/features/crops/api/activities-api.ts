import { apiClient } from '@/shared/lib/api-client';
import type { Fertilization, Irrigation, Labor, PagedResult } from '@/shared/types/domain';

export async function getIrrigations(cropId: string, pageSize = 50): Promise<Irrigation[]> {
  const { data } = await apiClient.get<PagedResult<Irrigation>>(`/crops/${cropId}/irrigation`, {
    params: { pageSize },
  });
  return data.items;
}

export async function getFertilizations(cropId: string, pageSize = 50): Promise<Fertilization[]> {
  const { data } = await apiClient.get<PagedResult<Fertilization>>(`/crops/${cropId}/fertilization`, {
    params: { pageSize },
  });
  return data.items;
}

export async function getLabors(cropId: string, pageSize = 50): Promise<Labor[]> {
  const { data } = await apiClient.get<PagedResult<Labor>>(`/crops/${cropId}/labor`, {
    params: { pageSize },
  });
  return data.items;
}
