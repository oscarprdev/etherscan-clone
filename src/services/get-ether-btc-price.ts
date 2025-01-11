import { BINANCE_API_URL } from '~/constants';

export type GetEtherBtcPriceOutput = { price: string; symbol: string };

export const getEtherBtcPrice = async (): Promise<GetEtherBtcPriceOutput> => {
  const response = await fetch(`${BINANCE_API_URL}/api/v3/ticker/price?symbol=ETHBTC`);
  return await response.json();
};
