import { prisma } from '@/lib';
import { TreeMap } from '@/components';

export default async function Home() {
  const trees = await prisma.tree.findMany();

  return (
    <div>
      <TreeMap trees={trees} />
    </div>
  );
}
