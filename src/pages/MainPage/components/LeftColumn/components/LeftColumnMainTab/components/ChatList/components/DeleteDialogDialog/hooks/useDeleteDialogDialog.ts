import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { deleteDialogFormScheme } from '../constants';
import type { DeleteDialogFormScheme } from '../constants';

interface UseDeleteDialogDialogParams {
  onDelete: (deleteForEveryone: boolean) => void;
}

export const useDeleteDialogDialog = ({ onDelete }: UseDeleteDialogDialogParams) => {
  const deleteDialogForm = useForm<DeleteDialogFormScheme>({
    defaultValues: { deleteForEveryone: false },
    resolver: zodResolver(deleteDialogFormScheme),
  });

  const onSubmit = deleteDialogForm.handleSubmit(({ deleteForEveryone }) =>
    onDelete(deleteForEveryone),
  );

  return {
    form: deleteDialogForm,
    functions: {
      onSubmit,
    },
  };
};
