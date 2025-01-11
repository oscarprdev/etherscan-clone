import { BINANCE_API_URL } from '~/constants';

export const getEtherPercentage = async (): Promise<number> => {
  const response = await fetch(
    `${BINANCE_API_URL}/api/v3/klines?symbol=ETHUSDT&interval=1h&limit=2`
  );
  const data = await response.json();

  const previousClose = parseFloat(data[0][4]);
  const currentClose = parseFloat(data[1][4]);

  return ((currentClose - previousClose) / previousClose) * 100;
};
