import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { deleteMessageFormScheme } from '../constants';
import type { DeleteMessageFormScheme } from '../constants';

interface UseDeleteMessageDialogParams {
  onDelete: (deleteForEveryone: boolean) => void;
}

export const useDeleteMessageDialog = ({ onDelete }: UseDeleteMessageDialogParams) => {
  const deleteMessageForm = useForm<DeleteMessageFormScheme>({
    defaultValues: { deleteForEveryone: false },
    resolver: zodResolver(deleteMessageFormScheme),
  });

  const onSubmit = deleteMessageForm.handleSubmit(({ deleteForEveryone }) =>
    onDelete(deleteForEveryone),
  );

  return {
    form: deleteMessageForm,
    functions: {
      onSubmit,
    },
  };
};
