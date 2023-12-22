import { $api } from '~/utils/api';

export interface SearchParams {
  query: string;
  limit?: number;
  page?: number;
}

export type GetSearchSuccessResponse = User[];

export type GetSearchFailureResponse = ApiErrorResponse;

export const getSearch = async ({ query, limit, page }: SearchParams) => {
  const searchParams = new URLSearchParams();
  searchParams.set('query', query);
  if (limit) searchParams.set('limit', limit.toString());
  if (page) searchParams.set('page', page.toString());

  return $api
    .get<GetSearchSuccessResponse>(`/search?${searchParams.toString()}`)
    .then((res) => res.data);
};
