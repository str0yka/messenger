import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postDialogUnpin } from '../requests';
import type {
  PostDialogUnpinSuccessResponse,
  PostDialogUnpinFailureResponse,
  PostDialogUnpinRequestConfig,
} from '../requests';

export const useDialogUnpinMutation = (
  options?: UseMutationOptions<
    PostDialogUnpinSuccessResponse,
    PostDialogUnpinFailureResponse,
    PostDialogUnpinRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postDialogUnpin'],
    ...options,
    mutationFn: postDialogUnpin,
  });
