import React from 'react';
import { useApiQuery } from '../../support/api/hooks.ts';
import { BackendEndpoint } from '../../support/api/api-schema.ts';

/**
 * UsersView
 */
export const UsersView: React.FC = () => {
  const { data, loading, error, refetch } = useApiQuery(
    BackendEndpoint.GetUsers,
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
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Username: {user.username}</p>
          <p>Profile Rank: {user.profileRank}</p>
          {user.profilePictureUrl && <img src={user.profilePictureUrl} alt="Profile" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
        </div>
      ))}
      {/* Displaying data */}
      <p>Data: {JSON.stringify(data)}</p>
      {/* Displaying loading state */}
      console.log("hello");
      {/* <p>Loading: {JSON.stringify(loading)}</p>
      <p>Error: {JSON.stringify(error)}</p>
      <p>Refetch: {JSON.stringify(refetch)}</p> */}
    </div>
  );
};
