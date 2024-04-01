import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postDialogsReorder } from '../requests';
import type {
  PostDialogsReorderSuccessResponse,
  PostDialogsReorderFailureResponse,
  PostDialogsReorderRequestConfig,
} from '../requests';

export const useDialogsReorderMutation = (
  options?: UseMutationOptions<
    PostDialogsReorderSuccessResponse,
    PostDialogsReorderFailureResponse,
    PostDialogsReorderRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postDialogsReorder'],
    ...options,
    mutationFn: postDialogsReorder,
  });
