import React from 'react';
import { useApiQuery } from '../../support/api/hooks.ts';
import { BackendEndpoint } from '../../support/api/api-schema.ts';

/**
 * This component displays the
 */
export const TasksView: React.FC = () => {
  const { data, loading, error, refetch } = useApiQuery(
    BackendEndpoint.GetTasks,
    { props: { searchText: '' } },
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '.5em',
        maxHeight: '100%',
        overflowY: 'auto',
        padding: '1em',
        // feel free to change these styles!
      }}
    >
      {/* your code here! */}
    </div>
  );
};