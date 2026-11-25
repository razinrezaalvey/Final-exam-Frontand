
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Bell,
  Menu,
  X,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  UserRound,
  Settings,
  LogOut,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthProvider';
import api from '../../services/Api';

const formatStatus = (status) =>
  (status || 'pending')
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const CustomerDashboard = () => {
  const { user, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/v1/parcels?page_size=100')
      .then((res) => {
        setParcels(res.data?.data || []);
      })
      .catch(() => {
        setParcels([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const totalCount = parcels.length;
  const inTransitCount = parcels.filter((p) =>
    ['picked_up', 'in_transit', 'out_for_delivery'].includes(p.delivery_status)
  ).length;
  const deliveredCount = parcels.filter((p) => p.delivery_status === 'delivered').length;
  const pendingCount = parcels.filter((p) =>
    ['pending', 'confirmed', 'assigned'].includes(p.delivery_status)
  ).length;

  const stats = [
    {
      title: 'Total Parcels',
      value: String(totalCount).padStart(2, '0'),
      change: totalCount === 0 ? 'No parcels yet' : 'Your shipments',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'In Transit',
      value: String(inTransitCount).padStart(2, '0'),
      change: 'Currently moving',
      icon: Truck,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'Delivered',
      value: String(deliveredCount).padStart(2, '0'),
      change: 'Completed',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Pending',
      value: String(pendingCount).padStart(2, '0'),
      change: 'Awaiting pickup',
      icon: Clock,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const shipments = parcels.slice(0, 5).map((p) => ({
    id: p.tracking_number,
    receiver: p.receiver_name,
    destination: p.delivery_address,
    date: p.created_at ? new Date(p.created_at).toLocaleDateString() : '',
    amount: `৳ ${p.delivery_charge}`,
    status: formatStatus(p.delivery_status),
  }));

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/customer/dashboard' },
    { label: 'My Parcels', icon: Package, path: '/customer/parcels' },
    { label: 'Track Parcel', icon: Truck, path: '/track' },
    { label: 'My Profile', icon: UserRound, path: '/customer/profile' },
    { label: 'Settings', icon: Settings, path: '/customer/settings' },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const statusStyle = (status) => {
    if (status === 'Delivered') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (status === 'In Transit') {
      return 'bg-blue-50 text-blue-700';
    }
    return 'bg-orange-50 text-orange-700';
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            Swift<span className="text-emerald-400">Courier</span>
          </Link>

          <button
            onClick={closeSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 py-8">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    index === 0
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Truck size={21} />
            </div>

            <h3 className="font-bold">Need Help?</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Our support team is available to help with your shipments.
            </p>

            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
            >
              Contact Support <ArrowRight size={15} />
            </Link>
          </div>

          <button
            onClick={() => { logout(); window.location.href = '/login'; }}
            className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-900 md:text-xl">
                Dashboard Overview
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Welcome back! Manage your parcels here.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 md:pl-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-slate-500">Customer</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">

          {/* Welcome Section */}
          <section className="mb-8 flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-500 p-6 text-white shadow-lg shadow-emerald-900/10 md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-sm font-medium text-emerald-100">
                Tuesday, November 03, 2026
              </p>

              <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
                Hello, {user?.full_name?.split(' ')[0] || 'User'}! 👋
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-emerald-50">
                Welcome to your SwiftCourier dashboard. Track your parcels
                and manage all your deliveries from one place.
              </p>
            </div>

            <Link
              to="/customer/book-parcel"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-700 shadow-md transition hover:bg-emerald-50"
            >
              <Plus size={20} />
              Book New Parcel
            </Link>
          </section>

          {/* Statistics */}
          <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                      <Icon size={23} />
                    </div>

                    <MoreHorizontal className="text-slate-400" size={22} />
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-2">
                    <h3 className="text-3xl font-extrabold text-slate-900">
                      {stat.value}
                    </h3>

                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your shipments quickly.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/customer/book-parcel"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Book a Parcel
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Create a new shipment
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="text-slate-400 transition group-hover:text-emerald-600" />
              </Link>

              <Link
                to="/track"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Search size={23} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Track Shipment
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Check your parcel location
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="text-slate-400 transition group-hover:text-blue-600" />
              </Link>
            </div>
          </section>

          {/* Recent Shipments */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Shipments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest parcel activities.
                </p>
              </div>

              <Link
                to="/customer/parcels"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                View All <ArrowRight size={17} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tracking ID</th>
                    <th className="px-6 py-4 font-semibold">Receiver</th>
                    <th className="px-6 py-4 font-semibold">Destination</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                        Loading your shipments...
                      </td>
                    </tr>
                  ) : shipments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                        No shipments found yet. Book your first parcel!
                      </td>
                    </tr>
                  ) : (
                    shipments.map((shipment) => (
                      <tr
                        key={shipment.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5 text-sm font-bold text-emerald-700">
                          {shipment.id}
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-slate-800">
                          {shipment.receiver}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          <span className="flex items-center gap-2">
                            <MapPin size={15} className="text-slate-400" />
                            {shipment.destination}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {shipment.date}
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                          {shipment.amount}
                        </td>

                        <td className="px-6 py-5">
                          <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 p-4 text-center text-xs text-slate-400">
              Showing demo shipment records
            </div>
          </section>

          {/* Bottom Information */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Delivery Performance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your demo shipment overview
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Delivered parcels
                </span>
                <span className="font-bold text-slate-900">14 / 24</span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[58%] rounded-full bg-emerald-500" />
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Sample progress based on demo shipment data.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Need a Delivery?</h3>
                  <p className="text-xs text-slate-400">
                    Book your next shipment today.
                  </p>
                </div>
              </div>

              <Link
                to="/customer/book-parcel"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Start Booking <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
            © 2026 SwiftCourier. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
