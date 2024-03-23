import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postProfileUpdate } from '../requests';
import type {
  PostProfileUpdateSuccessResponse,
  PostProfileUpdateFailureResponse,
  PostProfileUpdateRequestConfig,
} from '../requests';

export const useProfileUpdateMutation = (
  options?: UseMutationOptions<
    PostProfileUpdateSuccessResponse,
    PostProfileUpdateFailureResponse,
    PostProfileUpdateRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postProfileUpdate'],
    ...options,
    mutationFn: postProfileUpdate,
  });
