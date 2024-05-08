import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '../../support/api/hooks.ts';
import { BackendEndpoint } from '../../support/api/api-schema.ts';
import '../../App.css';

export const UsersView: React.FC = () => {
  const { data, loading, error, refetch } = useApiQuery(
    BackendEndpoint.GetUsers,
    { props: { searchText: '' } },
  );

  const [newUser, setNewUser] = useState<User>({});
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [deleteUser] = useApiMutation(BackendEndpoint.DeleteUser);
  const [updateUser] = useApiMutation(BackendEndpoint.UpdateUser);
  const [createUser] = useApiMutation(BackendEndpoint.CreateUser);

  const handleCreateUser = async () => {
    try {
      const createdUser = await createUser({
        firstName: newUser.firstName || '',
        lastName: newUser.lastName || '',
        username: newUser.username || '',
        profileRank: newUser.profileRank || 0,
      });
      if (createdUser) {
        refetch();
        setNewUser({ firstName: '', lastName: '', username: '' });
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
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
      <h1>Users:</h1>
      {isCreating ? (
        <div>
          {/* form to create a new user */}
          {/* don't need to add an input for ID because the API gets one randomly as seen in mock-backend.ts */}
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
        <button
          className="common-border-style"
          onClick={() => setIsCreating(true)}
        >
          Create New User
        </button>
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
                className="common-border-style"
                style={{ maxWidth: '25%' }}
                key={user.id}
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
        <div className="update-style">
          <div className="update-box">
            <h3>Update User</h3>
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
            <button onClick={handleSubmitEdit}>Update</button>
            <button onClick={() => setIsEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePictureUrl?: string;
  /** the public level of the user (like stack overflow points/levels) */
  profileRank?: number;
}
