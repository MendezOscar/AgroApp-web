import { apiClient } from '@/shared/lib/api-client';
import type { PendingCostActivity } from '@/shared/types/domain';

export async function getPendingCosts(farmId: string): Promise<PendingCostActivity[]> {
  const { data } = await apiClient.get<PendingCostActivity[]>(`/farms/${farmId}/pending-costs`);
  return data;
}

const costPathByActivityType: Record<PendingCostActivity['activityType'], string> = {
  Irrigation: 'irrigation',
  Fertilization: 'fertilization',
  Labor: 'labor',
};

export async function setActivityCost(
  activityType: PendingCostActivity['activityType'],
  cropId: string,
  id: string,
  cost: number,
): Promise<void> {
  await apiClient.patch(`/crops/${cropId}/${costPathByActivityType[activityType]}/${id}/cost`, {
    cost,
  });
}
