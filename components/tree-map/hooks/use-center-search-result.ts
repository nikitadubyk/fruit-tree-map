import { useEffect } from 'react';

import { Tree } from '@/app/generated/prisma';

interface UseCenterSearchResult {
  search: string;
  filteredTrees: Tree[];
  map: google.maps.Map | null;
  setMapCenter: (values: { lat: number; lng: number }) => void;
}

export const useCenterSearchResult = ({
  map,
  search,
  setMapCenter,
  filteredTrees,
}: UseCenterSearchResult) => {
  useEffect(() => {
    if (!map || !search.trim() || !filteredTrees.length) return;

    if (filteredTrees.length === 1) {
      const [tree] = filteredTrees;
      setMapCenter({ lat: tree.latitude, lng: tree.longitude });
      map.setZoom(16);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    filteredTrees.forEach((tree) =>
      bounds.extend({ lat: tree.latitude, lng: tree.longitude })
    );
    map.fitBounds(bounds);
  }, [map, search, filteredTrees]);
};
