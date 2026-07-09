import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPlot } from '@/features/plots/api/plots-api';
import { getCropPrediction, getCrops } from '@/features/crops/api/crops-api';
import { ActivityTimeline } from '@/features/crops/components/ActivityTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PlotDetailPage() {
  const { farmId, plotId } = useParams<{ farmId: string; plotId: string }>();

  const { data: plot } = useQuery({
    queryKey: ['plot', farmId, plotId],
    queryFn: () => getPlot(farmId!, plotId!),
    enabled: !!farmId && !!plotId,
  });

  const { data: crops, isLoading: cropsLoading } = useQuery({
    queryKey: ['plot-crops', plotId],
    queryFn: () => getCrops(plotId!),
    enabled: !!plotId,
  });

  const activeCrop = crops?.find((c) => c.status !== 'Harvested') ?? crops?.[0];

  const { data: prediction } = useQuery({
    queryKey: ['crop-prediction', plotId, activeCrop?.id],
    queryFn: () => getCropPrediction(plotId!, activeCrop!.id),
    enabled: !!plotId && !!activeCrop,
  });

  if (!plot) return <p className="text-muted-foreground">Cargando parcela...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{plot.name}</h1>
        <p className="text-sm text-muted-foreground">
          {plot.areaHa != null && `${plot.areaHa.toFixed(2)} ha`}
          {plot.soilType && ` · Suelo: ${plot.soilType}`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cultivo actual</CardTitle>
        </CardHeader>
        <CardContent>
          {cropsLoading && <p className="text-muted-foreground">Cargando...</p>}
          {!cropsLoading && !activeCrop && (
            <p className="text-muted-foreground">No hay cultivos registrados en esta parcela.</p>
          )}
          {activeCrop && (
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activeCrop.cropType}</span>
                {activeCrop.variety && <span className="text-muted-foreground">({activeCrop.variety})</span>}
                <Badge variant="secondary">{activeCrop.status}</Badge>
              </div>
              <p className="text-muted-foreground">Plantado: {activeCrop.plantedAt}</p>
              {activeCrop.yieldKg != null && (
                <p className="text-muted-foreground">Rendimiento: {activeCrop.yieldKg} kg</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {prediction && (
        <Card>
          <CardHeader>
            <CardTitle>Predicción de cosecha</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
            {prediction.predictedYieldKg != null && (
              <p>
                Rendimiento estimado: {prediction.predictedYieldKg} kg
                {prediction.yieldBasis && ` (${prediction.yieldBasis})`}
              </p>
            )}
            {prediction.predictedHarvestDate && (
              <p>
                Fecha estimada de cosecha: {prediction.predictedHarvestDate}
                {prediction.harvestBasis && ` (${prediction.harvestBasis})`}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {activeCrop && <ActivityTimeline cropId={activeCrop.id} />}
    </div>
  );
}
