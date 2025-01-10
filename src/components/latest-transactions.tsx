import TransactionItem from './transaction-item';
import { useQuery } from '@tanstack/react-query';
import { getBlockNumber, getTransaction } from '@wagmi/core';
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router';
import { config } from '~/config';

const TX_PER_SCREEN = 6;

const LatestTransactions = () => {
  const { data } = useQuery({
    queryKey: ['latestTransactions'],
    queryFn: async () => {
      const latestBlock = await getBlockNumber(config);
      return Promise.all(
        Array.from({ length: TX_PER_SCREEN }).map((_, i) =>
          getTransaction(config, { blockNumber: latestBlock - BigInt(i), index: 0 })
        )
      );
    },
  });

  return (
    <section className="w-full rounded-lg border border-border shadow-lg">
      <div className="border-b px-5 py-5">
        <p className="text-sm font-semibold">Latest transactions</p>
      </div>
      {data && data.length > 0 && (
        <>
          <div className="flex w-full flex-col px-5">
            {data.map(tx => (
              <TransactionItem
                key={tx.hash}
                blockHash={tx.blockHash}
                hash={tx.hash}
                value={tx.value}
                from={tx.from}
                to={tx.to}
              />
            ))}
          </div>
          <Link
            to={'/tx'}
            className="flex w-full items-center justify-center gap-2 rounded-b-lg border-t py-4 text-xs uppercase text-stone-700 hover:bg-gray-50">
            view all transactions
            <MoveRight size={18} />
          </Link>
        </>
      )}
    </section>
  );
};

export default LatestTransactions;
