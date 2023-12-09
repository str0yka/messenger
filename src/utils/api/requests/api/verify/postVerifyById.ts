import { $api } from '~/utils/api';

export interface VerifyByIdParams {
  userId: number;
  body: {
    verificationCode: number;
  };
}

export interface PostVerifyByIdSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type PostVerifyByIdFailureResponse = ApiErrorResponse;

export const postVerifyById = async ({ userId, body }: VerifyByIdParams) =>
  $api.post<PostVerifyByIdSuccessResponse>(`/verify/${userId}`, body).then((res) => res.data);
