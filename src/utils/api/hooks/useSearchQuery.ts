import { useQuery } from 'react-query';
import type { UseQueryOptions } from 'react-query';

import { getSearch } from '../requests';
import type {
  GetSearchSuccessResponse,
  GetSearchFailureResponse,
  GetSearchRequestConfig,
} from '../requests';

type UseSearchQueryParams<SearchType extends ApiSearchType> = GetSearchRequestConfig<SearchType> & {
  options: UseQueryOptions<GetSearchSuccessResponse<SearchType>, GetSearchFailureResponse>;
};

export const useSearchQuery = <SearchType extends ApiSearchType>({
  options,
  ...queryFnParams
}: UseSearchQueryParams<SearchType>) =>
  useQuery({
    queryKey: ['getSearch'],
    ...options,
    queryFn: () => getSearch(queryFnParams),
  });
