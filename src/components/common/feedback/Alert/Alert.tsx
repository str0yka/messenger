// AlertRoot

import cn from 'classnames';

import {
  IconCheckCircled,
  IconExclamationPoint,
  IconExclamationTriangle,
  IconInfoCircled,
} from '~/components/common/icons';

interface AlertRootProps {
  severity?: 'error' | 'warning' | 'info' | 'success';
  children?: React.ReactNode;
}

const AlertRoot: React.FC<AlertRootProps> = ({ severity = 'error', children }) => (
  <div
    className={cn('flex w-full items-center gap-3 break-all rounded-md p-3 text-sm', {
      'bg-red-500 text-white': severity === 'error',
      'bg-orange-500 text-white': severity === 'warning',
      'bg-blue-500 text-white': severity === 'info',
      'bg-green-500 text-white': severity === 'success',
    })}
  >
    <div className="h-5 w-5 shrink-0">
      {
        {
          error: <IconExclamationPoint />,
          warning: <IconExclamationTriangle />,
          info: <IconInfoCircled />,
          success: <IconCheckCircled />,
        }[severity]
      }
    </div>
    <div className="grow">{children}</div>
  </div>
);

// AlertLabel

interface AlertLabelProps {
  children?: React.ReactNode;
}

const AlertLabel: React.FC<AlertLabelProps> = ({ children }) => (
  <h2 className="text-base font-semibold">{children}</h2>
);

// Alert

export const Alert = {
  Root: AlertRoot,
  Label: AlertLabel,
};
