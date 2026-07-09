import { apiClient } from '@/shared/lib/api-client';
import type { Crop, CropComparison, CropPrediction } from '@/shared/types/domain';

export async function getCrops(plotId: string): Promise<Crop[]> {
  const { data } = await apiClient.get<Crop[]>(`/plots/${plotId}/crops`);
  return data;
}

export async function getCropPrediction(plotId: string, cropId: string): Promise<CropPrediction> {
  const { data } = await apiClient.get<CropPrediction>(`/plots/${plotId}/crops/${cropId}/prediction`);
  return data;
}

export async function getCropComparison(farmId: string): Promise<CropComparison[]> {
  const { data } = await apiClient.get<CropComparison[]>(`/farms/${farmId}/crops/comparison`);
  return data;
}
