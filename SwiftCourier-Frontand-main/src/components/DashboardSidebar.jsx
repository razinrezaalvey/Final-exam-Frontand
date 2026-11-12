import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Plus,
  Users,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  UserRound,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const role = user?.role || 'customer';

  const customerLinks = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'Book Parcel', path: '/customer/book-parcel', icon: Plus },
    { name: 'My Parcels', path: '/customer/parcels', icon: Package },
    { name: 'My Profile', path: '/customer/profile', icon: UserRound },
    { name: 'Settings', path: '/customer/settings', icon: Settings },
  ];

  const agentLinks = [
    { name: 'Delivery Dashboard', path: '/agent/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/agent/tasks', icon: Package },
    { name: 'My Earnings', path: '/agent/earnings', icon: Wallet },
    { name: 'Agent Profile', path: '/agent/profile', icon: UserRound },
    { name: 'Settings', path: '/agent/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All Parcels', path: '/admin/parcels', icon: Package },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Agent Management', path: '/admin/agents', icon: Truck },
    { name: 'Analytics & Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  let links = customerLinks;
  if (role === 'admin') links = adminLinks;
  else if (role === 'agent') links = agentLinks;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="mb-6 px-3 py-2 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {role.toUpperCase()} PANEL
          </p>
          <p className="text-sm font-bold text-slate-800 truncate">
            {user?.full_name || user?.email || 'User'}
          </p>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.path} to={link.path} className={linkClass}>
                <Icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
