import { useQuery } from '@tanstack/react-query';
import { getBlock, getBlockNumber } from '@wagmi/core';
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router';
import BlockItem from '~/components/block-item';
import { config } from '~/config';

const BLOCKS_PER_SCREEN = 6;

const LatestBlocks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['latestBlocks'],
    queryFn: async () => {
      const latestBlock = await getBlockNumber(config);
      return Promise.all(
        Array.from({ length: BLOCKS_PER_SCREEN }).map((_, i) =>
          getBlock(config, { blockNumber: latestBlock - BigInt(i), includeTransactions: true })
        )
      );
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {data && data.length > 0 && (
        <>
          <div className="flex w-full flex-col px-5">
            {data.map(block => (
              <BlockItem
                key={block.number}
                number={block.number}
                timestamp={block.timestamp}
                miner={block.miner}
                transactions={block.transactions}
                gasUsed={block.gasUsed}
                baseFeePerGas={block.baseFeePerGas}
              />
            ))}
          </div>
          <Link
            to={'/blocks'}
            className="flex w-full items-center justify-center gap-2 rounded-b-lg border-t py-4 text-xs uppercase text-stone-700 hover:bg-gray-50">
            view all blocks
            <MoveRight size={18} />
          </Link>
        </>
      )}
    </>
  );
};

export default LatestBlocks;
