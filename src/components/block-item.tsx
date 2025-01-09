import Link from './ui/link';
import { Box } from 'lucide-react';
import { useMemo } from 'react';
import { type Block } from 'viem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { formatEth, formatHash, formatRelativeTime, getBlockReward } from '~/lib/utils';

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
      <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="flex flex-col items-start">
          <MinerLabel miner={miner} />
          <div className="flex items-center gap-2">
            <TransactionsCounter block={number} trLength={transactions.length} />
            <MobileBlockRewardBadge blockReward={blockReward} />
          </div>
        </div>
        <DesktopBlockRewardBadge blockReward={blockReward} />
      </div>
    </article>
  );
};

const MinerLabel = ({ miner }: { miner: `0x${string}` }) => {
  return (
    <label className="flex gap-1">
      <p className="font-medium text-stone-900">Miner</p>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger>
            <Link to={`/address/${miner}`}>{formatHash(miner)}</Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{miner}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </label>
  );
};

const TransactionsCounter = ({ block, trLength }: { block: bigint | null; trLength: number }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>
          <Link to={`txs?block=${block}`}>{trLength} txns</Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Transactions in this block</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MobileBlockRewardBadge = ({ blockReward }: { blockReward: number }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>
          <span className="block rounded-md border p-1 text-[0.73em] text-xs font-bold sm:hidden">
            {formatEth(blockReward)} Eth
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Block reward</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const DesktopBlockRewardBadge = ({ blockReward }: { blockReward: number }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>
          <span className="hidden rounded-md border p-2 text-[0.73em] text-xs font-bold sm:block">
            {formatEth(blockReward)} Eth
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Block reward</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BlockItem;
