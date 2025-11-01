import { Coordinate } from '@/types';
import { Tree } from '@/app/generated/prisma';

export interface TreeMapProps {
  zoom?: number;
  center?: Coordinate;
  initialTrees?: Tree[];
}
