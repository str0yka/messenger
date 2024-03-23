import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';

import { postRegistration } from '../requests';
import type {
  PostRegistrationSuccessResponse,
  PostRegistrationFailureResponse,
  PostRegistrationRequestConfig,
} from '../requests';

export const useRegistrationMutation = (
  options?: UseMutationOptions<
    PostRegistrationSuccessResponse,
    PostRegistrationFailureResponse,
    PostRegistrationRequestConfig
  >,
) =>
  useMutation({
    mutationKey: ['postRegistration'],
    ...options,
    mutationFn: postRegistration,
  });
