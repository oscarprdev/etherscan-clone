import { BINANCE_API_URL } from '~/constants';

export const getEtherPrice = async () => {
  const response = await fetch(`${BINANCE_API_URL}/api/v3/ticker/price?symbol=ETHUSDT`);
  return await response.json();
};
