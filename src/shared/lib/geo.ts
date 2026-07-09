export type LngLat = [number, number];

export function decodeGeoPolygon(geoJson?: string | null): LngLat[] | null {
  if (!geoJson) return null;
  try {
    const parsed = JSON.parse(geoJson);
    if (parsed?.type !== 'Polygon') return null;
    const ring = parsed.coordinates?.[0] as LngLat[] | undefined;
    if (!ring || ring.length < 3) return null;
    return ring;
  } catch {
    return null;
  }
}

export function decodeGeoPoint(geoJson?: string | null): LngLat | null {
  if (!geoJson) return null;
  try {
    const parsed = JSON.parse(geoJson);
    if (parsed?.type !== 'Point') return null;
    return parsed.coordinates as LngLat;
  } catch {
    return null;
  }
}

export function centroidOf(ring: LngLat[]): LngLat {
  const [lngSum, latSum] = ring.reduce(
    ([lng, lat], [pLng, pLat]) => [lng + pLng, lat + pLat],
    [0, 0],
  );
  return [lngSum / ring.length, latSum / ring.length];
}
