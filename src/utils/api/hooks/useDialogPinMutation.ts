import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postDialogPin } from '../requests';
import type {
  PostDialogPinSuccessResponse,
  PostDialogPinFailureResponse,
  PostDialogPinRequestConfig,
} from '../requests';

export const useDialogPinMutation = (
  options?: UseMutationOptions<
    PostDialogPinSuccessResponse,
    PostDialogPinFailureResponse,
    PostDialogPinRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postDialogPin'],
    ...options,
    mutationFn: postDialogPin,
  });
