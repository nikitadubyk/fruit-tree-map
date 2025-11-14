export interface CreateTreeData {
  note?: string;
  species: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateTreeStatusData {
  treeId: number;
  status: 'approved' | 'rejected';
}
