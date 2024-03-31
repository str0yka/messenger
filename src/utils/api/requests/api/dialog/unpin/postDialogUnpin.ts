import { $api } from '~/utils/api';

export interface PostDialogUnpinParams {
  dialogId: number;
}

export interface PostDialogUnpinSuccessResponse {
  dialogs: {
    pinned: Dialog[];
    unpinned: Dialog[];
  };
}

export type PostDialogUnpinFailureResponse = ApiErrorResponse;

export type PostDialogUnpinRequestConfig = RequestConfig<PostDialogUnpinParams>;

export const postDialogUnpin = async ({ params, config }: PostDialogUnpinRequestConfig) =>
  $api
    .post<PostDialogUnpinSuccessResponse>('/dialog/unpin', params, config)
    .then((res) => res.data);
