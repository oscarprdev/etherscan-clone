import { BINANCE_API_URL } from '~/constants';

export type GetEtherPriceOutput = { price: string; symbol: string };

export const getEtherPrice = async (): Promise<GetEtherPriceOutput> => {
  const response = await fetch(`${BINANCE_API_URL}/api/v3/ticker/price?symbol=ETHUSDT`);
  return await response.json();
};
