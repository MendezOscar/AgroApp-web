import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getFarm, getFarmSummary } from '@/features/farms/api/farms-api';
import { getFarmPlotsGeo } from '@/features/plots/api/plots-api';
import { PlotsMap } from '@/shared/components/PlotsMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function FarmDetailPage() {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();

  const { data: farm } = useQuery({
    queryKey: ['farm', farmId],
    queryFn: () => getFarm(farmId!),
    enabled: !!farmId,
  });

  const { data: summary } = useQuery({
    queryKey: ['farm-summary', farmId],
    queryFn: () => getFarmSummary(farmId!),
    enabled: !!farmId,
  });

  const { data: plots, isLoading: plotsLoading } = useQuery({
    queryKey: ['farm-plots-geo', farmId],
    queryFn: () => getFarmPlotsGeo(farmId!),
    enabled: !!farmId,
  });

  if (!farmId) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{farm?.name ?? 'Finca'}</h1>
        <Button asChild variant="outline">
          <Link to={`/fincas/${farmId}/reportes`}>Ver reportes</Link>
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="Área total" value={summary ? `${summary.totalAreaHa.toFixed(1)} ha` : '—'} />
        <SummaryCard
          label="Parcelas activas"
          value={summary ? `${summary.activePlots}/${summary.totalPlots}` : '—'}
        />
        <SummaryCard label="Cultivos activos" value={summary?.activeCropCount ?? '—'} />
        <SummaryCard
          label="Costo mes actual"
          value={summary ? `$${summary.totalCostCurrentMonth.toFixed(2)}` : '—'}
        />
      </div>

      {plotsLoading ? (
        <p className="text-muted-foreground">Cargando mapa...</p>
      ) : (
        <PlotsMap plots={plots ?? []} onSelectPlot={(plotId) => navigate(`parcelas/${plotId}`)} />
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-xl font-semibold">{value}</CardContent>
    </Card>
  );
}
