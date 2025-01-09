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
