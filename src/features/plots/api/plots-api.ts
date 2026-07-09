import { apiClient } from '@/shared/lib/api-client';
import type { Plot, PlotGeo } from '@/shared/types/domain';

export async function getPlots(farmId: string): Promise<Plot[]> {
  const { data } = await apiClient.get<Plot[]>(`/farms/${farmId}/plots`);
  return data;
}

export async function getPlot(farmId: string, plotId: string): Promise<Plot> {
  const { data } = await apiClient.get<Plot>(`/farms/${farmId}/plots/${plotId}`);
  return data;
}

export async function getFarmPlotsGeo(farmId: string): Promise<PlotGeo[]> {
  const { data } = await apiClient.get<PlotGeo[]>(`/farms/${farmId}/plots/geo`);
  return data;
}
