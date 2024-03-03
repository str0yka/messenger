import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postVerifyById } from '../requests';
import type {
  PostVerifyByIdSuccessResponse,
  PostVerifyByIdFailureResponse,
  PostVerifyByIdRequestConfig,
} from '../requests';

export const useVerifyByIdMutation = (
  options?: UseMutationOptions<
    PostVerifyByIdSuccessResponse,
    PostVerifyByIdFailureResponse,
    PostVerifyByIdRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postVerifyById'],
    ...options,
    mutationFn: postVerifyById,
  });
