import cn from 'clsx';
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { ArrowLeftIcon } from '../../components/Icons/ArrowLeft';
import { JobCard } from '../../components/JobCard/JobCard';
import { StickyHeader } from '../../components/StickyHeader/StickyHeader';
import { useActiveQueue } from '../../hooks/useActiveQueue';
import { useJob } from '../../hooks/useJob';
import { useModal } from '../../hooks/useModal';
import { useSelectedStatuses } from '../../hooks/useSelectedStatuses';
import { useActiveJobId } from '../../hooks/useActiveJobId';
import { links } from '../../utils/links';
import buttonS from '../../components/Button/Button.module.css';
import { JobFlow } from '../../components/JobFlow/JobFlow';

const AddJobModalLazy = React.lazy(() =>
  import('../../components/AddJobModal/AddJobModal').then(({ AddJobModal }) => ({
    default: AddJobModal,
  }))
);

const UpdateJobDataModalLazy = React.lazy(() =>
  import('../../components/UpdateJobDataModal/UpdateJobDataModal').then(
    ({ UpdateJobDataModal }) => ({
      default: UpdateJobDataModal,
    })
  )
);

export const JobPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const queue = useActiveQueue();
  const { job, status, actions } = useJob();
  const selectedStatuses = useSelectedStatuses();
  const modal = useModal<'updateJobData' | 'addJob'>();
  const activeJobId = useActiveJobId();

  useEffect(() => {
    if (activeJobId) {
      actions.getJob();
    }
  }, [activeJobId]);

  actions.pollJob();

  if (!queue) {
    return <section>{t('QUEUE.NOT_FOUND')}</section>;
  }

  if (!job) {
    return <section>{t('JOB.NOT_FOUND')}</section>;
  }

  const cleanJob = async () => {
    await actions.cleanJob(queue.name)(job)();
    history.replace(links.queuePage(queue.name, selectedStatuses));
  };

  return (
    <section className="px-4 py-6 md:px-8 max-w-7xl mx-auto">
      <StickyHeader
        actions={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <Link
              className={cn(buttonS.button, buttonS.default, 'shrink-0')}
              to={links.queuePage(queue.name, selectedStatuses)}
            >
              <ArrowLeftIcon />
            </Link>
            <div className="text-lg font-semibold truncate capitalize">
              {t('JOB.STATUS', { status: status.toLocaleUpperCase() })}
            </div>
          </div>
        }
      />
      <JobCard
        key={job.id}
        job={job}
        status={status}
        actions={{
          cleanJob,
          promoteJob: actions.promoteJob(queue.name)(job),
          retryJob: actions.retryJob(queue.name)(job),
          getJobLogs: actions.getJobLogs(queue.name)(job),
          updateJobData: () => modal.open('updateJobData'),
          duplicateJob: () => modal.open('addJob'),
        }}
        readOnlyMode={queue.readOnlyMode}
        allowRetries={(job.isFailed || queue.allowCompletedRetries) && queue.allowRetries}
      />
      <JobFlow />
      <Suspense fallback={null}>
        {modal.isMounted('addJob') && (
          <AddJobModalLazy
            open={modal.isOpen('addJob')}
            onClose={modal.close('addJob')}
            job={job}
          />
        )}
        {modal.isMounted('updateJobData') && (
          <UpdateJobDataModalLazy
            open={modal.isOpen('updateJobData')}
            onClose={modal.close('updateJobData')}
            job={job}
          />
        )}
      </Suspense>
    </section>
  );
};
