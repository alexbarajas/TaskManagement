import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '../../support/api/hooks.ts';
import { BackendEndpoint } from '../../support/api/api-schema.ts';

export const UsersView: React.FC = () => {
  const { data, loading, error, refetch } = useApiQuery(
    BackendEndpoint.GetUsers,
    { props: { searchText: '' } },
  );

  const [newUser, setNewUser] = useState<NewUser>({}); // State for new user input
  const [isCreating, setIsCreating] = useState(false); // State for tracking user creation process
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // State for tracking selected user
  const [isEditing, setIsEditing] = useState<string | null>(null); // State for tracking if user is being edited

  const [deleteUser] = useApiMutation(BackendEndpoint.DeleteUser);
  const [updateUser] = useApiMutation(BackendEndpoint.UpdateUser);

  const handleCreateUser = async () => {
    // make API call to create user using newUser state
    // update refetch after successful creation
    setIsCreating(false);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // make API call to delete user with userId
      const deleted = await deleteUser({ id: userId });
      if (deleted) {
        refetch();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    setIsEditing(userId);
  };

  const handleSubmitEdit = async () => {
    try {
      if (!isEditing) {
        // if no user is being edited, do nothing
        return;
      }
      // make API call to update user with new values
      const updated = await updateUser({
        id: isEditing,
        ...newUser,
      });
      if (updated) {
        refetch();
        setIsEditing(null);
        setNewUser({});
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '.5em',
        maxHeight: '100%',
        overflowY: 'auto',
        padding: '1em',
      }}
    >
      <h3>Users:</h3>
      {isCreating ? (
        <div>
          {/* form to create a new user */}
          <input
            type="text"
            value={newUser.firstName || ''}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
            placeholder="First Name"
          />
          <input
            type="text"
            value={newUser.lastName || ''}
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
            placeholder="Last Name"
          />
          <input
            type="text"
            value={newUser.username || ''}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            placeholder="Username"
          />
          <button onClick={handleCreateUser}>Create</button>
          <button onClick={() => setIsCreating(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsCreating(true)}>Create New User</button>
      )}
      {loading ? (
        <p>The users are loading please wait...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          {data &&
            data.map((user) => (
              <div
                key={user.id}
                style={{
                  border: '1px solid #ccc',
                  padding: '0.5em',
                  maxWidth: '25%',
                  marginBottom: '0.5em',
                }}
              >
                <p style={{ marginBottom: '0.2em' }}>ID: {user.id}</p>
                <p style={{ marginBottom: '0.2em' }}>
                  Name: {user.firstName} {user.lastName}
                </p>
                <p style={{ marginBottom: '0.2em' }}>
                  Username: {user.username}
                </p>
                <p style={{ marginBottom: '0.2em' }}>
                  Profile Rank: {user.profileRank}
                </p>
                {user.profilePictureUrl && (
                  <img
                    src={user.profilePictureUrl}
                    alt="Profile"
                    style={{
                      maxWidth: '75px',
                      maxHeight: '75px',
                      marginBottom: '0.2em',
                    }}
                  />
                )}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {selectedUserId !== user.id ? (
                    <button onClick={() => setSelectedUserId(user.id)}>
                      {user.firstName} {user.lastName}
                    </button>
                  ) : (
                    <div>
                      <button onClick={() => handleUpdateUser(user.id)}>
                        Update
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
      {/* modal for editing user */}
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '2em',
              borderRadius: '5px',
            }}
          >
            <h2>Edit User</h2>
            <input
              type="text"
              value={newUser.firstName || ''}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
              placeholder="First Name"
            />
            <input
              type="text"
              value={newUser.lastName || ''}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              placeholder="Last Name"
            />
            <input
              type="text"
              value={newUser.username || ''}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              placeholder="Username"
            />
            <button onClick={handleSubmitEdit}>Save</button>
            <button onClick={() => setIsEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// need to update this so you can create new users
interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePictureUrl?: string;
  /** the public level of the user (like stack overflow points/levels) */
  profileRank: number;
}

interface NewUser {
  firstName?: string;
  lastName?: string;
  username?: string;
}
