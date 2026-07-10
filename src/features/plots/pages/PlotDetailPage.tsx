import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPlot, getSoilAnalyses, createSoilAnalysis } from '@/features/plots/api/plots-api';
import { getCropPrediction, getCrops } from '@/features/crops/api/crops-api';
import { ActivityTimeline } from '@/features/crops/components/ActivityTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const emptySoilForm = {
  analyzedAt: new Date().toISOString().slice(0, 10),
  ph: '',
  nitrogenPct: '',
  phosphorusPct: '',
  potassiumPct: '',
  organicMatterPct: '',
  notes: '',
};

export function PlotDetailPage() {
  const { farmId, plotId } = useParams<{ farmId: string; plotId: string }>();
  const queryClient = useQueryClient();
  const [soilDialogOpen, setSoilDialogOpen] = useState(false);
  const [soilForm, setSoilForm] = useState(emptySoilForm);

  const { data: soilAnalyses } = useQuery({
    queryKey: ['soil-analyses', plotId],
    queryFn: () => getSoilAnalyses(plotId!),
    enabled: !!plotId,
  });

  const createSoilAnalysisMutation = useMutation({
    mutationFn: () =>
      createSoilAnalysis(plotId!, {
        analyzedAt: soilForm.analyzedAt,
        ph: soilForm.ph ? Number(soilForm.ph) : null,
        nitrogenPct: soilForm.nitrogenPct ? Number(soilForm.nitrogenPct) : null,
        phosphorusPct: soilForm.phosphorusPct ? Number(soilForm.phosphorusPct) : null,
        potassiumPct: soilForm.potassiumPct ? Number(soilForm.potassiumPct) : null,
        organicMatterPct: soilForm.organicMatterPct ? Number(soilForm.organicMatterPct) : null,
        notes: soilForm.notes || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soil-analyses', plotId] });
      setSoilDialogOpen(false);
      setSoilForm(emptySoilForm);
    },
  });

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
  const pastCrops = crops?.filter((c) => c.id !== activeCrop?.id) ?? [];

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Análisis de suelo</CardTitle>
          <Dialog open={soilDialogOpen} onOpenChange={setSoilDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">+ Nuevo análisis</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo análisis de suelo</DialogTitle>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  createSoilAnalysisMutation.mutate();
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="soil-date">Fecha</Label>
                  <Input
                    id="soil-date"
                    type="date"
                    value={soilForm.analyzedAt}
                    onChange={(e) => setSoilForm({ ...soilForm, analyzedAt: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="soil-ph">pH</Label>
                    <Input
                      id="soil-ph"
                      type="number"
                      step="0.1"
                      value={soilForm.ph}
                      onChange={(e) => setSoilForm({ ...soilForm, ph: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="soil-om">Materia orgánica %</Label>
                    <Input
                      id="soil-om"
                      type="number"
                      step="0.1"
                      value={soilForm.organicMatterPct}
                      onChange={(e) => setSoilForm({ ...soilForm, organicMatterPct: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="soil-n">N %</Label>
                    <Input
                      id="soil-n"
                      type="number"
                      step="0.1"
                      value={soilForm.nitrogenPct}
                      onChange={(e) => setSoilForm({ ...soilForm, nitrogenPct: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="soil-p">P %</Label>
                    <Input
                      id="soil-p"
                      type="number"
                      step="0.1"
                      value={soilForm.phosphorusPct}
                      onChange={(e) => setSoilForm({ ...soilForm, phosphorusPct: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="soil-k">K %</Label>
                    <Input
                      id="soil-k"
                      type="number"
                      step="0.1"
                      value={soilForm.potassiumPct}
                      onChange={(e) => setSoilForm({ ...soilForm, potassiumPct: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="soil-notes">Notas</Label>
                  <Input
                    id="soil-notes"
                    value={soilForm.notes}
                    onChange={(e) => setSoilForm({ ...soilForm, notes: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createSoilAnalysisMutation.isPending}>
                    {createSoilAnalysisMutation.isPending ? 'Guardando...' : 'Guardar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {!soilAnalyses?.length && (
            <p className="text-muted-foreground">Sin análisis de suelo registrados.</p>
          )}
          {!!soilAnalyses?.length && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">pH</TableHead>
                  <TableHead className="text-right">N %</TableHead>
                  <TableHead className="text-right">P %</TableHead>
                  <TableHead className="text-right">K %</TableHead>
                  <TableHead className="text-right">M.O. %</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soilAnalyses.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.analyzedAt}</TableCell>
                    <TableCell className="text-right">{a.ph ?? '—'}</TableCell>
                    <TableCell className="text-right">{a.nitrogenPct ?? '—'}</TableCell>
                    <TableCell className="text-right">{a.phosphorusPct ?? '—'}</TableCell>
                    <TableCell className="text-right">{a.potassiumPct ?? '—'}</TableCell>
                    <TableCell className="text-right">{a.organicMatterPct ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{a.notes ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      {!cropsLoading && pastCrops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de rotación</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cultivo</TableHead>
                  <TableHead>Variedad</TableHead>
                  <TableHead>Siembra</TableHead>
                  <TableHead>Cosecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Rendimiento (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastCrops.map((crop) => (
                  <TableRow key={crop.id}>
                    <TableCell>{crop.cropType}</TableCell>
                    <TableCell>{crop.variety ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{crop.plantedAt}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {crop.harvestedAt ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{crop.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{crop.yieldKg ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
