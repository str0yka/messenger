import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postUpload } from '../requests';
import type {
  PostUploadSuccessResponse,
  PostUploadFailureResponse,
  PostUploadRequestConfig,
} from '../requests';

export const useUploadMutation = (
  options?: UseMutationOptions<
    PostUploadSuccessResponse,
    PostUploadFailureResponse,
    PostUploadRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postUpload'],
    ...options,
    mutationFn: postUpload,
  });
