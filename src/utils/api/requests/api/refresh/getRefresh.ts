import { $api } from '~/utils/api';

export interface GetRefreshSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type GetRefreshFailureResponse = ApiErrorResponse;

export type GetRefreshRequestConfig = RequestConfig;

export const getRefresh = async ({ config }: GetRefreshRequestConfig) =>
  $api.get<GetRefreshSuccessResponse>('/refresh', config).then((res) => res.data);
