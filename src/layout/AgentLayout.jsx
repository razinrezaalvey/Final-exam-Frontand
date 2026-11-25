import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const AgentLayout = () => (
  <div className="min-h-screen">
    <DashboardSidebar />
    <main><Outlet /></main>
  </div>
);

export default AgentLayout;
