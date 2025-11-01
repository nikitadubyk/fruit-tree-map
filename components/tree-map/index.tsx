'use client';

import toast from 'react-hot-toast';
import { useState, useMemo, useEffect } from 'react';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import { Coordinate } from '@/types';
import { Tree } from '@/app/generated/prisma';
import { useTreeStore, useUserStore } from '@/store';

import { Header } from '../header';
import { AddTreeDialog } from '../add-tree-dialog';
import { TreeDetailsDialog } from '../tree-details-dialog';

import { MapError } from './error';
import { MapLoader } from './loader';
import { TreeMapProps } from './types';

export const TreeMap = ({
  zoom = 12,
  initialTrees = [],
  center = { lat: 48.3071, lng: 38.029633 },
}: TreeMapProps) => {
  const { trees, setTrees } = useTreeStore();
  const [marker, setMarker] = useState<Coordinate>();
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const { isLoaded, loadError } = useJsApiLoader({
    language: 'ru',
    libraries: ['places'],
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      zoomControl: true,
      disableDefaultUI: true,
    }),
    []
  );

  const treeIcon = useMemo<google.maps.Icon | undefined>(() => {
    if (!isLoaded) return undefined;

    return {
      url: '/tree-marker.svg',
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 40),
      scaledSize: new google.maps.Size(40, 40),
    };
  }, [isLoaded]);

  useEffect(() => {
    if (initialTrees.length > 0) {
      setTrees(initialTrees);
    }
  }, [initialTrees, setTrees]);

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

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isLoggedIn || !e.latLng) {
      return toast.error('Чтобы добавить точку на карту, войдите в аккаунт');
    }

    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  if (loadError) {
    return <MapError onReload={() => window.location.reload()} />;
  }

  if (!isLoaded) {
    return <MapLoader />;
  }

  return (
    <>
      <div className="relative w-full h-screen">
        <Header setMapCenter={setMapCenter} />

        <GoogleMap
          zoom={zoom}
          options={options}
          center={mapCenter}
          onClick={onMapClick}
          mapContainerClassName="w-full h-full"
        >
          {trees.map((tree) => (
            <Marker
              key={tree.id}
              icon={treeIcon}
              title={tree.species}
              onClick={() => setSelectedTree(tree)}
              position={{ lat: tree.latitude, lng: tree.longitude }}
            />
          ))}
        </GoogleMap>
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
