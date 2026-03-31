import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "@/lib/leaflet-fix";
import { useEffect } from 'react';

type MarkerItem = {
  position: [number, number];
  title: string;
  subtitle?: string;
};

type Props = {
  center: [number, number];
  zoom?: number;
  markers: MarkerItem[];
  className?: string;
  scrollWheelZoom?: boolean;
};

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export default function MapView({
  center,
  zoom = 12,
  markers,
  className = "rounded-xl overflow-hidden border border-border bg-muted/50 aspect-[16/9]",
  scrollWheelZoom = false,
}: Props) {
  return (
    <div className={className}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={scrollWheelZoom}>
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            {m.title || m.subtitle ? (
              <Popup>
                <div className="text-sm font-medium">
                  {m.title}
                  {m.subtitle ? <div className="text-xs text-muted-foreground">{m.subtitle}</div> : null}
                </div>
              </Popup>
            ) : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
