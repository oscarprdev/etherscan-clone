import { BINANCE_API_URL } from '~/constants';

export const getEtherBtcPrice = async () => {
  const response = await fetch(`${BINANCE_API_URL}/api/v3/ticker/price?symbol=ETHBTC`);
  return await response.json();
};
