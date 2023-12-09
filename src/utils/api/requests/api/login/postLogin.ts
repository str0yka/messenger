import { $api } from '~/utils/api';

export interface LoginParams {
  email: string;
  password: string;
}

export interface PostLoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
export type PostLoginFailureResponse = ApiErrorResponse;

export const postLogin = async (credentials: LoginParams) =>
  $api.post<PostLoginSuccessResponse>('/login', credentials).then((res) => res.data);
