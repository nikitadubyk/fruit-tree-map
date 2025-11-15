import { Tree } from '@/app/generated/prisma';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export enum TreeStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type TreeWithCreator = Tree & {
  creator: User | null;
};
