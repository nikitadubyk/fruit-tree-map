'use client';

import toast from 'react-hot-toast';
import { useState, useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import { useTrees } from '@/hooks';
import { Coordinate } from '@/types';
import { useUserStore } from '@/store';
import { Tree } from '@/app/generated/prisma';

import { Header } from '../header';
import { AddTreeDialog } from '../add-tree-dialog';
import { TreeDetailsDialog } from '../tree-details-dialog';

import { MapError } from './error';
import { MapLoader } from './loader';
import { TreeMapProps } from './types';
import { useGeolocation, useMarkerClusterer } from './hooks';

export const TreeMap = ({
  zoom = 12,
  center = { lat: 48.3071, lng: 38.029633 },
}: TreeMapProps) => {
  const [marker, setMarker] = useState<Coordinate>();
  const [mapCenter, setMapCenter] = useState(center);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const { data: trees, isLoading } = useTrees();

  const { isLoaded, loadError } = useJsApiLoader({
    language: 'ru',
    id: 'google-map-script',
    libraries: ['places', 'marker'],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      zoomControl: true,
      disableDefaultUI: true,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || 'DEMO_MAP_ID',
    }),
    []
  );

  useGeolocation({ setMapCenter });

  useMarkerClusterer({ map, trees, isLoaded, setSelectedTree });

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isLoggedIn || !e.latLng) {
      return toast.error('Чтобы добавить точку на карту, войдите в аккаунт');
    }

    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return <MapError onReload={() => window.location.reload()} />;
  }

  if (!isLoaded || isLoading) {
    return <MapLoader />;
  }

  return (
    <>
      <div className="relative w-full h-screen">
        <Header setMapCenter={setMapCenter} />

        <GoogleMap
          zoom={zoom}
          onLoad={onLoad}
          options={options}
          center={mapCenter}
          onClick={onMapClick}
          onUnmount={onUnmount}
          mapContainerClassName="w-full h-full"
        />
      </div>

      <AddTreeDialog
        marker={marker}
        open={!!marker}
        onOpenChange={(open) => {
          if (!open) setMarker(undefined);
        }}
      />

      <TreeDetailsDialog
        tree={selectedTree}
        open={!!selectedTree}
        onOpenChange={(open) => {
          if (!open) setSelectedTree(null);
        }}
      />
    </>
  );
};
