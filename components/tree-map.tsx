'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Marker,
  GoogleMap,
  Autocomplete,
  useJsApiLoader,
} from '@react-google-maps/api';

import { Tree } from '@/app/generated/prisma';

import { Input } from './ui/input';

interface TreeMapProps {
  zoom?: number;
  trees?: Tree[];
  center?: { lat: number; lng: number };
}

export function TreeMap({
  zoom = 10,
  trees = [],
  center = { lat: 55.751244, lng: 37.618423 },
}: TreeMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries: ['places'],
  });

  const [mapCenter, setMapCenter] = useState(center);

  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      zoomControl: true,
      disableDefaultUI: true,
    }),
    []
  );

  const onLoadAutocomplete = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autoCompleteRef.current = autocomplete;
    },
    []
  );

  const onPlaceChanged = useCallback(() => {
    const place = autoCompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMapCenter({ lat, lng });
    }
  }, []);

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
      <div className="absolute top-4 left-4 transform z-10 w-80">
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={onPlaceChanged}
        >
          <Input placeholder="Поиск города" className="bg-white" />
        </Autocomplete>
      </div>

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
}
