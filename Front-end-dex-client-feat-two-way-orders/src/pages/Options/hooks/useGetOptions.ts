import { base } from '~/redux/api/base';

import { fetchOptions } from '../helpers/options/getOptions';
import { OptionDto } from '../types/OptionDto';

export const optionsApi = base.injectEndpoints({
  endpoints: (builder) => ({
    getOptions: builder.query<OptionDto[], void>({
      queryFn: async () => {
        try {
          const options = await fetchOptions();
          return { data: options };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetOptionsQuery } = optionsApi;
