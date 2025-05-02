'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

import { Tree } from '@/app/generated/prisma';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

interface Props {
  trees: Tree[];
}

export function TreeMap({ trees }: Props) {
  return (
    <MapContainer
      zoom={13}
      center={[51.505, -0.09]}
      className="h-[100vh] w-[100vw] justify-self-center px-10 m-0 z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {trees.map((t) => (
        <Marker key={t.id} position={[t.latitude, t.longitude]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{t.species}</h3>
              {t.note && <p className="text-sm">{t.note}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
