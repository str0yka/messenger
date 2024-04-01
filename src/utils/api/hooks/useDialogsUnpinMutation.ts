import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postDialogsUnpin } from '../requests';
import type {
  PostDialogsUnpinSuccessResponse,
  PostDialogsUnpinFailureResponse,
  PostDialogsUnpinRequestConfig,
} from '../requests';

export const useDialogsUnpinMutation = (
  options?: UseMutationOptions<
    PostDialogsUnpinSuccessResponse,
    PostDialogsUnpinFailureResponse,
    PostDialogsUnpinRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postDialogsUnpin'],
    ...options,
    mutationFn: postDialogsUnpin,
  });
