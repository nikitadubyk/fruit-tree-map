import { prisma } from '@/lib';
import { TreeMap } from '@/components';

export default async function Home() {
  const trees = await prisma.tree.findMany({ include: { User: true } });

  return (
    <div>
      <TreeMap initialTrees={trees} />
    </div>
  );
}
