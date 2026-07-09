import { apiClient } from '@/shared/lib/api-client';
import type { MonthlyCost, YieldHistoryPoint } from '@/shared/types/domain';

export async function getMonthlyCostHistory(months = 6): Promise<MonthlyCost[]> {
  const { data } = await apiClient.get<MonthlyCost[]>('/costs/monthly-history', {
    params: { months },
  });
  return data;
}

export async function getYieldHistory(farmId: string, months = 12): Promise<YieldHistoryPoint[]> {
  const { data } = await apiClient.get<YieldHistoryPoint[]>(`/farms/${farmId}/yield-history`, {
    params: { months },
  });
  return data;
}
