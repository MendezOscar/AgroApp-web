import { useMemo, useState } from 'react';
import Map, { Source, Layer, Popup, NavigationControl, type LayerProps, type MapLayerMouseEvent } from 'react-map-gl/maplibre';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import { decodeGeoPolygon, type LngLat } from '@/shared/lib/geo';
import type { PlotGeo } from '@/shared/types/domain';

interface PlotsMapProps {
  plots: PlotGeo[];
  onSelectPlot?: (plotId: string) => void;
}

const fillLayer: LayerProps = {
  id: 'plots-fill',
  type: 'fill',
  paint: { 'fill-color': '#16a34a', 'fill-opacity': 0.35 },
};

const lineLayer: LayerProps = {
  id: 'plots-line',
  type: 'line',
  paint: { 'line-color': '#16a34a', 'line-width': 2 },
};

export function PlotsMap({ plots, onSelectPlot }: PlotsMapProps) {
  const [popup, setPopup] = useState<{ lng: number; lat: number; name: string } | null>(null);

  const featureCollection = useMemo<FeatureCollection<Polygon>>(() => {
    const features: Feature<Polygon>[] = [];
    for (const plot of plots) {
      const ring = decodeGeoPolygon(plot.geoJson);
      if (!ring) continue;
      const closedRing = ring[0]?.[0] === ring.at(-1)?.[0] ? ring : [...ring, ring[0]];
      features.push({
        type: 'Feature',
        properties: { plotId: plot.id, name: plot.name },
        geometry: { type: 'Polygon', coordinates: [closedRing] },
      });
    }
    return { type: 'FeatureCollection', features };
  }, [plots]);

  const initialView = useMemo(() => {
    const allPoints = featureCollection.features.flatMap(
      (f) => f.geometry.coordinates[0] as LngLat[],
    );
    if (allPoints.length === 0) return { longitude: -86.8, latitude: 14.6, zoom: 6 };

    const lngs = allPoints.map(([lng]) => lng);
    const lats = allPoints.map(([, lat]) => lat);
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ];
    return { bounds, fitBoundsOptions: { padding: 60 } };
  }, [featureCollection]);

  if (featureCollection.features.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
        Ninguna parcela de esta finca tiene un área dibujada todavía.
      </div>
    );
  }

  function handleClick(e: MapLayerMouseEvent) {
    const feature = e.features?.[0];
    if (!feature) return;
    const plotId = feature.properties?.plotId as string;
    const name = feature.properties?.name as string;
    onSelectPlot?.(plotId);
    setPopup({ lng: e.lngLat.lng, lat: e.lngLat.lat, name });
  }

  return (
    <div className="h-[70vh] overflow-hidden rounded-lg border">
      <Map
        initialViewState={initialView}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        interactiveLayerIds={['plots-fill']}
        onClick={handleClick}
      >
        <NavigationControl position="top-right" />
        <Source id="plots" type="geojson" data={featureCollection}>
          <Layer {...fillLayer} />
          <Layer {...lineLayer} />
        </Source>
        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            onClose={() => setPopup(null)}
            closeOnClick={false}
          >
            {popup.name}
          </Popup>
        )}
      </Map>
    </div>
  );
}
