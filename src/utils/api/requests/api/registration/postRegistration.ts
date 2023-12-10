import { $api } from '~/utils/api';

export interface RegistrationParams {
  email: string;
  password: string;
}

export interface PostRegistrationSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type PostRegistrationFailureResponse = ApiErrorResponse;

export const postRegistration = async (credentials: RegistrationParams) =>
  $api.post<PostRegistrationSuccessResponse>('/registration', credentials).then((res) => res.data);
