import { $api } from '~/utils/api';

export interface PostVerifyByIdParams {
  userId: number;
  verificationCode: string;
}

export interface PostVerifyByIdSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type PostVerifyByIdFailureResponse = ApiErrorResponse;

export type PostVerifyByIdRequestConfig = RequestConfig<PostVerifyByIdParams>;

export const postVerifyById = async ({
  params: { userId, ...params },
  config,
}: PostVerifyByIdRequestConfig) =>
  $api
    .post<PostVerifyByIdSuccessResponse>(`/verify/${userId}`, params, config)
    .then((res) => res.data);
