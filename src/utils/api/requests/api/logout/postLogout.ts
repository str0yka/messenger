import { $api } from '~/utils/api';

export type PostLogoutSuccessResponse = Record<string, never>;

export type PostLogoutFailureResponse = ApiErrorResponse;

export const postLogout = async () =>
  $api.post<PostLogoutSuccessResponse>('/logout').then((res) => res.data);
