import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  assignOccurrence,
  createTaskTemplate,
  getOccurrences,
  getTaskTemplates,
  updateOccurrenceStatus,
} from '@/features/shifts/api/shifts-api';
import { getFarms } from '@/features/farms/api/farms-api';
import { getUsers } from '@/features/users/api/users-api';
import { groupTemplatesIntoTurnos } from '@/features/shifts/lib/group-templates';
import { emptyTaskRow, TaskRowFields, type TaskRow } from '@/features/shifts/components/TaskRowFields';
import { useAuthStore } from '@/shared/store/auth-store';
import { canManageTasks } from '@/shared/lib/role-helper';
import {
  SHIFTS,
  RECURRENCE_TYPES,
  taskTypeLabels,
  priorityLabels,
  statusLabels,
  shiftLabels,
  recurrenceLabels,
  weekDayOptions,
  priorityBadgeVariant,
  statusBadgeVariant,
} from '@/shared/lib/task-labels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const todayIso = () => new Date().toISOString().slice(0, 10);
const newRowId = () => `row-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const emptyShiftForm = {
  shift: 'Day',
  recurrenceType: 'Once',
  weekDays: [] as number[],
  startDate: '',
  endDate: '',
};

export function ShiftsPage() {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const canManage = !!session && canManageTasks(session.role);

  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState(emptyShiftForm);
  const [taskRows, setTaskRows] = useState<TaskRow[]>([emptyTaskRow(newRowId())]);
  const [occurrenceDate, setOccurrenceDate] = useState(todayIso());

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['task-templates'],
    queryFn: getTaskTemplates,
  });

  const { data: occurrences, isLoading: occurrencesLoading } = useQuery({
    queryKey: ['occurrences', occurrenceDate],
    queryFn: () => getOccurrences({ date: occurrenceDate }),
  });

  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: farms } = useQuery({ queryKey: ['farms'], queryFn: getFarms, enabled: shiftDialogOpen });

  const createTurno = useMutation({
    mutationFn: async () => {
      for (const row of taskRows) {
        await createTaskTemplate({
          plotId: row.plotId || null,
          cropId: row.cropId || null,
          title: row.title,
          description: row.description || null,
          taskType: row.taskType,
          priority: row.priority,
          shift: shiftForm.shift,
          recurrenceType: shiftForm.recurrenceType,
          weekDays: shiftForm.recurrenceType === 'Weekly' ? shiftForm.weekDays.join(',') : null,
          startDate: shiftForm.startDate,
          endDate: shiftForm.endDate || null,
          requiredPhenologyStage: row.requiredPhenologyStage || null,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-templates'] });
      queryClient.invalidateQueries({ queryKey: ['occurrences'] });
      setShiftDialogOpen(false);
      setShiftForm(emptyShiftForm);
      setTaskRows([emptyTaskRow(newRowId())]);
    },
  });

  const assign = useMutation({
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) => assignOccurrence(id, assignedTo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['occurrences'] }),
  });

  const cancelOccurrence = useMutation({
    mutationFn: (id: string) => updateOccurrenceStatus(id, 'Cancelled'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['occurrences'] }),
  });

  function toggleWeekDay(iso: number) {
    setShiftForm((f) => ({
      ...f,
      weekDays: f.weekDays.includes(iso) ? f.weekDays.filter((d) => d !== iso) : [...f.weekDays, iso],
    }));
  }

  function updateRow(index: number, patch: Partial<TaskRow>) {
    setTaskRows((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  const turnoGroups = groupTemplatesIntoTurnos(templates ?? []);
  const dayOccurrences = occurrences?.filter((o) => o.shift === 'Day') ?? [];
  const nightOccurrences = occurrences?.filter((o) => o.shift === 'Night') ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Turnos</h1>
        {canManage && (
          <Dialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen}>
            <DialogTrigger asChild>
              <Button>+ Nuevo turno</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nuevo turno</DialogTitle>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  createTurno.mutate();
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="shift-type">Turno</Label>
                    <select
                      id="shift-type"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                      value={shiftForm.shift}
                      onChange={(e) => setShiftForm({ ...shiftForm, shift: e.target.value })}
                    >
                      {SHIFTS.map((s) => (
                        <option key={s} value={s}>
                          {shiftLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="shift-recurrence">Recurrencia</Label>
                    <select
                      id="shift-recurrence"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                      value={shiftForm.recurrenceType}
                      onChange={(e) => setShiftForm({ ...shiftForm, recurrenceType: e.target.value })}
                    >
                      {RECURRENCE_TYPES.map((r) => (
                        <option key={r} value={r}>
                          {recurrenceLabels[r]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {shiftForm.recurrenceType === 'Weekly' && (
                  <div className="flex flex-col gap-1.5">
                    <Label>Días de la semana</Label>
                    <div className="flex gap-2">
                      {weekDayOptions.map((d) => (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => toggleWeekDay(d.iso)}
                          className={`rounded-md border px-2 py-1 text-xs ${
                            shiftForm.weekDays.includes(d.iso)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="shift-start">Fecha inicio</Label>
                    <Input
                      id="shift-start"
                      type="date"
                      value={shiftForm.startDate}
                      onChange={(e) => setShiftForm({ ...shiftForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="shift-end">
                      Fecha fin {shiftForm.recurrenceType === 'Once' ? '(opcional)' : ''}
                    </Label>
                    <Input
                      id="shift-end"
                      type="date"
                      value={shiftForm.endDate}
                      onChange={(e) => setShiftForm({ ...shiftForm, endDate: e.target.value })}
                      required={shiftForm.recurrenceType !== 'Once'}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Tareas de este turno</Label>
                  {taskRows.map((row, index) => (
                    <TaskRowFields
                      key={row.id}
                      row={row}
                      index={index}
                      farms={farms}
                      canRemove={taskRows.length > 1}
                      onChange={(patch) => updateRow(index, patch)}
                      onRemove={() => setTaskRows((rows) => rows.filter((_, i) => i !== index))}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTaskRows((rows) => [...rows, emptyTaskRow(newRowId())])}
                  >
                    + Agregar tarea
                  </Button>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={createTurno.isPending}>
                    {createTurno.isPending ? 'Creando...' : 'Crear turno'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Turnos programados</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {templatesLoading && <p className="text-muted-foreground">Cargando...</p>}
          {!templatesLoading && turnoGroups.length === 0 && (
            <p className="text-muted-foreground">No hay turnos registrados.</p>
          )}
          {turnoGroups.map((group) => (
            <div key={group.key} className="rounded-md border">
              <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-2">
                <Badge variant={group.shift === 'Day' ? 'default' : 'secondary'}>
                  {shiftLabels[group.shift] ?? group.shift}
                </Badge>
                <span className="text-sm font-medium">
                  {recurrenceLabels[group.recurrenceType] ?? group.recurrenceType}
                </span>
                <span className="text-sm text-muted-foreground">
                  {group.startDate}
                  {group.endDate ? ` → ${group.endDate}` : ''}
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarea</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Parcela / Cultivo</TableHead>
                    <TableHead className="text-right">Ocurrencias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.title}</TableCell>
                      <TableCell>{taskTypeLabels[template.taskType] ?? template.taskType}</TableCell>
                      <TableCell>
                        <Badge variant={priorityBadgeVariant[template.priority] ?? 'outline'}>
                          {priorityLabels[template.priority] ?? template.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {template.plotName ?? '—'}
                        {template.cropName ? ` · ${template.cropName}` : ''}
                        {template.requiredPhenologyStage
                          ? ` · solo en ${template.requiredPhenologyStage}`
                          : ''}
                      </TableCell>
                      <TableCell className="text-right">{template.occurrenceCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Asignación por día</CardTitle>
          <Input
            type="date"
            value={occurrenceDate}
            onChange={(e) => setOccurrenceDate(e.target.value)}
            className="w-auto"
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {occurrencesLoading && <p className="text-muted-foreground">Cargando...</p>}
          {!occurrencesLoading &&
            (
              [
                { label: 'Turno Diurno', items: dayOccurrences },
                { label: 'Turno Nocturno', items: nightOccurrences },
              ] as const
            ).map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground">{group.label}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarea</TableHead>
                      <TableHead>Parcela / Cultivo</TableHead>
                      <TableHead>Asignado a</TableHead>
                      <TableHead>Estado</TableHead>
                      {canManage && <TableHead className="text-right">Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((occ) => (
                      <TableRow key={occ.id}>
                        <TableCell>{occ.templateTitle}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {occ.plotName ?? '—'}
                          {occ.cropName ? ` · ${occ.cropName}` : ''}
                        </TableCell>
                        <TableCell>
                          {canManage ? (
                            <select
                              className="rounded-md border bg-background px-2 py-1 text-sm"
                              value={occ.assignedTo ?? ''}
                              onChange={(e) => assign.mutate({ id: occ.id, assignedTo: e.target.value })}
                            >
                              <option value="">Sin asignar</option>
                              {users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            (occ.assigneeName ?? 'Sin asignar')
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant[occ.status] ?? 'outline'}>
                            {statusLabels[occ.status] ?? occ.status}
                          </Badge>
                        </TableCell>
                        {canManage && (
                          <TableCell className="text-right">
                            {(occ.status === 'Pending' || occ.status === 'InProgress') && (
                              <Button variant="ghost" size="sm" onClick={() => cancelOccurrence.mutate(occ.id)}>
                                Cancelar
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {group.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={canManage ? 5 : 4} className="text-center text-muted-foreground">
                          Sin tareas programadas.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
