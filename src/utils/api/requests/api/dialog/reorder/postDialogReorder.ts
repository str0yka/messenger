import { $api } from '~/utils/api';

export interface PostDialogReorderParams {
  dialogs: {
    dialogId: number;
    order: number;
  }[];
}

export interface PostDialogReorderSuccessResponse {
  dialogs: {
    pinned: Dialog[];
    unpinned: Dialog[];
  };
}

export type PostDialogReorderFailureResponse = ApiErrorResponse;

export type PostDialogReorderRequestConfig = RequestConfig<PostDialogReorderParams>;

export const postDialogReorder = async ({ params, config }: PostDialogReorderRequestConfig) =>
  $api
    .post<PostDialogReorderSuccessResponse>('/dialog/reorder', params, config)
    .then((res) => res.data);
