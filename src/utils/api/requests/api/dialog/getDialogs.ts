import { $api } from '~/utils/api';

export interface GetDialogsSuccessResponse {
  dialogs: {
    pinned: Dialog[];
    unpinned: Dialog[];
  };
}

export type GetDialogsFailureResponse = ApiErrorResponse;

export type GetDialogsRequestConfig = RequestConfig;

export const getDialogs = async ({ config }: GetDialogsRequestConfig) =>
  $api.get<GetDialogsSuccessResponse>('/dialogs', config).then((res) => res.data);
