import { $api } from '~/utils/api';

export type PostProfileUpdateParams =
  | Partial<Pick<User, 'bio' | 'lastname' | 'name' | 'username'>>
  | FormData;

export interface PostProfileUpdateSuccessResponse {
  user: User;
}

export type PostProfileUpdateFailureResponse = ApiErrorResponse;

export type PostProfileUpdateRequestConfig = RequestConfig<PostProfileUpdateParams>;

export const postProfileUpdate = async ({ params, config }: PostProfileUpdateRequestConfig) =>
  $api.post<PostProfileUpdateSuccessResponse>('/update', params, config).then((res) => res.data);
