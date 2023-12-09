import { $api } from '~/utils/api';

export interface GetRefreshSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type GetRefreshFailureResponse = ApiErrorResponse;

export const getRefresh = async () =>
  $api.get<GetRefreshSuccessResponse>('/refresh').then((res) => res.data);
