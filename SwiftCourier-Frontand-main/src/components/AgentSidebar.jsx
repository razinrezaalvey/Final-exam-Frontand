import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Package,
  Wallet,
  UserRound,
  Settings,
  LogOut,
  Menu,
  X,
  Truck,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AgentSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/agent/dashboard', icon: ClipboardList },
    { name: 'My Deliveries', path: '/agent/tasks', icon: Package },
    { name: 'Earnings', path: '/agent/earnings', icon: Wallet },
    { name: 'My Profile', path: '/agent/profile', icon: UserRound },
    { name: 'Settings', path: '/agent/settings', icon: Settings },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
      isActive
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      {/* Mobile Hamburger Header */}
      <div className="lg:hidden bg-slate-900 text-white p-3 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm font-bold bg-slate-800 px-3 py-2 rounded-xl"
        >
          <Menu size={18} /> Agent Menu
        </button>
        <span className="text-xs text-slate-400">Delivery Agent Portal</span>
      </div>

      {/* Sidebar (Fixed on Desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            Swift<span className="text-emerald-400">Courier</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Badge */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white shrink-0">
            {user?.full_name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate text-white">
              {user?.full_name || 'Delivery Agent'}
            </h3>
            <p className="text-xs text-emerald-400 font-medium">Delivery Agent</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Agent Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-slate-900 transition font-medium text-sm cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AgentSidebar;

