import { $api } from '~/utils/api';

export type PostLogoutSuccessResponse = Record<string, never>;

export type PostLogoutFailureResponse = ApiErrorResponse;

export type PostLogoutRequestConfig = RequestConfig;

export const postLogout = async (params?: PostLogoutRequestConfig) =>
  $api.post<PostLogoutSuccessResponse>('/logout', {}, params?.config).then((res) => res.data);
