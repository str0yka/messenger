import { useQuery } from 'react-query';
import type { UseQueryOptions } from 'react-query';

import { getDialogs } from '../requests';
import type {
  GetDialogsSuccessResponse,
  GetDialogsFailureResponse,
  GetDialogsRequestConfig,
} from '../requests';

type UseDialogsQueryParams = GetDialogsRequestConfig & {
  options?: UseQueryOptions<GetDialogsSuccessResponse, GetDialogsFailureResponse>;
};

export const useDialogsQuery = (params?: UseDialogsQueryParams) => {
  const { options, ...queryFnParams } = params ?? {};

  return useQuery({
    queryKey: ['getDialogs'],
    ...options,
    queryFn: () => getDialogs(queryFnParams),
  });
};
