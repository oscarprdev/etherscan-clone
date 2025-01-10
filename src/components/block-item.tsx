import EtherBadge from './ether-badge';
import Link from './ui/link';
import { Box } from 'lucide-react';
import { useMemo } from 'react';
import { type Block } from 'viem';
import { Tooltip, TooltipWithLabel } from '~/components/ui/tooltip';
import { formatHash, formatRelativeTime, getBlockReward } from '~/lib/utils';

type BlockItemProps = Pick<
  Block<bigint, true>,
  'number' | 'timestamp' | 'miner' | 'transactions' | 'baseFeePerGas' | 'gasUsed'
>;

const BlockItem = (props: BlockItemProps) => {
  const { number, timestamp, miner, transactions, baseFeePerGas, gasUsed } = props;

  const blockReward = useMemo(
    () =>
      getBlockReward(
        baseFeePerGas,
        gasUsed,
        transactions.map(tr => ({
          gas: tr.gas,
          gasPrice: tr.gasPrice,
        }))
      ),
    [baseFeePerGas, gasUsed, transactions]
  );

  return (
    <article className="flex w-full flex-col items-start justify-between border-b py-3 text-sm duration-200 last-of-type:border-none sm:flex-row sm:items-center">
      <div className="flex w-full items-start gap-2 sm:w-1/3 sm:items-center">
        <span className="hidden place-items-center rounded-md bg-gray-50 p-2 sm:grid">
          <Box className="text-stone-400" />
        </span>
        <p className="visible sm:hidden">Block</p>
        <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
          <Link to={`/block/${number}`}>{Number(number)}</Link>
          <p className="text-xs text-stone-500">{formatRelativeTime(Number(timestamp))}</p>
        </div>
      </div>
      <div className="ml-5 flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="flex flex-col items-start">
          <TooltipWithLabel label="Miner" content={miner}>
            <Link to={`/address/${miner}`}>{formatHash(miner)}</Link>
          </TooltipWithLabel>
          <div className="flex items-center gap-2">
            <Tooltip content="Transactions in this block">
              <Link to={`txs?block=${number}`}>{transactions.length} txns</Link>
            </Tooltip>
            <EtherBadge
              ether={blockReward}
              tooltipContent="Block reward"
              className="block sm:hidden"
            />
          </div>
        </div>
        <EtherBadge ether={blockReward} tooltipContent="Block reward" className="hidden sm:block" />
      </div>
    </article>
  );
};

export default BlockItem;
