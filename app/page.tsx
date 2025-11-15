import { Metadata } from 'next';

import { TreeMap } from '@/components';

export const metadata: Metadata = {
  description:
    'Интерактивная карта деревьев. Просматривайте, добавляйте и отслеживайте зеленые насаждения в вашем городе.',
  openGraph: {
    type: 'website',
    title: 'TreeMap - Интерактивная карта деревьев',
    description: 'Просматривайте, добавляйте и отслеживайте зеленые насаждения',
  },
};

export default function Home() {
  return (
    <div>
      <TreeMap />
    </div>
  );
}
