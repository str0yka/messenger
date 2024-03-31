import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postDialogReorder } from '../requests';
import type {
  PostDialogReorderSuccessResponse,
  PostDialogReorderFailureResponse,
  PostDialogReorderRequestConfig,
} from '../requests';

export const useDialogReorderMutation = (
  options?: UseMutationOptions<
    PostDialogReorderSuccessResponse,
    PostDialogReorderFailureResponse,
    PostDialogReorderRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postDialogReorder'],
    ...options,
    mutationFn: postDialogReorder,
  });
