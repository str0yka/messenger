import { ContextMenu } from '~/components/common';
import { IconPapers, IconTrash } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';

interface MessageContextMenuProps {
  children: React.ReactNode;
  showDeleteButton: boolean;
  onClickCopy: () => void;
  onClickDelete: () => void;
}

export const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  showDeleteButton,
  children,
  onClickCopy,
  onClickDelete,
}) => {
  const intl = useIntl();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="flex flex-col">{children}</ContextMenu.Trigger>
      <ContextMenu.Content className="w-56">
        <ContextMenu.Item onClick={onClickCopy}>
          {intl.t('page.home.middleColumn.main.contextMenu.item.copy')}
          <ContextMenu.Shortcut>
            <IconPapers />
          </ContextMenu.Shortcut>
        </ContextMenu.Item>
        {showDeleteButton && (
          <ContextMenu.Item
            onClick={onClickDelete}
            className="text-red-400"
          >
            {intl.t('page.home.middleColumn.main.contextMenu.item.deleteMessage')}
            <ContextMenu.Shortcut>
              <IconTrash />
            </ContextMenu.Shortcut>
          </ContextMenu.Item>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
