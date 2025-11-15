import { useEffect } from 'react';

import { Tree } from '@/app/generated/prisma';
import { useTreeNavigationStore } from '@/store';
import { Coordinate } from '@/types';

interface UseTargetTree {
  isLoaded: boolean;
  map: google.maps.Map | null;
  setSelectedTree: (tree: Tree) => void;
  setMapCenter: (center: Coordinate) => void;
}

export const useTargetTree = ({
  map,
  isLoaded,
  setMapCenter,
  setSelectedTree,
}: UseTargetTree) => {
  const { targetTree, clearTargetTree } = useTreeNavigationStore();

  useEffect(() => {
    if (targetTree && map && isLoaded) {
      const treeLocation = {
        lat: targetTree.latitude,
        lng: targetTree.longitude,
      };

      setMapCenter(treeLocation);

      map.setZoom(18);

      setTimeout(() => {
        map.setCenter(treeLocation);
        setSelectedTree(targetTree);
      }, 100);

      clearTargetTree();
    }
  }, [
    targetTree,
    map,
    isLoaded,
    clearTargetTree,
    setSelectedTree,
    setMapCenter,
  ]);
};
