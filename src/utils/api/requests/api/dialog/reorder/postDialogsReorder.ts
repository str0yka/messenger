import { $api } from '~/utils/api';

export interface PostDialogsReorderParams {
  dialogs: {
    dialogId: number;
    order: number;
  }[];
}

export interface PostDialogsReorderSuccessResponse {
  dialogs: {
    pinned: Dialog[];
    unpinned: Dialog[];
  };
}

export type PostDialogsReorderFailureResponse = ApiErrorResponse;

export type PostDialogsReorderRequestConfig = RequestConfig<PostDialogsReorderParams>;

export const postDialogsReorder = async ({ params, config }: PostDialogsReorderRequestConfig) =>
  $api
    .post<PostDialogsReorderSuccessResponse>('/dialogs/reorder', params, config)
    .then((res) => res.data);
