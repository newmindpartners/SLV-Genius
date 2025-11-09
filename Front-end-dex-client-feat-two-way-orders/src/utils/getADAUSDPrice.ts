import axios, { AxiosResponse } from 'axios';

export type GetUSDPriceResponse = {
  data: { base: string | null; currency: string | null; amount: string | null };
};

export async function getUSDPrice(
  link: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<GetUSDPriceResponse, any>> {
  const response = await axios.get<GetUSDPriceResponse>(link);

  return response;
}

export default getUSDPrice;
