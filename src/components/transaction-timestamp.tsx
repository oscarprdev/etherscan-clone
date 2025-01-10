import { useQuery } from '@tanstack/react-query';
import { getBlock } from '@wagmi/core';
import { config } from '~/config';
import { formatRelativeTime } from '~/lib/utils';

const TransactionTimestamp = ({ blockHash }: { blockHash: `0x${string}` }) => {
  const { data } = useQuery({
    queryKey: ['txTimestamp'],
    queryFn: async () => {
      const block = await getBlock(config, { blockHash });
      return block.timestamp;
    },
  });

  return <p className="text-xs text-stone-500">{formatRelativeTime(Number(data))}</p>;
};

export default TransactionTimestamp;
