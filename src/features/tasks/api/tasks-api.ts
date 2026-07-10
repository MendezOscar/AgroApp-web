import { apiClient } from '@/shared/lib/api-client';
import type { PagedResult, Task } from '@/shared/types/domain';

export async function getTasks(params?: {
  onlyMine?: boolean;
  status?: string;
  pageSize?: number;
}): Promise<PagedResult<Task>> {
  const { data } = await apiClient.get<PagedResult<Task>>('/tasks', { params });
  return data;
}

export interface CreateTaskInput {
  assignedTo: string;
  plotId?: string | null;
  cropId?: string | null;
  title: string;
  description?: string | null;
  priority: string;
  taskType: string;
  dueDate: string;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data } = await apiClient.post<Task>('/tasks', input);
  return data;
}

export async function updateTaskStatus(id: string, status: string, notes?: string | null): Promise<Task> {
  const { data } = await apiClient.patch<Task>(`/tasks/${id}/status`, { status, notes });
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}
