import { $api } from '~/utils/api';

export interface GetSearchParams<SearchType extends ApiSearchType> {
  query: string;
  type: SearchType;
  limit?: number;
  page?: number;
}

export type GetSearchSuccessResponse<SearchType extends ApiSearchType> = SearchType extends 'user'
  ? User[]
  : (Dialog & {
      user: User;
      partner: User;
      lastMessage: Message | null;
      _count: { messages: number };
    })[];

export type GetSearchFailureResponse = ApiErrorResponse;

export type GetSearchRequestConfig<SearchType extends ApiSearchType> = RequestConfig<
  GetSearchParams<SearchType>
>;

export const getSearch = async <SearchType extends ApiSearchType>({
  params: { query, type, limit, page },
  config,
}: GetSearchRequestConfig<SearchType>) => {
  const searchParams = new URLSearchParams({ type, query });
  if (limit) searchParams.set('limit', limit.toString());
  if (page) searchParams.set('page', page.toString());

  return $api
    .get<GetSearchSuccessResponse<SearchType>>(`/search?${searchParams.toString()}`, config)
    .then((res) => res.data);
};
