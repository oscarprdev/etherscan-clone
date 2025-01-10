import { Tooltip } from './ui/tooltip';
import { cn, formatEth } from '~/lib/utils';

const EtherBadge = ({
  ether,
  className,
  tooltipContent,
}: {
  ether: number;
  tooltipContent: string;
  className?: string;
}) => {
  return (
    <Tooltip content={tooltipContent}>
      <span className={cn(className, 'rounded-md border p-2 text-[0.73em] text-xs font-bold')}>
        {formatEth(ether)} Eth
      </span>
    </Tooltip>
  );
};

export default EtherBadge;
