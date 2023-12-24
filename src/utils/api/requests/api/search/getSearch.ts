import { $api } from '~/utils/api';

export interface SearchParams<SearchType extends ApiSearchType> {
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

export const getSearch = async <SearchType extends ApiSearchType>({
  type,
  query,
  limit,
  page,
}: SearchParams<SearchType>) => {
  const searchParams = new URLSearchParams({ type, query });
  if (limit) searchParams.set('limit', limit.toString());
  if (page) searchParams.set('page', page.toString());

  return $api
    .get<GetSearchSuccessResponse<SearchType>>(`/search?${searchParams.toString()}`)
    .then((res) => res.data);
};
