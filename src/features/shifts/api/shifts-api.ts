import { apiClient } from '@/shared/lib/api-client';
import type { TaskOccurrence, TaskTemplate } from '@/shared/types/domain';

export async function getTaskTemplates(): Promise<TaskTemplate[]> {
  const { data } = await apiClient.get<TaskTemplate[]>('/shifts/templates');
  return data;
}

export interface CreateTaskTemplateInput {
  plotId?: string | null;
  cropId?: string | null;
  title: string;
  description?: string | null;
  taskType: string;
  priority: string;
  shift: string;
  recurrenceType: string;
  weekDays?: string | null;
  startDate: string;
  endDate?: string | null;
  requiredPhenologyStage?: string | null;
}

export async function createTaskTemplate(input: CreateTaskTemplateInput): Promise<TaskTemplate> {
  const { data } = await apiClient.post<TaskTemplate>('/shifts/templates', input);
  return data;
}

export async function getOccurrences(params?: {
  date?: string;
  onlyMine?: boolean;
}): Promise<TaskOccurrence[]> {
  const { data } = await apiClient.get<TaskOccurrence[]>('/shifts/occurrences', { params });
  return data;
}

export async function assignOccurrence(
  id: string,
  assignedTo: string,
  shift?: string | null,
): Promise<TaskOccurrence> {
  const { data } = await apiClient.patch<TaskOccurrence>(`/shifts/occurrences/${id}/assign`, {
    assignedTo,
    shift,
  });
  return data;
}

export async function updateOccurrenceStatus(
  id: string,
  status: string,
  notes?: string | null,
): Promise<TaskOccurrence> {
  const { data } = await apiClient.patch<TaskOccurrence>(`/shifts/occurrences/${id}/status`, {
    status,
    notes,
  });
  return data;
}
