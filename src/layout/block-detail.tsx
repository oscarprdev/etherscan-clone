import { useQuery } from '@tanstack/react-query';
import { getBlock } from '@wagmi/core';
import { CircleCheck, CircleDot, CircleHelp, Clock, ShieldCheck } from 'lucide-react';
import { PropsWithChildren, ReactNode, useMemo } from 'react';
import { useParams } from 'react-router';
import { getBlockQueryKey } from 'wagmi/query';
import { Badge } from '~/components/ui/badge';
import { Tooltip } from '~/components/ui/tooltip';
import { config } from '~/config';
import { formatRelativeTime } from '~/lib/utils';

const BlockDetail = () => {
  const { id } = useParams();
  const block = useQuery({
    queryKey: ['block'],
    queryFn: async () => await getBlock(config, { blockNumber: id ? BigInt(id) : undefined }),
  });

  const blockStates = useQuery({
    queryKey: [getBlockQueryKey],
    queryFn: async () =>
      await Promise.all([
        getBlock(config, { blockTag: 'finalized' }),
        getBlock(config, { blockTag: 'safe' }),
        getBlock(config, { blockTag: 'pending' }),
      ]),
  });

  return (
    <main className="flex h-full w-screen flex-col bg-gray-100 px-5 sm:px-10">
      <section className="mt-5 flex items-center gap-2 border-b py-5">
        <h2 className="font-semibold text-stone-900">Block </h2>
        <span className="text-xs text-stone-600">#{id}</span>
      </section>
      <section className="flex w-full flex-col gap-2 py-5">
        <h3 className="mt-10 font-semibold text-stone-900">Overview</h3>
        <article className="flex w-full flex-col items-start gap-2 rounded-lg bg-white p-5 text-sm shadow-md">
          <CardItem
            label="Block height"
            tooltipContent="Also known as block number. The block height which indicates the length of the blockchain, increases after the addition of a new block">
            <p className="text-stone-900">{Number(block.data?.number)}</p>
          </CardItem>
          <CardItem
            label="Status"
            tooltipContent="Also known as block number. The block height which indicates the length of the blockchain, increases after the addition of a new block">
            <BadgeBlockState
              number={Number(block.data?.number)}
              finalized={Number(blockStates.data?.[0].number)}
              safe={Number(blockStates.data?.[1].number)}
              pending={Number(blockStates.data?.[2].number)}
            />
          </CardItem>
          <CardItem
            label="Timestamp"
            tooltipContent="Also known as block number. The block height which indicates the length of the blockchain, increases after the addition of a new block">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <p className="text-xs text-stone-900">
                {formatRelativeTime(Number(block.data?.timestamp))}
              </p>
              {block.data && (
                <p className="text-xs text-stone-700">
                  ({new Date(Number(block?.data?.timestamp) * 1000).toLocaleString()})
                </p>
              )}
            </div>
          </CardItem>
        </article>
      </section>
    </main>
  );
};

const CardItem = ({
  tooltipContent,
  label,
  children,
}: PropsWithChildren<{
  tooltipContent: string;
  label: string;
}>) => {
  return (
    <div className="flex w-full items-center">
      <div className="flex w-1/4 items-center gap-2">
        <Tooltip content={tooltipContent} side="right">
          <CircleHelp size={16} className="text-stone-500" />
        </Tooltip>
        <p className="font-medium text-stone-500">{label}: </p>
      </div>
      {children}
    </div>
  );
};

const BadgeBlockState = ({
  number,
  finalized,
  safe,
  pending,
}: {
  number: number;
  finalized: number;
  safe: number;
  pending: number;
}) => {
  const state = useMemo(() => {
    let text = '';
    let icon: ReactNode;
    let style = '';

    if (number <= finalized) {
      text = 'Finalized';
      style = 'bg-emerald-100 border border-emerald-400 text-emerald-600';
      icon = <CircleCheck className="fill-emerald-600 text-emerald-100" size={15} />;
    } else if (number <= safe) {
      text = 'Safe';
      style = 'bg-zinc-100 border border-zinc-400 text-zinc-600';
      icon = <ShieldCheck className="text-zinc-700" size={15} />;
    } else if (number <= pending) {
      text = 'Pending';
      style = 'bg-orange-100 border border-orange-400 text-orange-600';
      icon = <CircleDot className="text-orange-400" size={15} />;
    } else {
      text = 'undefined';
      style = 'bg-zinc-100 border border-zinc-400 text-zinc-600';
      icon = <CircleHelp className="text-stone-500" size={15} />;
    }

    return { text, icon, style };
  }, [number, finalized, safe, pending]);

  return (
    <Badge className={state.style}>
      <div className="flex items-center gap-1">
        {state.icon}
        {state.text}
      </div>
    </Badge>
  );
};

export default BlockDetail;
