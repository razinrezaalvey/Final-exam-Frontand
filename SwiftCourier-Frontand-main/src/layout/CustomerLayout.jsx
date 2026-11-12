import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const CustomerLayout = () => (
  <div className="min-h-screen">
    <DashboardSidebar />
    <main><Outlet /></main>
  </div>
);

export default CustomerLayout;
