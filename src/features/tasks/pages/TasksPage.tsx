import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTask, getTasks, updateTaskStatus } from '@/features/tasks/api/tasks-api';
import { useAuthStore } from '@/shared/store/auth-store';
import { canManageTasks } from '@/shared/lib/role-helper';
import {
  taskTypeLabels,
  priorityLabels,
  statusLabels,
  priorityBadgeVariant,
  statusBadgeVariant,
} from '@/shared/lib/task-labels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function TasksPage() {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const canManage = !!session && canManageTasks(session.role);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks({ pageSize: 100 }),
  });

  const cancelTask = useMutation({
    mutationFn: (id: string) => updateTaskStatus(id, 'Cancelled'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const removeTask = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tareas</h1>
        <p className="text-sm text-muted-foreground">
          Las tareas se crean desde un turno, en la sección "Turnos".
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las tareas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Cargando...</p>}
          {!isLoading && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead>Parcela / Cultivo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  {canManage && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks?.items.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.assigneeName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {task.plotName ?? '—'}
                      {task.cropName ? ` · ${task.cropName}` : ''}
                    </TableCell>
                    <TableCell>{taskTypeLabels[task.taskType] ?? task.taskType}</TableCell>
                    <TableCell>
                      <Badge variant={priorityBadgeVariant[task.priority] ?? 'outline'}>
                        {priorityLabels[task.priority] ?? task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[task.status] ?? 'outline'}>
                        {statusLabels[task.status] ?? task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{task.dueDate}</TableCell>
                    {canManage && (
                      <TableCell className="text-right">
                        {task.status === 'Pending' || task.status === 'InProgress' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelTask.mutate(task.id)}
                          >
                            Cancelar
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="sm" onClick={() => removeTask.mutate(task.id)}>
                          Eliminar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {tasks?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={canManage ? 8 : 7} className="text-center text-muted-foreground">
                      No hay tareas registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
