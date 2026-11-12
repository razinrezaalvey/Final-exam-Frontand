import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const AdminLayout = () => (
  <div className="min-h-screen">
    <DashboardSidebar />
    <main><Outlet /></main>
  </div>
);

export default AdminLayout;
