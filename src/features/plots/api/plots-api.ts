import { apiClient } from '@/shared/lib/api-client';
import type { Plot, PlotGeo, SoilAnalysis } from '@/shared/types/domain';

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

export async function getSoilAnalyses(plotId: string): Promise<SoilAnalysis[]> {
  const { data } = await apiClient.get<SoilAnalysis[]>(`/plots/${plotId}/soil-analyses`);
  return data;
}

export interface CreateSoilAnalysisInput {
  analyzedAt: string;
  ph?: number | null;
  nitrogenPct?: number | null;
  phosphorusPct?: number | null;
  potassiumPct?: number | null;
  organicMatterPct?: number | null;
  notes?: string | null;
}

export async function createSoilAnalysis(
  plotId: string,
  input: CreateSoilAnalysisInput,
): Promise<SoilAnalysis> {
  const { data } = await apiClient.post<SoilAnalysis>(`/plots/${plotId}/soil-analyses`, input);
  return data;
}
