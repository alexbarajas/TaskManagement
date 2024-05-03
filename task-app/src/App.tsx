import './App.css';
import './support/assets/fa.all.min.css';
import { Sidebar } from './support/sidebar/Sidebar.tsx';
import { TasksView } from './components/TasksView/TasksView.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UsersView } from './components/UsersView/UsersView.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import { NotFound } from './components/NotFound/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TasksView />,
  },
  {
    path: '/users',
    element: <UsersView />,
  },
  {
    path: '*', // for every other link not mentioned above
    element: <NotFound />,
  },
]);

function App() {
  return (
    <ErrorBoundary> {/* Wrap the entire application with ErrorBoundary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 4fr',
          gap: '.5em',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,.1)',
        }}
      >
      <Sidebar />
        <RouterProvider router={router} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
