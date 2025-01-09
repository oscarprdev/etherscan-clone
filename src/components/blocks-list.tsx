import { useQuery } from '@tanstack/react-query';
import { getBlock, getBlockNumber } from '@wagmi/core';
import BlockItem from '~/components/block-item';
import { config } from '~/config';

const BLOCKS_PER_SCREEN = 10;

const BlocksList = () => {
  const { data, isFetching } = useQuery({
    queryKey: ['blocksList'],
    queryFn: async () => {
      const latestBlock = await getBlockNumber(config);
      return Promise.all(
        Array.from({ length: BLOCKS_PER_SCREEN }).map((_, i) =>
          getBlock(config, { blockNumber: latestBlock - BigInt(i), includeTransactions: true })
        )
      );
    },
  });

  return (
    <section className="border border-border">
      {data && data.length > 0 ? (
        data.map(block => (
          <BlockItem
            key={block.number}
            number={block.number}
            timestamp={block.timestamp}
            miner={block.miner}
            transactions={block.transactions}
            gasUsed={block.gasUsed}
            baseFeePerGas={block.baseFeePerGas}
          />
        ))
      ) : isFetching ? (
        <p>Fetching...</p>
      ) : (
        <p>No data</p>
      )}
    </section>
  );
};

export default BlocksList;
