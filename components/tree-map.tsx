'use client';

import { useState, useMemo, useEffect } from 'react';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import { Tree } from '@/app/generated/prisma';

import { Header } from './header';

interface TreeMapProps {
  zoom?: number;
  trees?: Tree[];
  center?: { lat: number; lng: number };
}

export const TreeMap = ({
  zoom = 12,
  trees = [],
  center = { lat: 48.3071, lng: 38.029633 },
}: TreeMapProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    libraries: ['places'],
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  const [mapCenter, setMapCenter] = useState(center);

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      zoomControl: true,
      disableDefaultUI: true,
    }),
    []
  );

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMapCenter({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (err) => {
        console.warn('Не удалось получить геолокацию:', err);
      }
    );
  }, []);

  if (loadError) {
    return <p className="text-red-500">Ошибка загрузки карты</p>;
  }
  if (!isLoaded) {
    return <p>Загрузка карты…</p>;
  }

  return (
    <div className="relative w-full h-screen">
      <Header setMapCenter={setMapCenter} />

      <GoogleMap
        zoom={zoom}
        options={options}
        center={mapCenter}
        mapContainerClassName="w-full h-full"
      >
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            title={tree.species}
            position={{ lat: tree.latitude, lng: tree.longitude }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};
