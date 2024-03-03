import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postLogin } from '../requests';
import type {
  PostLoginSuccessResponse,
  PostLoginFailureResponse,
  PostLoginRequestConfig,
} from '../requests';

export const useLoginMutation = (
  options?: UseMutationOptions<
    PostLoginSuccessResponse,
    PostLoginFailureResponse,
    PostLoginRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postLogin'],
    ...options,
    mutationFn: postLogin,
  });
