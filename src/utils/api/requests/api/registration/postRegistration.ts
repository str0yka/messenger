import { $api } from '~/utils/api';

export interface PostRegistrationParams {
  name: string;
  email: string;
  password: string;
}

export interface PostRegistrationSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type PostRegistrationFailureResponse = ApiErrorResponse;

export type PostRegistrationRequestConfig = RequestConfig<PostRegistrationParams>;

export const postRegistration = async ({ params, config }: PostRegistrationRequestConfig) =>
  $api
    .post<PostRegistrationSuccessResponse>('/registration', params, config)
    .then((res) => res.data);
