import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import { Intl } from '~/components';
import { Dialog, DropdownMenu, IconButton, Input, Button } from '~/components/common';
import {
  IconCross,
  IconPaperClip,
  IconPaperPlane,
  IconPicture,
  IconReply,
} from '~/components/common/icons';
import { IMAGE_URL } from '~/utils/constants';
import { getUserName } from '~/utils/helpers';

import { useMiddleColumnFooter } from './hooks';

export const MiddleColumnFooter = () => {
  const { refs, state, functions, form } = useMiddleColumnFooter();

  return (
    <>
      <form
        className={cn('mx-auto flex w-full gap-2 px-2 pb-4 pt-1', 'md:w-8/12 md:px-0', 'xl:w-6/12')}
        onSubmit={functions.onSubmit(null)}
      >
        <div className="w-full grow">
          <AnimatePresence mode="popLayout">
            {state.forwardMessage && (
              <motion.div
                key="forwardMessage"
                className="flex items-center gap-2 rounded-t-2xl bg-neutral-800 px-2 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <IconReply className="-scale-x-100 text-primary-400" />
                </div>
                <div
                  className={cn(
                    'flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-primary-400 bg-primary-400/10 px-1',
                    'hover:bg-primary-400/25',
                  )}
                >
                  <p className="block truncate text-sm leading-4 text-primary-500">
                    <Intl path="page.home.middleColumn.footer.forwardMessage" />
                  </p>
                  <p className="truncate text-sm leading-5 text-neutral-300/75">
                    {getUserName(state.forwardMessage.message.user)}:{' '}
                    {state.forwardMessage.message.text}
                  </p>
                </div>
                <div className="shrink-0">
                  <IconButton onClick={functions.resetForwardMessage}>
                    <IconCross className="text-primary-400" />
                  </IconButton>
                </div>
              </motion.div>
            )}
            {state.replyMessage && (
              <motion.div
                key="replyMessage"
                className={cn('flex items-center gap-2 bg-neutral-800 px-2 pt-2', {
                  'rounded-none': state.forwardMessage,
                  'rounded-t-2xl': !state.forwardMessage,
                })}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <IconReply className="text-primary-400" />
                </div>
                <div
                  className={cn(
                    'flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-primary-400 bg-primary-400/10 px-1',
                    'hover:bg-primary-400/25',
                  )}
                  role="button"
                  tabIndex={0}
                  aria-hidden
                  onClick={functions.onClickReplyMessage}
                >
                  <p className="block truncate text-sm leading-4 text-primary-500">
                    <Intl
                      path="page.home.middleColumn.footer.replyTo"
                      values={{
                        name: getUserName(state.replyMessage.user),
                      }}
                    />
                  </p>
                  <p className="truncate text-sm leading-5 text-neutral-300/75">
                    {state.replyMessage.message.text}
                  </p>
                </div>
                <div className="shrink-0">
                  <IconButton onClick={functions.resetReplyMessage}>
                    <IconCross className="text-primary-400" />
                  </IconButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Input
            placeholder={functions.translate(
              'page.home.middleColumn.footer.input.placeholder.message',
            )}
            variant="contained"
            s="l"
            endAdornment={
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton>
                    <IconPaperClip />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-40">
                  <DropdownMenu.Item onClick={functions.triggerFileInput}>
                    <Intl path="page.home.middleColumn.footer.files.images" />
                    <DropdownMenu.Shortcut>
                      <IconPicture />
                    </DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            }
            labelProps={{
              style: { outline: 'none' },
              className: cn(
                (state.replyMessage || state.forwardMessage) && 'rounded-none rounded-b-2xl',
              ),
            }}
            {...form.register('text')}
          />
        </div>
        <div className="shrink-0 self-end">
          <IconButton
            type="submit"
            color="primary"
            s="l"
          >
            <IconPaperPlane />
          </IconButton>
        </div>
      </form>
      <input
        ref={refs.fileInputNodeRef}
        type="file"
        className="hidden"
        onChange={functions.onFileInputChange}
      />
      <Dialog.Root
        open={!!state.isUploadImageDialogOpen}
        onOpenChange={functions.onUploadImageDialogOpenChange}
      >
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content className="flex w-80 flex-col gap-2 rounded-xl bg-neutral-800 p-4">
            <div className="flex items-center gap-4 text-lg font-semibold">
              <Dialog.Close asChild>
                <IconButton>
                  <IconCross />
                </IconButton>
              </Dialog.Close>
              <Intl
                path="page.home.middleColumn.footer.sendPhotosDialog.title"
                values={{ number: 1 }}
              />
            </div>
            <img
              className="rounded-lg"
              src={IMAGE_URL(state.uploadedImage)}
              alt="uploaded"
            />
            <form
              className="flex flex-col gap-2"
              onSubmit={functions.onSubmit(state.uploadedImage)}
            >
              <Input
                labelProps={{ className: 'grow' }}
                variant="outlined"
                placeholder={functions.translate(
                  'page.home.middleColumn.footer.sendPhotosDialog.input.placeholder.caption',
                )}
                {...form.register('text')}
              />
              <Button
                color="primary"
                type="submit"
              >
                <Intl path="page.home.middleColumn.footer.sendPhotosDialog.button.send" />
              </Button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
