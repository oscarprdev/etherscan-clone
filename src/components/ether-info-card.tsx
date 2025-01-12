import Link from './ui/link';
import { Tooltip } from './ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { getBlock } from '@wagmi/core';
import { ArrowLeftRight, CircleGauge, Globe } from 'lucide-react';
import { useMemo } from 'react';
import { formatEther } from 'viem';
import { config } from '~/config';
import { DEFAULT_TOTAL_AMOUNT_TX } from '~/constants';
import { cn } from '~/lib/utils';
import { getEtherBtcPrice } from '~/services/get-ether-btc-price';
import { getEtherPercentage } from '~/services/get-ether-percentage';
import { GetEtherPriceOutput, getEtherPrice } from '~/services/get-ether-price';

const EtherInfoCard = () => {
  const { data } = useQuery({
    queryKey: ['ether-price'],
    queryFn: async (): Promise<GetEtherPriceOutput> => await getEtherPrice(),
  });

  return (
    <div className="-mt-16 w-screen p-5 sm:p-10">
      <article className="flex flex-col items-center justify-between rounded-lg border border-border bg-white p-5 shadow-md lg:flex-row">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <div className="flex w-full flex-col items-start gap-2 md:border-r md:pr-5">
            {data && <EtherPrice ethPrice={Number(data.price)} />}
            <span className="h-[0.1rem] w-full bg-gray-100"></span>
            {data && <EtherMarketCap ethPrice={Number(data.price)} />}
          </div>

          <div className="flex w-full flex-col items-start gap-2 md:border-r md:px-5">
            <TotalEthTransactions />
            <LatestBlocks />
          </div>
        </div>
        <div className="grid w-full place-items-center">chart</div>
      </article>
    </div>
  );
};

const LatestBlocks = () => {
  const { data } = useQuery({
    queryKey: ['lastestBlocks'],
    queryFn: async (): Promise<[number, number]> => {
      const [finalizedBlock, safeBlock] = await Promise.all([
        getBlock(config, {
          blockTag: 'finalized',
        }),
        getBlock(config, {
          blockTag: 'safe',
        }),
      ]);

      return [Number(finalizedBlock.number), Number(safeBlock.number)];
    },
  });

  const finalizedBlock = useMemo(() => data?.[0], [data]);
  const safeBlock = useMemo(() => data?.[1], [data]);

  return (
    <div className="ml-1 flex w-full items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <CircleGauge size={20} />
        <div className="flex flex-col items-start text-xs">
          <p className="text-xs uppercase text-stone-500">Last finalized block</p>
          <Tooltip content="This block is finalized and cannot be reverted without slashing at least 1/3 of all validators">
            <p className="font-semibold text-stone-950">{finalizedBlock}</p>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-end text-xs">
        <p className="text-xs uppercase text-stone-500">Last safe block</p>
        <Tooltip content="This block is sage and unlikely to be reverted">
          <p className="font-semibold text-stone-950">{safeBlock}</p>
        </Tooltip>
      </div>
    </div>
  );
};

const TotalEthTransactions = () => {
  const totalEthTx = useQuery({
    queryKey: ['total-eth-tx'],
    queryFn: async (): Promise<number> => {
      const latestBlock = await getBlock(config);
      const latestBlockNumber = Number(latestBlock.number);
      const currentLatestBlock = localStorage.getItem('currentLatestBlock');
      if (!currentLatestBlock) {
        localStorage.setItem('currentLatestBlock', String(latestBlockNumber));
      }

      let totalAmountTx = Number(localStorage.getItem('totalAmountTx'));
      if (!totalAmountTx) {
        totalAmountTx = DEFAULT_TOTAL_AMOUNT_TX;
      }
      for (let i = latestBlockNumber; i > Number(currentLatestBlock); i--) {
        if (i === Number(currentLatestBlock)) break;

        const newBlock = await getBlock(config, { blockNumber: BigInt(i) });
        totalAmountTx += newBlock.transactions.length;
      }

      localStorage.setItem('totalAmountTx', String(totalAmountTx));
      localStorage.setItem('currentLatestBlock', String(latestBlockNumber));

      return totalAmountTx;
    },
  });

  const medGasPrice = useQuery({
    queryKey: ['medGasPrice'],
    queryFn: async (): Promise<number> => {
      let totalGasPrice = 0;
      const currentLatestBlock = localStorage.getItem('currentLatestBlock');
      for (let i = 10; i >= 0; i--) {
        const block = await getBlock(config, {
          blockNumber: BigInt(Number(currentLatestBlock) - i),
        });
        if (block.baseFeePerGas && block.gasUsed) {
          totalGasPrice += Number(block.baseFeePerGas) * Number(block.gasUsed);
        }
      }

      return Number(formatEther(BigInt(totalGasPrice), 'wei'));
    },
  });

  const totalAmountTx = useMemo(
    () => (Number(totalEthTx.data) / 1_000_000).toFixed(2),
    [totalEthTx.data]
  );

  return (
    <div className="ml-1 flex w-full items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <ArrowLeftRight size={20} />
        <div className="flex flex-col items-start text-xs">
          <p className="text-xs uppercase text-stone-500">Transactions</p>
          <Tooltip content="Total transactions" side="top">
            <p className="font-semibold text-stone-950">
              {totalAmountTx && !isNaN(Number(totalAmountTx))
                ? Number(totalAmountTx).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : '-'}
              M
            </p>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-end text-xs">
        <p className="text-xs uppercase text-stone-500">med gas price</p>
        <Tooltip content="Med gas price on last 10 blocks" side="top">
          <p className="font-semibold text-stone-950">
            {medGasPrice.data && !isNaN(medGasPrice.data) ? medGasPrice.data?.toFixed(2) : '-'} Gwei
          </p>
        </Tooltip>
      </div>
    </div>
  );
};

const EtherMarketCap = ({ ethPrice }: { ethPrice: number }) => {
  const ETH_SUPPLY = 120488571.19;

  const marketCap = useMemo(() => ethPrice * ETH_SUPPLY, [ethPrice]);

  return (
    <div className="ml-1 flex items-center gap-2">
      <Globe size={20} />
      <div className="flex flex-col text-xs">
        <p className="text-xs uppercase text-stone-500">Market cap</p>
        <p className="font-semibold text-stone-950">
          $
          {marketCap.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
};

const EtherPrice = ({ ethPrice }: { ethPrice: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ether-info'],
    queryFn: async (): Promise<[GetEtherPriceOutput, number]> =>
      await Promise.all([getEtherBtcPrice(), getEtherPercentage()]),
  });

  const ethBtcPrice = useMemo(() => Number(data?.[0].price).toFixed(5), [data]);
  const percentage = useMemo(() => Number(String(data?.[1]).slice(0, 4)), [data]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex w-full items-center gap-2">
      <img
        src="https://etherscan.io/images/svg/brands/ethereum-original.svg"
        alt="ethereum logo"
        className="size-7"
      />
      <div className="flex flex-col">
        <p className="text-xs uppercase text-stone-500">Ether Price</p>
        <div className="flex items-center gap-2">
          {data && (
            <Tooltip content="View historical price">
              <Link to="/chart/etherprice">
                <div className="flex items-center gap-2 text-xs">
                  <p className="font-semibold text-stone-950">${ethPrice}</p>
                  <p className="text-stone-700">@{ethBtcPrice} BTC</p>
                  <p className={cn(percentage >= 0 ? 'text-emerald-600' : 'text-destructive')}>
                    ({percentage >= 0 && '+'}
                    {percentage}%)
                  </p>
                </div>
              </Link>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default EtherInfoCard;
