import EtherBadge from './ether-badge';
import Link from './ui/link';
import { TooltipWithLabel } from './ui/tooltip';
import { FileText } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { Transaction, formatEther } from 'viem';
import { formatHash } from '~/lib/utils';

const TxTimestamp = lazy(() => import('./transaction-timestamp.tsx'));

type TransaactionItemProps = Pick<Transaction, 'blockHash' | 'hash' | 'from' | 'to' | 'value'>;

const TransactionItem = (props: TransaactionItemProps) => {
  const { blockHash, hash, from, to, value } = props;

  return (
    <article className="flex w-full flex-col items-start justify-between border-b py-3 text-sm duration-200 last-of-type:border-none sm:flex-row sm:items-center">
      <div className="flex w-full items-start gap-2 sm:w-1/3 sm:items-center">
        <span className="hidden place-items-center rounded-md bg-gray-50 p-2 sm:grid">
          <FileText className="text-stone-400" />
        </span>
        <p className="visible sm:hidden">TX#</p>
        <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
          <Link to={`/block/${hash}`}>{String(hash).slice(0, 10)}...</Link>
          <Suspense fallback={'-'}>{blockHash && <TxTimestamp blockHash={blockHash} />}</Suspense>
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="flex flex-col items-start">
          <TooltipWithLabel label="From" content={from}>
            <Link to={`/address/${from}`}>{formatHash(from)}</Link>
          </TooltipWithLabel>
          <div className="flex items-center gap-2">
            {to && (
              <TooltipWithLabel label="To" content={to}>
                <Link to={`/address/${to}`}>{formatHash(to)}</Link>
              </TooltipWithLabel>
            )}
            <EtherBadge
              ether={Number(formatEther(value))}
              tooltipContent="Amount"
              className="block sm:hidden"
            />
          </div>
        </div>
        <EtherBadge
          ether={Number(formatEther(value))}
          tooltipContent="Amount"
          className="hidden sm:block"
        />
      </div>
    </article>
  );
};

export default TransactionItem;
