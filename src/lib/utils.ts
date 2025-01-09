import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Transaction, formatEther } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBlockReward(
  baseFeePerGas: bigint | null,
  gasUsed: bigint,
  transactions: Pick<Transaction, 'gas' | 'gasPrice'>[]
) {
  const burntFees = Number(baseFeePerGas) * Number(gasUsed);

  const transactionsFees = transactions.reduce<number>((totalFees, tx) => {
    return totalFees + Number(tx.gasPrice) * Number(tx.gas);
  }, 0);

  return Number(formatEther(BigInt(transactionsFees))) - Number(formatEther(BigInt(burntFees)));
}

export function formatRelativeTime(timestamp: number) {
  const givenTime = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  const currentTime = new Date(); // Current time
  const diffInSeconds = Math.floor((currentTime.getTime() - givenTime.getTime()) / 1000); // Difference in seconds

  if (diffInSeconds < 60) {
    return `${diffInSeconds} secs ago`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes} min ago`;
  } else {
    return '-';
  }
}

export function formatHash(hash: string) {
  const firstBlock = hash.slice(0, 10);
  const lastBlock = hash.slice(hash.length - 9, hash.length - 1);

  return firstBlock + '...' + lastBlock;
}

export function formatEth(ether: number) {
  return String(ether).slice(0, 7);
}
