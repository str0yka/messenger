import { $api } from '~/utils/api';

export interface PostLoginParams {
  email: string;
  password: string;
}

export interface PostLoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type PostLoginFailureResponse = ApiErrorResponse;

export type PostLoginRequestConfig = RequestConfig<PostLoginParams>;

export const postLogin = async ({ params, config }: PostLoginRequestConfig) =>
  $api.post<PostLoginSuccessResponse>('/login', params, config).then((res) => res.data);
