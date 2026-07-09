import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getFarms } from '@/features/farms/api/farms-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FarmsListPage() {
  const { data: farms, isLoading, error } = useQuery({
    queryKey: ['farms'],
    queryFn: getFarms,
  });

  if (isLoading) return <p className="text-muted-foreground">Cargando fincas...</p>;
  if (error) return <p className="text-destructive">Error al cargar las fincas.</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Fincas</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {farms?.map((farm) => (
          <Link key={farm.id} to={`/fincas/${farm.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{farm.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {farm.region && <p>{farm.region}</p>}
                {farm.areaHa != null && <p>{farm.areaHa.toFixed(1)} ha</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
        {farms?.length === 0 && <p className="text-muted-foreground">No hay fincas registradas.</p>}
      </div>
    </div>
  );
}
