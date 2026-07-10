import { useQuery } from '@tanstack/react-query';
import { getPlots } from '@/features/plots/api/plots-api';
import { getCrops } from '@/features/crops/api/crops-api';
import { TASK_TYPES, TASK_PRIORITIES, taskTypeLabels, priorityLabels } from '@/shared/lib/task-labels';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Farm } from '@/shared/types/domain';

const CROP_RELATED_TYPES = ['Irrigation', 'Fertilization', 'Labor'];

export interface TaskRow {
  id: string;
  title: string;
  description: string;
  taskType: string;
  priority: string;
  farmId: string;
  plotId: string;
  cropId: string;
}

export const emptyTaskRow = (id: string): TaskRow => ({
  id,
  title: '',
  description: '',
  taskType: 'Other',
  priority: 'Medium',
  farmId: '',
  plotId: '',
  cropId: '',
});

interface TaskRowFieldsProps {
  row: TaskRow;
  index: number;
  farms: Farm[] | undefined;
  onChange: (patch: Partial<TaskRow>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function TaskRowFields({ row, index, farms, onChange, onRemove, canRemove }: TaskRowFieldsProps) {
  const { data: plots } = useQuery({
    queryKey: ['farm-plots', row.farmId],
    queryFn: () => getPlots(row.farmId),
    enabled: !!row.farmId,
  });

  const showCropSelect = CROP_RELATED_TYPES.includes(row.taskType);
  const { data: crops } = useQuery({
    queryKey: ['plot-crops', row.plotId],
    queryFn: () => getCrops(row.plotId),
    enabled: !!row.plotId && showCropSelect,
  });

  return (
    <div className="flex flex-col gap-3 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Tarea {index + 1}</span>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Quitar
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Título</Label>
        <Input value={row.title} onChange={(e) => onChange({ title: e.target.value })} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Descripción</Label>
        <Input value={row.description} onChange={(e) => onChange({ description: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Tipo</Label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={row.taskType}
            onChange={(e) => onChange({ taskType: e.target.value, cropId: '' })}
          >
            {TASK_TYPES.map((type) => (
              <option key={type} value={type}>
                {taskTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Prioridad</Label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={row.priority}
            onChange={(e) => onChange({ priority: e.target.value })}
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {priorityLabels[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Finca (opcional)</Label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={row.farmId}
            onChange={(e) => onChange({ farmId: e.target.value, plotId: '', cropId: '' })}
          >
            <option value="">—</option>
            {farms?.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Parcela (opcional)</Label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={row.plotId}
            onChange={(e) => onChange({ plotId: e.target.value, cropId: '' })}
            disabled={!row.farmId}
          >
            <option value="">—</option>
            {plots?.map((plot) => (
              <option key={plot.id} value={plot.id}>
                {plot.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showCropSelect && row.plotId && (
        <div className="flex flex-col gap-1.5">
          <Label>Cultivo (opcional)</Label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={row.cropId}
            onChange={(e) => onChange({ cropId: e.target.value })}
          >
            <option value="">—</option>
            {crops?.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.cropType}
                {crop.variety ? ` (${crop.variety})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
