import { base } from '~/redux/api/base';

import { getPubKeyHashes } from '../helpers/wallet/getPubKeyHashes';

export const pubKeyHashesApi = base.injectEndpoints({
  endpoints: (builder) => ({
    getPubKeyHashes: builder.query<string[], void>({
      queryFn: async () => {
        try {
          const pubKeyHashes = await getPubKeyHashes();
          return { data: pubKeyHashes };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetPubKeyHashesQuery } = pubKeyHashesApi;
