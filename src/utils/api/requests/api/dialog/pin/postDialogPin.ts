import { $api } from '~/utils/api';

export interface PostDialogPinParams {
  dialogId: number;
}

export interface PostDialogPinSuccessResponse {
  dialogs: {
    pinned: Dialog[];
    unpinned: Dialog[];
  };
}

export type PostDialogPinFailureResponse = ApiErrorResponse;

export type PostDialogPinRequestConfig = RequestConfig<PostDialogPinParams>;

export const postDialogPin = async ({ params, config }: PostDialogPinRequestConfig) =>
  $api.post<PostDialogPinSuccessResponse>('/dialog/pin', params, config).then((res) => res.data);
