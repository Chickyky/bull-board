import type { AppQueue } from '@bull-board/api/typings/app';
import cn from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { links } from '../../utils/links';
import { Card } from '../Card/Card';
import { QueueStats } from './QueueStats/QueueStats';
import s from './QueueCard.module.css';

interface IQueueCardProps {
  queue: AppQueue;
}

export const QueueCard = ({ queue }: IQueueCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className={cn(s.queueCard, 'flex flex-col gap-3 p-4 hover:shadow-lg transition-shadow duration-200')}>
      <div className={cn(s.header, 'flex items-center justify-between gap-2')}>
        <NavLink to={links.queuePage(queue.name)} className={cn(s.link, 'text-lg font-medium truncate flex-1')}>
          {queue.displayName}
        </NavLink>
        {queue.isPaused && (
          <span className={cn(s.pausedBadge, 'text-xs uppercase tracking-wider font-semibold opacity-70')}>
            [ {t('MENU.PAUSED')} ]
          </span>
        )}
      </div>
      <QueueStats queue={queue} />
    </Card>
  );
};
