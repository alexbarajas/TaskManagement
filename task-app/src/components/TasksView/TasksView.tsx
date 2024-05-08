import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '../../support/api/hooks.ts';
import { BackendEndpoint } from '../../support/api/api-schema.ts';
import { TaskPriority, TaskStatus, User } from '../../support/api/models.ts';

export const TasksView: React.FC = () => {
  const { data, loading, error, refetch } = useApiQuery(
    BackendEndpoint.GetTasks,
    { props: { searchText: '' } },
  );

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createTask] = useApiMutation(BackendEndpoint.CreateTask);
  const [updateTask] = useApiMutation(BackendEndpoint.UpdateTask);

  const handleCreateTask = async () => {
    try {
      const newTask = await createTask({
        title: 'New Task Title',
        description: 'New Task Description',
        priority: TaskPriority.Low,
        status: TaskStatus.ToDo,
      });
      if (newTask) {
        refetch();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // function to handle task updates
  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      // call the API to update the task
      const response = await updateTask(updatedTask);
      // if the update is successful, refetch the tasks to get the latest data
      if (response) {
        refetch();
        setSelectedTask(null); // Close the popup after update
      }
    } catch (error) {
      // handle error
      console.error('Error updating task:', error);
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
      <div>
        <h1 style={{ display: 'inline' }}>Tasks:</h1>
        <div>
          <button
            className="common-border-style"
            onClick={handleCreateTask}
            style={{ width: '100vw' }}
          >
            Create New Task
          </button>
        </div>
        <div style={{ display: 'inline-flex', flexDirection: 'row' }}>
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <div key={status} style={{ flex: '0 0 auto', maxWidth: '40%' }}>
              <h3>{formatStatus(status)}</h3>
              {tasks.map((task) => (
                <div className="common-border-style" key={task.id}>
                  <TaskItem
                    task={task}
                    setSelectedTask={setSelectedTask}
                    handleTaskUpdate={handleTaskUpdate}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* popup form for updating task */}
      {loading ? (
        <p>The tasks are loading please wait...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        selectedTask && (
          <div className="update-style">
            <div className="update-box">
              <TaskUpdateForm
                task={selectedTask}
                handleTaskUpdate={handleTaskUpdate}
                onClose={() => setSelectedTask(null)}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

const TaskItem: React.FC<{
  task: Task;
  setSelectedTask: (task: Task | null) => void;
  handleTaskUpdate: (updatedTask: Task) => Promise<void>;
}> = ({ task, setSelectedTask }) => {
  return (
    <div>
      <p>ID: {task.id}</p>
      <p>Title: {task.title}</p>
      <p>Description: {task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>
        Assigned Users:{' '}
        {task.assignedUsers && task.assignedUsers.length > 0
          ? task.assignedUsers.join(', ')
          : 'None'}
      </p>
      {/* button to open update form */}
      <button onClick={() => setSelectedTask(task)}>Update {task.id}</button>
    </div>
  );
};

const TaskUpdateForm: React.FC<{
  task: Task;
  handleTaskUpdate: (task: Task) => void;
  onClose: () => void;
}> = ({ task, handleTaskUpdate, onClose }) => {
  const [updatedTask, setUpdatedTask] = useState<Task>({ ...task });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUpdatedTask({ ...updatedTask, [name]: value });
  };

  return (
    <div>
      <h3>Update Task</h3>
      <p>
        <span style={{ marginRight: '0.5em' }}>Title:</span>
        <input
          type="text"
          name="title"
          value={updatedTask.title}
          onChange={handleChange}
        />
      </p>
      <p>
        <span style={{ marginRight: '0.5em' }}>Status:</span>
        <select
          name="status"
          value={updatedTask.status}
          onChange={handleChange}
        >
          {Object.values(TaskStatus).map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>
      </p>
      <p>
        <span style={{ marginRight: '0.5em' }}>Description:</span>
        <input
          type="text"
          name="description"
          value={updatedTask.description}
          onChange={handleChange}
        />
      </p>
      <p>
        <span style={{ marginRight: '0.5em' }}>Priority:</span>
        <select
          name="priority"
          value={updatedTask.priority}
          onChange={handleChange}
        >
          {Object.values(TaskPriority).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </p>
      <button onClick={() => handleTaskUpdate(updatedTask)}>Update</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

// helper function
const formatStatus = (status: string): string => {
  // ex: Convert "TO_DO" to "To Do"
  const words = status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (firstChar) => firstChar.toUpperCase())
    .split(' ');
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
