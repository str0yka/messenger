import { useQuery } from 'react-query';
import type { UseQueryOptions } from 'react-query';

import { getRefresh } from '../requests';
import type {
  GetRefreshSuccessResponse,
  GetRefreshFailureResponse,
  GetRefreshRequestConfig,
} from '../requests';

interface UseRefreshQueryParams extends GetRefreshRequestConfig {
  options: UseQueryOptions<GetRefreshSuccessResponse, GetRefreshFailureResponse>;
}

export const useRefreshQuery = ({ options, ...queryFnParams }: UseRefreshQueryParams) =>
  useQuery({
    queryKey: ['getRefresh'],
    ...options,
    queryFn: () => getRefresh(queryFnParams),
  });
