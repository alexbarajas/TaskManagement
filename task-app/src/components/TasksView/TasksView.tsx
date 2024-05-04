import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '../../support/api/hooks.ts';
import { BackendEndpoint } from '../../support/api/api-schema.ts';
import { TaskPriority, TaskStatus, User } from '../../support/api/models.ts';

export const TasksView: React.FC = () => {
  const { data, loading, error, refetch } = useApiQuery(
    BackendEndpoint.GetTasks,
    { props: { searchText: '' } },
  );

  // mutation hook for updating tasks
  const [updateTask] = useApiMutation(BackendEndpoint.UpdateTask);

  // state to store selected status for each task, whenever a state changes the component re-renders
  const [selectedStatus, setSelectedStatus] = useState<{
    [taskId: string]: TaskStatus;
  }>({});
  const [selectedTitle, setSelectedTitle] = useState<{
    [taskId: string]: string;
  }>({});
  const [selectedPriority, setSelectedPriority] = useState<{
    [taskId: string]: TaskPriority;
  }>({});

  // function to handle task updates
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      // call the API to update the task
      const updatedTask = await updateTask({ id: taskId, ...updates });
      // if the update is successful, refetch the tasks to get the latest data
      if (updatedTask) {
        refetch();
      }
    } catch (error) {
      // handle error
      console.error('Error updating task:', error);
    }
  };

  const updateTaskStatus = (taskId: string) => {
    // if you click on 'Update Status' without selecting anything, it'll be undefined, so instead of setting the status to 'undefined' it just stays the same
    if (selectedStatus[taskId]) {
      const newStatus = selectedStatus[taskId];
      handleTaskUpdate(taskId, { status: newStatus });
    }
  };

  const updateTaskTitle = (taskId: string) => {
    if (selectedTitle[taskId]) {
      const newTitle = selectedTitle[taskId];
      handleTaskUpdate(taskId, { title: newTitle });
    }
  };

  const updateTaskPriority = (taskId: string) => {
    if (selectedPriority[taskId]) {
      const newPriority = selectedPriority[taskId];
      handleTaskUpdate(taskId, { priority: newPriority });
    }
  };

  const tasksByStatus: { [status: string]: Task[] } = {};
  if (data) {
    data.forEach((task) => {
      if (!tasksByStatus[task.status]) {
        tasksByStatus[task.status] = [];
      }
      tasksByStatus[task.status].push(task);
    });
  }

  console.log('Data:', data);
  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Refetch:', refetch);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '.5em',
        maxHeight: '100%',
        overflowX: 'auto',
        padding: '1em',
      }}
    >
      {Object.entries(tasksByStatus).map(([status, tasks]) => (
        <div key={status} style={{ flex: '0 0 auto', maxWidth: '40%' }}>
          <h3>{formatStatus(status)}</h3> {/* Updated status label */}
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: '1px solid #ccc',
                padding: '0.5em',
                marginBottom: '0.5em',
              }}
            >
              <p style={{ marginBottom: '0.2em' }}>ID: {task.id}</p>
              <p style={{ marginBottom: '0.2em' }}>Title: {task.title}</p>
              <p style={{ marginBottom: '0.2em' }}>
                Description: {task.description}
              </p>
              <p style={{ marginBottom: '0.2em' }}>Priority: {task.priority}</p>
              <p style={{ marginBottom: '0.2em' }}>
                Assigned Users:{' '}
                {task.assignedUsers && task.assignedUsers.length > 0
                  ? task.assignedUsers.join(', ')
                  : 'None'}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5em',
                  justifyContent: 'space-between',
                }}
              >
                <input
                  type="text"
                  value={selectedTitle[task.id] || task.title}
                  onChange={(e) =>
                    setSelectedTitle({
                      ...selectedTitle,
                      [task.id]: e.target.value,
                    })
                  }
                />
                <button onClick={() => updateTaskTitle(task.id)}>
                  Update Title
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5em',
                  justifyContent: 'space-between',
                }}
              >
                <select
                  value={selectedStatus[task.id] || task.status}
                  onChange={(e) =>
                    setSelectedStatus({
                      ...selectedStatus,
                      [task.id]: e.target.value as TaskStatus,
                    })
                  }
                >
                  {Object.values(TaskStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <button onClick={() => updateTaskStatus(task.id)}>
                  Update Status
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5em',
                  justifyContent: 'space-between',
                }}
              >
                <select
                  value={selectedPriority[task.id] || task.priority}
                  onChange={(e) =>
                    setSelectedPriority({
                      ...selectedPriority,
                      [task.id]: e.target.value as TaskPriority,
                    })
                  }
                >
                  {Object.values(TaskPriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <button onClick={() => updateTaskPriority(task.id)}>
                  Update Priority
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// helper functions go outside
const formatStatus = (status: string): string => {
  // Example: Convert "TO_DO" to "To Do"
  const words = status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (firstChar) => firstChar.toUpperCase())
    .split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// copied from models.ts
interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assignedUsers?: User[];
  status: TaskStatus;
}
