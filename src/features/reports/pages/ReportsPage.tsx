import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getMonthlyCostHistory, getYieldHistory } from '@/features/reports/api/reports-api';
import { getCropComparison } from '@/features/crops/api/crops-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const monthLabel = (year: number, month: number) => `${month}/${year}`;

export function ReportsPage() {
  const { farmId } = useParams<{ farmId: string }>();

  const { data: costHistory } = useQuery({
    queryKey: ['monthly-cost-history'],
    queryFn: () => getMonthlyCostHistory(6),
  });

  const { data: yieldHistory } = useQuery({
    queryKey: ['yield-history', farmId],
    queryFn: () => getYieldHistory(farmId!, 12),
    enabled: !!farmId,
  });

  const { data: comparison } = useQuery({
    queryKey: ['crop-comparison', farmId],
    queryFn: () => getCropComparison(farmId!),
    enabled: !!farmId,
  });

  const costData = costHistory?.map((c) => ({ label: monthLabel(c.year, c.month), total: c.totalCost }));
  const yieldData = yieldHistory?.map((y) => ({ label: monthLabel(y.year, y.month), kg: y.totalYieldKg }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Reportes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Historial de costos (últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por mes (últimos 12 meses)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="kg" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparación de cultivos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parcela</TableHead>
                <TableHead>Cultivo</TableHead>
                <TableHead>Variedad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Rendimiento (kg)</TableHead>
                <TableHead className="text-right">Costo total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparison?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.plotName}</TableCell>
                  <TableCell>{row.cropType}</TableCell>
                  <TableCell>{row.variety ?? '—'}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell className="text-right">{row.yieldKg ?? '—'}</TableCell>
                  <TableCell className="text-right">${row.totalCost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {comparison?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Sin datos de cultivos para esta finca.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
