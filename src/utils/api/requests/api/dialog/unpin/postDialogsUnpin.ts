import { $api } from '~/utils/api';

export interface PostDialogsUnpinParams {
  dialogId: number;
}

export interface PostDialogsUnpinSuccessResponse {
  dialogs: {
    pinned: Dialog[];
    unpinned: Dialog[];
  };
}

export type PostDialogsUnpinFailureResponse = ApiErrorResponse;

export type PostDialogsUnpinRequestConfig = RequestConfig<PostDialogsUnpinParams>;

export const postDialogsUnpin = async ({ params, config }: PostDialogsUnpinRequestConfig) =>
  $api
    .post<PostDialogsUnpinSuccessResponse>('/dialogs/unpin', params, config)
    .then((res) => res.data);
