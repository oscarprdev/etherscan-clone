import Link from './ui/link';
import { Tooltip } from './ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { cn } from '~/lib/utils';
import { GetEtherBtcPriceOutput, getEtherBtcPrice } from '~/services/get-ether-btc-price';
import { getEtherPercentage } from '~/services/get-ether-percentage';
import { GetEtherPriceOutput, getEtherPrice } from '~/services/get-ether-price';

const EtherInfoCard = () => {
  return (
    <div className="-mt-16 w-screen p-5 sm:p-10">
      <article className="flex flex-col items-center justify-between rounded-lg border border-border bg-white p-5 shadow-md lg:flex-row">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <div className="flex w-full flex-col items-start gap-2 md:border-r md:pr-5">
            <EtherPrice />
            <span className="h-[0.1rem] w-full bg-gray-100"></span>
            <p>Market cap</p>
          </div>

          <div className="flex w-full flex-col items-start gap-2 md:border-r md:px-5">
            <p>Transactions</p>
            <p>Last Finalized Block</p>
          </div>
        </div>
        <div className="grid w-full place-items-center">chart</div>
      </article>
    </div>
  );
};

const EtherPrice = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['ether-price'],
    queryFn: async (): Promise<[GetEtherBtcPriceOutput, GetEtherPriceOutput, number]> =>
      await Promise.all([getEtherPrice(), getEtherBtcPrice(), getEtherPercentage()]),
  });

  const etherPrice = useMemo(() => Number(data?.[0].price).toFixed(2), [data]);
  const ethBtcPrice = useMemo(() => Number(data?.[1].price).toFixed(5), [data]);
  const percentage = useMemo(() => Number(String(data?.[2]).slice(0, 4)), [data]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex w-full items-center gap-2">
      <img
        src="https://etherscan.io/images/svg/brands/ethereum-original.svg"
        alt="ethereum logo"
        className="size-7"
      />
      <div className="flex flex-col">
        <p className="text-xs uppercase">Ether Price</p>
        <div className="flex items-center gap-2">
          {data && (
            <Tooltip content="View historical price">
              <Link to="/chart/etherprice">
                <div className="flex items-center gap-2 text-xs">
                  <p className="font-semibold text-stone-950">${etherPrice}</p>
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
