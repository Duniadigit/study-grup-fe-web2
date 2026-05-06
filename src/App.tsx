import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import GroupsPage from './pages/groups/GroupsPage';
import CreateGroupPage from './pages/groups/CreateGroupPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';
import OverviewPage from './pages/groups/OverviewPage';
import TaskListPage from './pages/groups/TaskListPage';
import TaskDetailPage from './pages/groups/TaskDetailPage';
import CreateTaskPage from './pages/groups/CreateTaskPage';
import DashboardPage from './pages/DashboardPage';

function RouteGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="loading-center" style={{ minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );

  const isAuth = location.pathname.startsWith('/auth');
  if (!user && !isAuth) return <Navigate to="/auth/login" replace />;
  if (user && isAuth) return <Navigate to="/groups" replace />;

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route element={<AppLayout />}>
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/create" element={<CreateGroupPage />} />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
        <Route path="/groups/:id/overview" element={<OverviewPage />} />
        <Route path="/groups/:id/tasks" element={<TaskListPage />} />
        <Route path="/groups/:id/tasks/create" element={<CreateTaskPage />} />
        <Route path="/groups/:id/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/groups" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouteGuard />
      </AuthProvider>
    </ThemeProvider>
  );
}
