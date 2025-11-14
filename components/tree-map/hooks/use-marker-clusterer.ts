import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import { Tree } from '@/app/generated/prisma';

interface UseMarkerClusterer {
  trees?: Tree[];
  isLoaded: boolean;
  map: google.maps.Map | null;
  setSelectedTree: (tree: Tree) => void;
}

export const useMarkerClusterer = ({
  map,
  trees,
  isLoaded,
  setSelectedTree,
}: UseMarkerClusterer) => {
  const markerClustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!map || !isLoaded || !trees) return;

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    const newMarkers = trees.map((tree) => {
      const img = document.createElement('img');

      img.width = 40;
      img.height = 40;
      img.src = '/tree-marker.svg';
      img.style.cursor = 'pointer';

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: tree.latitude, lng: tree.longitude },
        content: img,
        title: tree.species,
      });

      marker.addListener('click', () => {
        setSelectedTree(tree);
      });

      return marker;
    });

    markersRef.current = newMarkers;

    markerClustererRef.current = new MarkerClusterer({
      map,
      markers: newMarkers,
      renderer: {
        render: ({ count, position }) => {
          const container = document.createElement('div');
          container.style.cssText = `
            width: 50px;
            height: 50px;
            display: flex;
            cursor: pointer;
            position: relative;
            align-items: center;
            justify-content: center;
          `;

          const svg = `
            <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="22" fill="#10b981" opacity="0.8"/>
              <circle cx="25" cy="25" r="18" fill="#059669"/>
              <text x="25" y="25" text-anchor="middle" dominant-baseline="central" 
                    fill="white" font-size="14" font-weight="bold" font-family="Arial">
                ${count}
              </text>
            </svg>
          `;
          container.innerHTML = svg;

          return new google.maps.marker.AdvancedMarkerElement({
            position,
            content: container,
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          });
        },
      },
      onClusterClick: (_, cluster, map) => {
        const bounds = new google.maps.LatLngBounds();
        cluster.markers?.forEach((marker) => {
          // @ts-ignore
          bounds.extend(marker.position as google.maps.LatLng);
        });
        map.fitBounds(bounds);
      },
    });

    return () => {
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
      }
    };
  }, [map, trees, isLoaded, setSelectedTree]);
};
