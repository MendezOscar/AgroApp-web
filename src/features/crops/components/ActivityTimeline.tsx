import { useQuery } from '@tanstack/react-query';
import { getFertilizations, getIrrigations, getLabors } from '@/features/crops/api/activities-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ActivityTimelineProps {
  cropId: string;
}

interface ActivityRow {
  id: string;
  type: 'Riego' | 'Fertilización' | 'Labor';
  date: string;
  description: string;
  cost: number | null;
}

const typeBadgeVariant: Record<ActivityRow['type'], 'default' | 'secondary' | 'outline'> = {
  Riego: 'default',
  Fertilización: 'secondary',
  Labor: 'outline',
};

export function ActivityTimeline({ cropId }: ActivityTimelineProps) {
  const { data: irrigations, isLoading: irrigationsLoading } = useQuery({
    queryKey: ['crop-irrigations', cropId],
    queryFn: () => getIrrigations(cropId),
  });

  const { data: fertilizations, isLoading: fertilizationsLoading } = useQuery({
    queryKey: ['crop-fertilizations', cropId],
    queryFn: () => getFertilizations(cropId),
  });

  const { data: labors, isLoading: laborsLoading } = useQuery({
    queryKey: ['crop-labors', cropId],
    queryFn: () => getLabors(cropId),
  });

  const isLoading = irrigationsLoading || fertilizationsLoading || laborsLoading;

  const rows: ActivityRow[] = [
    ...(irrigations ?? []).map((i) => ({
      id: `irrigation-${i.id}`,
      type: 'Riego' as const,
      date: i.appliedAt,
      description: [i.method, i.volumeLiters != null ? `${i.volumeLiters} L` : null, i.durationMin != null ? `${i.durationMin} min` : null]
        .filter(Boolean)
        .join(' · '),
      cost: null,
    })),
    ...(fertilizations ?? []).map((f) => ({
      id: `fertilization-${f.id}`,
      type: 'Fertilización' as const,
      date: f.appliedAt,
      description: [f.productName, f.doseKgHa != null ? `${f.doseKgHa} kg/ha` : null, f.totalKg != null ? `${f.totalKg} kg total` : null]
        .filter(Boolean)
        .join(' · '),
      cost: f.cost ?? null,
    })),
    ...(labors ?? []).map((l) => ({
      id: `labor-${l.id}`,
      type: 'Labor' as const,
      date: l.performedAt,
      description: [l.activityType, `${l.workersCount} trabajador(es)`, l.hoursWorked != null ? `${l.hoursWorked} h` : null]
        .filter(Boolean)
        .join(' · '),
      cost: l.cost ?? null,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCost = rows.reduce((sum, row) => sum + (row.cost ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividades del cultivo</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Cargando actividades...</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-muted-foreground">No hay actividades registradas para este cultivo.</p>
        )}
        {!isLoading && rows.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead className="text-right">Costo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Badge variant={typeBadgeVariant[row.type]}>{row.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(row.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{row.description || '—'}</TableCell>
                  <TableCell className="text-right">
                    {row.cost != null ? `$${row.cost.toFixed(2)}` : '—'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Costo total de actividades
                </TableCell>
                <TableCell className="text-right font-medium">${totalCost.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
