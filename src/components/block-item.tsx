import { type Block } from 'viem';
import { getBlockReward } from '~/lib/utils';

const BlockItem = ({
  number,
  timestamp,
  miner,
  transactions,
  baseFeePerGas,
  gasUsed,
}: Pick<
  Block<bigint, true>,
  'number' | 'timestamp' | 'miner' | 'transactions' | 'baseFeePerGas' | 'gasUsed'
>) => {
  const blockReward = getBlockReward(
    baseFeePerGas,
    gasUsed,
    transactions.map(tr => ({
      gas: tr.gas,
      gasPrice: tr.gasPrice,
    }))
  );

  return (
    <article>
      <div>
        <p>{Number(number)}</p>
        <p>{new Date(Number(timestamp) * 1000).toLocaleString()}</p>
      </div>
      <div>
        <p>Miner {miner}</p>
        <p>{transactions.length} txns</p>
      </div>
      <span>{blockReward} Eth</span>
    </article>
  );
};

export default BlockItem;
