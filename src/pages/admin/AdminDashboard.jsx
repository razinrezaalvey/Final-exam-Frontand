
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Search,
  Bell,
  Settings,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  CircleAlert,
  Menu,
  CalendarDays,
  MoreHorizontal,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthProvider";
import api from "../../services/Api";

const weeklyData = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 0 },
  { day: "Sat", value: 0 },
  { day: "Sun", value: 0 },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-emerald-50 text-emerald-700",
    "In Transit": "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
    "Picked Up": "bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [liveParcels, setLiveParcels] = useState([]);
  const [liveUsers, setLiveUsers] = useState([]);

  useEffect(() => {
    api.get("/api/v1/parcels?page_size=100")
      .then((res) => setLiveParcels(res.data?.data || []))
      .catch(() => setLiveParcels([]));
    api.get("/api/v1/users?page_size=100")
      .then((res) => setLiveUsers(res.data?.data || []))
      .catch(() => setLiveUsers([]));
  }, []);

  const adminName = user?.full_name || "Admin";
  const adminInitials = adminName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const totalCustomers = liveUsers.filter((u) => u.role === "customer").length;
  const totalAgentsCount = liveUsers.filter((u) => u.role === "agent").length;
  const totalRevenue = liveParcels.reduce((sum, p) => sum + Number(p.delivery_charge || 0), 0);

  const stats = [
    {
      title: "Total Parcels",
      value: String(liveParcels.length),
      change: "Live DB",
      positive: true,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Customers",
      value: String(totalCustomers),
      change: "Live DB",
      positive: true,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Delivery Agents",
      value: String(totalAgentsCount),
      change: "Live DB",
      positive: true,
      icon: Truck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString("en-IN")}`,
      change: "Live DB",
      positive: true,
      icon: Wallet,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const formatStatus = (s) =>
    (s || "pending").split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const recentParcels = liveParcels.slice(0, 5).map((p) => ({
    id: p.tracking_number,
    customer: p.sender_name,
    destination: `${p.pickup_address} → ${p.delivery_address}`,
    date: p.created_at ? new Date(p.created_at).toLocaleDateString() : "",
    amount: `৳${p.delivery_charge}`,
    status: formatStatus(p.delivery_status),
  }));

  const agents = liveUsers
    .filter((u) => u.role === "agent")
    .slice(0, 5)
    .map((a) => ({
      name: a.full_name,
      id: `AGT-${a.id}`,
      deliveries: liveParcels.filter((p) => p.agent_id === a.id && p.delivery_status === "delivered").length,
      rating: "5.0",
      initials: a.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      color: "bg-emerald-100 text-emerald-700",
    }));

  const totalP = liveParcels.length || 1;
  const deliveredP = liveParcels.filter((p) => p.delivery_status === "delivered").length;
  const transitP = liveParcels.filter((p) => ["picked_up", "in_transit", "out_for_delivery"].includes(p.delivery_status)).length;
  const pendingP = liveParcels.filter((p) => ["pending", "confirmed", "assigned"].includes(p.delivery_status)).length;
  const cancelledP = liveParcels.filter((p) => p.delivery_status === "cancelled").length;

  const statusData = [
    { label: "Delivered", value: Math.round((deliveredP / totalP) * 100), count: String(deliveredP), color: "bg-emerald-500" },
    { label: "In Transit", value: Math.round((transitP / totalP) * 100), count: String(transitP), color: "bg-blue-500" },
    { label: "Pending", value: Math.round((pendingP / totalP) * 100), count: String(pendingP), color: "bg-amber-500" },
    { label: "Cancelled", value: Math.round((cancelledP / totalP) * 100), count: String(cancelledP), color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">


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
              ADMIN PANEL
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


        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold">
              {adminInitials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{adminName}</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>

            <button
              onClick={() => { logout(); navigate("/login"); }}
              title="Logout"
              className="text-slate-400 hover:text-red-400 transition"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>


      <main className="min-w-0 flex-1">


        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dashboard Overview
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Welcome back, Admin!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50">
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-800">{adminName}</p>
                <p className="text-xs text-slate-400">Admin</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-7 p-4 md:p-8">


          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white md:p-8">
            <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <ShieldCheck size={14} />
                  ADMIN CONTROL CENTER
                </div>

                <h1 className="text-2xl font-extrabold md:text-3xl">
                  Welcome back, Admin!
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                  Monitor your courier operations, manage deliveries and
                  track your business performance from one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/parcels"
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
                >
                  <Plus size={18} />
                  Manage Parcels
                </Link>

                <Link
                  to="/admin/reports"
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Reports
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </section>


          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
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

                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                      <TrendingUp size={13} />
                      {item.change}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                    {item.value}
                  </h2>

                  <p className="mt-2 text-xs text-slate-400">
                    Compared to last month
                  </p>
                </div>
              );
            })}
          </section>


          <section className="grid gap-6 xl:grid-cols-3">


            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Delivery Performance
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Weekly parcel delivery overview
                  </p>
                </div>

                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                  <CalendarDays size={15} />
                  This Week
                </button>
              </div>

              <div className="flex h-56 items-end justify-between gap-3 border-b border-slate-100 pb-2">
                {weeklyData.map((item) => (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        title={`${item.value}%`}
                        className="w-full max-w-12 rounded-t-lg bg-emerald-500 transition-all duration-300 hover:bg-emerald-700"
                        style={{ height: `${item.value}%` }}
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">
                    Average performance
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    68.4%
                  </p>
                </div>

                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendingUp size={15} />
                  12.5% increase
                </span>
              </div>
            </div>


            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div>
                <h2 className="font-bold text-slate-900">
                  Parcel Overview
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Current shipment status
                </p>
              </div>

              <div className="my-7 flex items-center justify-center">
                <div
                  className="flex h-40 w-40 items-center justify-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#10b981 0% 68%, #3b82f6 68% 88%, #f59e0b 88% 96%, #ef4444 96% 100%)",
                  }}
                >
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-2xl font-extrabold text-slate-900">
                      12.8k
                    </span>
                    <span className="text-xs text-slate-400">Total Parcels</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {statusData.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-xs font-medium text-slate-600">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-800">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>


          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Parcel Bookings
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Latest parcel activities
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

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Tracking ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Destination</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        {parcel.id}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {parcel.customer}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {parcel.destination}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {parcel.date}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {parcel.amount}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={parcel.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>


          <section className="grid gap-6 xl:grid-cols-2">


            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Top Delivery Agents
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Best performing agents
                  </p>
                </div>

                <Link
                  to="/admin/agents"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-5">
                {agents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-3"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${agent.color}`}>
                      {agent.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-800">
                        {agent.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {agent.id} · {agent.deliveries} deliveries
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">
                        ★ {agent.rating}
                      </p>
                      <p className="text-xs text-slate-400">
                        Rating
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="font-bold text-slate-900">
                  Quick Actions
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Manage your courier operations
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/admin/parcels"
                  className="group rounded-2xl border border-slate-100 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600 transition group-hover:bg-emerald-100">
                    <Package size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Manage Parcels
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    View and update parcels
                  </p>
                </Link>

                <Link
                  to="/admin/users"
                  className="group rounded-2xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-100">
                    <Users size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Manage Users
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    View customer accounts
                  </p>
                </Link>

                <Link
                  to="/admin/agents"
                  className="group rounded-2xl border border-slate-100 p-4 transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-purple-50 p-3 text-purple-600 transition group-hover:bg-purple-100">
                    <Truck size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Manage Agents
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Manage delivery agents
                  </p>
                </Link>

                <Link
                  to="/admin/reports"
                  className="group rounded-2xl border border-slate-100 p-4 transition hover:border-amber-200 hover:bg-amber-50"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-600 transition group-hover:bg-amber-100">
                    <TrendingUp size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    View Reports
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Check business analytics
                  </p>
                </Link>
              </div>
            </div>
          </section>


          <div className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 SwiftCourier. All rights reserved.</p>
            <p>Admin Dashboard · Demo Version</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
