import type { Status } from '@bull-board/api/typings/app';
import cn from 'clsx';
import React from 'react';
import OverviewDropDownActions from '../../components/OverviewDropDownActions/OverviewDropDownActions';
import { QueueCard } from '../../components/QueueCard/QueueCard';
import { StatusLegend } from '../../components/StatusLegend/StatusLegend';
import { useQuery } from '../../hooks/useQuery';
import { useQueues } from '../../hooks/useQueues';
import { useSortQueues } from '../../hooks/useSortQueues';
import s from './OverviewPage.module.css';

export const OverviewPage = () => {
  const { actions, queues } = useQueues();
  const query = useQuery();

  actions.pollQueues();

  const selectedStatus = query.get('status') as Status;
  const filteredQueues =
    queues?.filter((queue) => !selectedStatus || queue.counts[selectedStatus] > 0) || [];

  const {
    sortedQueues: queuesToView,
    onSort,
    sortKey,
    sortDirection,
  } = useSortQueues(filteredQueues);

  return (
    <section className="px-4 py-6 md:px-8">
      <div className={cn(s.header, 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4')}>
        <StatusLegend />
        <OverviewDropDownActions
          actions={actions}
          queues={queues}
          onSort={onSort}
          sortBy={sortKey}
          sortDirection={sortDirection}
        />
      </div>
      <ul className={cn(s.overview, 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6')}>
        {queuesToView.map((queue) => (
          <li key={queue.name} className="w-full">
            <QueueCard queue={queue} />
          </li>
        ))}
      </ul>
    </section>
  );
};
