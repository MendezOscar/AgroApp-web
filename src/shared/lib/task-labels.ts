export const TASK_TYPES = ['Irrigation', 'Fertilization', 'Labor', 'Inspection', 'Sensor', 'Other'] as const;
// Estas tareas se completan registrando la actividad correspondiente (ver
// UpdateOccurrenceStatusCommandHandler en el backend), lo cual exige un
// cultivo asociado (IrrigationLog/FertilizationLog/LaborLog.CropId no es nulo).
export const CROP_RELATED_TASK_TYPES = ['Irrigation', 'Fertilization', 'Labor'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;
export const TASK_STATUSES = ['Pending', 'InProgress', 'Completed', 'Cancelled'] as const;
export const SHIFTS = ['Day', 'Night'] as const;
export const RECURRENCE_TYPES = ['Once', 'Daily', 'Weekly', 'DateRange'] as const;

export const taskTypeLabels: Record<string, string> = {
  Irrigation: 'Riego',
  Fertilization: 'Fertilización',
  Labor: 'Labor',
  Inspection: 'Inspección',
  Sensor: 'Sensor',
  Other: 'Otro',
};

export const priorityLabels: Record<string, string> = {
  Low: 'Baja',
  Medium: 'Media',
  High: 'Alta',
  Urgent: 'Urgente',
};

export const statusLabels: Record<string, string> = {
  Pending: 'Pendiente',
  InProgress: 'En progreso',
  Completed: 'Completada',
  Cancelled: 'Cancelada',
};

export const shiftLabels: Record<string, string> = {
  Day: 'Diurno',
  Night: 'Nocturno',
};

export const recurrenceLabels: Record<string, string> = {
  Once: 'Una sola vez',
  Daily: 'Todos los días',
  Weekly: 'Días específicos',
  DateRange: 'Rango de fechas',
};

export const weekDayOptions = [
  { iso: 1, label: 'Lun' },
  { iso: 2, label: 'Mar' },
  { iso: 3, label: 'Mié' },
  { iso: 4, label: 'Jue' },
  { iso: 5, label: 'Vie' },
  { iso: 6, label: 'Sáb' },
  { iso: 7, label: 'Dom' },
];

export const priorityBadgeVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Low: 'outline',
  Medium: 'secondary',
  High: 'default',
  Urgent: 'destructive',
};

export const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Pending: 'outline',
  InProgress: 'secondary',
  Completed: 'default',
  Cancelled: 'destructive',
};
