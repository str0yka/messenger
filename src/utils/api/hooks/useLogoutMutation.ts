import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postLogout } from '../requests';
import type {
  PostLogoutFailureResponse,
  PostLogoutRequestConfig,
  PostLogoutSuccessResponse,
} from '../requests';

export const useLogoutMutation = (
  options?: UseMutationOptions<
    PostLogoutSuccessResponse,
    PostLogoutFailureResponse,
    PostLogoutRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postLogout'],
    ...options,
    mutationFn: postLogout,
  });
