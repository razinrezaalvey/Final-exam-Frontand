import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout/Root';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import TrackParcel from '../pages/public/TrackParcel';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Services from '../pages/public/Services';

import CustomerDashboard from '../pages/customer/CustomerDashboard';
import BookParcel from '../pages/customer/BookParcel';
import MyParcels from '../pages/customer/MyParcels';
import ParcelDetails from '../pages/customer/ParcelDetails';
import CustomerProfile from '../pages/customer/CustomerProfile';
import CustomerSettings from '../pages/customer/CustomerSettings';

import DeliveryDashboard from '../pages/agent/DeliveryDashboard';
import AgentTasks from '../pages/agent/AgentTasks';
import AgentEarnings from '../pages/agent/AgentEarnings';
import AgentProfile from '../pages/agent/AgentProfile';
import AgentSettings from '../pages/agent/AgentSettings';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminParcels from '../pages/admin/AdminParcels';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminAgents from '../pages/admin/AdminAgents';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Public Routes
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'contact', element: <Contact /> },
      { path: 'track', element: <TrackParcel /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },

      // Customer Protected Routes
      {
        element: <ProtectedRoute allowedRoles={['customer', 'admin']} />,
        children: [
          { path: 'customer/dashboard', element: <CustomerDashboard /> },
          { path: 'customer/book-parcel', element: <BookParcel /> },
          { path: 'customer/parcels', element: <MyParcels /> },
          { path: 'customer/parcels/:trackingId', element: <ParcelDetails /> },
          { path: 'customer/profile', element: <CustomerProfile /> },
          { path: 'customer/settings', element: <CustomerSettings /> },
        ],
      },

      // Agent Protected Routes
      {
        element: <ProtectedRoute allowedRoles={['agent', 'admin']} />,
        children: [
          { path: 'agent/dashboard', element: <DeliveryDashboard /> },
          { path: 'agent/tasks', element: <AgentTasks /> },
          { path: 'agent/earnings', element: <AgentEarnings /> },
          { path: 'agent/profile', element: <AgentProfile /> },
          { path: 'agent/settings', element: <AgentSettings /> },
        ],
      },

      // Admin Protected Routes
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: 'admin/dashboard', element: <AdminDashboard /> },
          { path: 'admin/parcels', element: <AdminParcels /> },
          { path: 'admin/users', element: <AdminUsers /> },
          { path: 'admin/agents', element: <AdminAgents /> },
          { path: 'admin/reports', element: <AdminReports /> },
          { path: 'admin/settings', element: <AdminSettings /> },
        ],
      },
    ],
  },
]);

export default router;
