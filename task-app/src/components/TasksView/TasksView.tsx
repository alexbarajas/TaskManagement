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

  console.log("Data:", data);
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Refetch:", refetch);

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
      {data && data.map(user => (
        <div key={user.id} style={{ border: '1px solid #ccc', padding: '1em' }}>
          <p>ID: {user.id}</p>
          <p>Title: {user.title}</p>
          <p>Description: {user.description}</p>
          <p>Status: {user.status}</p>
          <p>Priority: {user.priority}</p>
          <p>Assigned Users: {user.assignedUsers}</p> {/* This will show as an error due to assignedUsers being empty sometimes but it's fine */}
        </div>
      ))}
      {/* Displaying data */}
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
};
