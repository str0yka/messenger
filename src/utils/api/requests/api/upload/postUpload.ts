import { $api } from '~/utils/api';

export type PostUploadParams = FormData;

export interface PostUploadSuccessResponse {
  fileName: string;
}

export type PostUploadFailureResponse = ApiErrorResponse;

export type PostUploadRequestConfig = RequestConfig<PostUploadParams>;

export const postUpload = async ({ params, config }: PostUploadRequestConfig) =>
  $api.post<PostUploadSuccessResponse>('/upload', params, config).then((res) => res.data);
