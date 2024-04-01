import { $api } from '~/utils/api';

export interface PostDialogsPinParams {
  dialogId: number;
}

export interface PostDialogsPinSuccessResponse {
  dialogs: {
    pinned: Dialog[];
    unpinned: Dialog[];
  };
}

export type PostDialogsPinFailureResponse = ApiErrorResponse;

export type PostDialogsPinRequestConfig = RequestConfig<PostDialogsPinParams>;

export const postDialogsPin = async ({ params, config }: PostDialogsPinRequestConfig) =>
  $api.post<PostDialogsPinSuccessResponse>('/dialogs/pin', params, config).then((res) => res.data);
