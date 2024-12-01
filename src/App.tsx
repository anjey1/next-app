import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskList } from './pages/TaskList';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GroupDiscovery } from './pages/GroupDiscovery';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navigation } from './components/Navigation';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuthStore } from './store/authStore';
import { TaskForm } from './components/TaskForm';

const queryClient = new QueryClient();

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {user && <Navigation />}
        <div className={user ? 'min-h-screen bg-gray-100 pt-4' : 'min-h-screen bg-gray-50'}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TaskList />
                </PrivateRoute>
              }
            />
            <Route
              path="/add"
              element={
                <PrivateRoute>
                  <TaskForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <PrivateRoute>
                  <GroupDiscovery />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;