import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Settings,
  LogOut,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/Api";

const StatusBadge = ({ status }) => {
  const styles = {
    delivered: "bg-emerald-50 text-emerald-700",
    in_transit: "bg-blue-50 text-blue-700",
    out_for_delivery: "bg-cyan-50 text-cyan-700",
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-purple-50 text-purple-700",
    assigned: "bg-indigo-50 text-indigo-700",
    picked_up: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status?.replace("_", " ")}
    </span>
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/admin/dashboard"),
      api.get("/api/v1/parcels?page_size=5"),
      api.get("/api/v1/users?role=agent&page_size=5"),
    ])
      .then(([statsRes, parcelsRes, agentsRes]) => {
        setStats(statsRes.data);
        setParcels(parcelsRes.data.data || []);
        setAgents(agentsRes.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to load admin dashboard data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: "Total Parcels",
      value: stats ? stats.total_parcels : 0,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      change: "All orders",
    },
    {
      title: "Total Customers",
      value: stats ? stats.total_customers : 0,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      change: "Registered",
    },
    {
      title: "Delivery Agents",
      value: stats ? stats.total_agents : 0,
      icon: Truck,
      color: "bg-emerald-50 text-emerald-600",
      change: "Active fleet",
    },
    {
      title: "Total Revenue",
      value: stats ? `৳${stats.total_revenue.toLocaleString()}` : "৳0",
      icon: Wallet,
      color: "bg-amber-50 text-amber-600",
      change: "Completed payments",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 text-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
            <Truck size={23} className="text-white" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Swift<span className="text-emerald-400">Courier</span>
            </h1>
            <p className="text-[10px] tracking-widest text-slate-400">
              ADMIN CONTROL
            </p>
          </div>
        </div>

        <div className="flex-1 px-4 py-7">
          <p className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-slate-500">
            MAIN MENU
          </p>

          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </Link>

            <Link
              to="/admin/parcels"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Package size={19} />
              Manage Parcels
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Users size={19} />
              Manage Users
            </Link>

            <Link
              to="/admin/agents"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Truck size={19} />
              Delivery Agents
            </Link>
          </nav>

          <p className="mb-4 mt-10 px-3 text-[10px] font-bold tracking-[2px] text-slate-500">
            MANAGEMENT
          </p>

          <nav className="space-y-2">
            <Link
              to="/admin/reports"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <TrendingUp size={19} />
              Reports & Analytics
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={19} />
              Settings
            </Link>
          </nav>
        </div>

        {/* Admin Profile & Logout */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold shrink-0">
                AD
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user?.full_name || 'Admin'}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400" title="Logout">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">

        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Admin Overview
            </h2>
            <p className="text-xs text-slate-500">
              Real-time platform operations and metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold capitalize">
              Role: {user?.role || 'Admin'}
            </span>
            <button
              onClick={logout}
              className="btn btn-sm btn-ghost text-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="space-y-7 p-4 md:p-8">

          {/* Welcome Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white md:p-8">
            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <ShieldCheck size={14} />
                  ADMIN CONTROL CENTER
                </div>

                <h1 className="text-2xl font-extrabold md:text-3xl">
                  Welcome back, {user?.full_name?.split(' ')[0] || 'Administrator'}!
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                  Live metrics from your SwiftCourier database. Monitor parcels, dispatch assignments, and configure delivery charges.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/parcels"
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
                >
                  <Package size={18} />
                  Manage Parcels
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Settings size={17} />
                  Pricing Settings
                </Link>
              </div>
            </div>
          </section>

          {/* Real-time Stats Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${item.color}`}>
                      <Icon size={22} />
                    </div>

                    <span className="text-xs font-bold text-slate-400">
                      {item.change}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                    {loading ? "..." : item.value}
                  </h2>
                </div>
              );
            })}
          </section>

          {/* Operational Breakdown */}
          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="font-bold text-slate-900 mb-2">Live Parcel Status Distribution</h2>
              <p className="text-xs text-slate-500 mb-6">Distribution of currently registered shipments</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-amber-50 rounded-xl text-center">
                  <p className="text-xs text-amber-700 font-semibold">Pending</p>
                  <p className="text-2xl font-extrabold text-amber-900 mt-1">
                    {loading ? "..." : stats?.pending_parcels || 0}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-xs text-blue-700 font-semibold">Active In-Transit</p>
                  <p className="text-2xl font-extrabold text-blue-900 mt-1">
                    {loading ? "..." : stats?.active_deliveries || 0}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                  <p className="text-xs text-emerald-700 font-semibold">Delivered</p>
                  <p className="text-2xl font-extrabold text-emerald-900 mt-1">
                    {loading ? "..." : stats?.delivered_parcels || 0}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-xs text-purple-700 font-semibold">Total Agents</p>
                  <p className="text-2xl font-extrabold text-purple-900 mt-1">
                    {loading ? "..." : stats?.total_agents || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-slate-900 mb-1">Administrative Actions</h2>
                <p className="text-xs text-slate-500 mb-4">Quick shortcuts to platform management</p>
              </div>

              <div className="space-y-2">
                <Link
                  to="/admin/parcels"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-sm font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2"><Package size={17} className="text-emerald-600" /> All Parcels</span>
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-sm font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2"><Users size={17} className="text-blue-600" /> Users & Customers</span>
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/admin/agents"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-sm font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2"><Truck size={17} className="text-purple-600" /> Delivery Agents</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>

          {/* Recent Parcel Bookings */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Parcel Bookings
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Live shipments in system
                </p>
              </div>

              <Link
                to="/admin/parcels"
                className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                View All
                <ArrowRight size={17} />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading live parcels...</div>
            ) : parcels.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4 font-semibold">Tracking ID</th>
                      <th className="px-6 py-4 font-semibold">Sender</th>
                      <th className="px-6 py-4 font-semibold">Receiver</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Charge</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {parcels.map((parcel) => (
                      <tr
                        key={parcel.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600 select-all">
                          {parcel.tracking_number}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                          {parcel.sender_name}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {parcel.receiver_name}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(parcel.created_at).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                          ৳ {parcel.delivery_charge}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={parcel.delivery_status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">No parcels created yet in the database.</div>
            )}
          </section>

          {/* Footer */}
          <div className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 SwiftCourier Platform. Live Admin Panel.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
