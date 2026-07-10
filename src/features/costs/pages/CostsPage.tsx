import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPendingCosts, setActivityCost } from '@/features/costs/api/costs-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { PendingCostActivity } from '@/shared/types/domain';

const activityLabels: Record<PendingCostActivity['activityType'], string> = {
  Irrigation: 'Riego',
  Fertilization: 'Fertilización',
  Labor: 'Labor',
};

export function CostsPage() {
  const { farmId } = useParams<{ farmId: string }>();
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const { data: activities, isLoading } = useQuery({
    queryKey: ['pending-costs', farmId],
    queryFn: () => getPendingCosts(farmId!),
    enabled: !!farmId,
  });

  const saveCost = useMutation({
    mutationFn: ({ activity, cost }: { activity: PendingCostActivity; cost: number }) =>
      setActivityCost(activity.activityType, activity.cropId, activity.id, cost),
    onSuccess: (_data, { activity }) => {
      queryClient.invalidateQueries({ queryKey: ['pending-costs', farmId] });
      setDrafts((d) => {
        const next = { ...d };
        delete next[activity.id];
        return next;
      });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Costos pendientes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Actividades sin costo registrado</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Cargando...</p>}
          {!isLoading && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cultivo</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Costo (L.)</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities?.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activityLabels[activity.activityType]}</TableCell>
                    <TableCell>{activity.cropType}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.plotName ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        step="0.01"
                        className="w-28 text-right"
                        value={drafts[activity.id] ?? ''}
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [activity.id]: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={!drafts[activity.id] || saveCost.isPending}
                        onClick={() =>
                          saveCost.mutate({ activity, cost: Number(drafts[activity.id]) })
                        }
                      >
                        Guardar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {activities?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No hay actividades pendientes de costo.
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
