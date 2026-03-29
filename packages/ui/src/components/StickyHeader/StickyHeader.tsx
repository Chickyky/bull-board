import cn from 'clsx';
import React, { PropsWithChildren } from 'react';
import s from './StickyHeader.module.css';

export const StickyHeader = ({
  actions,
  children,
}: PropsWithChildren<{ actions: React.ReactElement }>) => (
  <div className={cn(s.stickyHeader, 'flex flex-col gap-4 py-4')}>
    <div className="flex items-center justify-between w-full">
      {children}
    </div>
    {!!actions && (
      <div className={cn(s.actionContainer, 'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full')}>
        {actions}
      </div>
    )}
  </div>
);
