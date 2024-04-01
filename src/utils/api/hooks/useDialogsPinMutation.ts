import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postDialogsPin } from '../requests';
import type {
  PostDialogsPinSuccessResponse,
  PostDialogsPinFailureResponse,
  PostDialogsPinRequestConfig,
} from '../requests';

export const useDialogsPinMutation = (
  options?: UseMutationOptions<
    PostDialogsPinSuccessResponse,
    PostDialogsPinFailureResponse,
    PostDialogsPinRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postDialogsPin'],
    ...options,
    mutationFn: postDialogsPin,
  });
