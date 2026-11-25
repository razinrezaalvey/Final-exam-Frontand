
import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  Wallet,
  MapPin,
  Phone,
  ArrowRight,
  TrendingUp,
  CalendarDays,
  Navigation,
  ClipboardList,
  UserRound,
  Settings,
  LogOut,
  Bell,
  Star,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthProvider";

const DeliveryDashboard = () => {
  const { user, logout } = useAuthContext();
  const firstName = user?.full_name?.split(' ')[0] || 'Agent';
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AG';
  const stats = [
    {
      title: "Assigned Parcels",
      value: "24",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending Delivery",
      value: "08",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "In Transit",
      value: "06",
      icon: Truck,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Delivered",
      value: "10",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const tasks = [
    {
      id: "SWC-2026-10025",
      receiver: "Karim Hasan",
      phone: "01812345678",
      address: "Agrabad, Chattogram",
      amount: 1500,
      status: "In Transit",
      type: "Electronics",
    },
    {
      id: "SWC-2026-10023",
      receiver: "Sabbir Ahmed",
      phone: "01712345678",
      address: "Uttara, Dhaka",
      amount: 800,
      status: "Pending",
      type: "Documents",
    },
    {
      id: "SWC-2026-10021",
      receiver: "Nusrat Jahan",
      phone: "01912345678",
      address: "Mirpur, Dhaka",
      amount: 1200,
      status: "Picked Up",
      type: "Clothing",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      case "In Transit":
        return "bg-blue-100 text-blue-700";
      case "Picked Up":
        return "bg-purple-100 text-purple-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-slate-950 text-white flex-col z-40">

        <div className="px-6 py-7 border-b border-slate-800">
          <Link to="/" className="text-2xl font-bold">
            Swift<span className="text-emerald-400">Courier</span>
          </Link>
          <p className="text-xs text-slate-400 mt-2">
            Delivery Agent Portal
          </p>
        </div>

        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{user?.full_name || 'Agent'}</h3>
            <p className="text-xs text-slate-400">Delivery Agent</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/agent/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            <ClipboardList size={19} />
            Dashboard
          </Link>

          <Link
            to="/agent/tasks"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <Package size={19} />
            My Deliveries
          </Link>

          <Link
            to="/agent/earnings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <Wallet size={19} />
            Earnings
          </Link>

          <Link
            to="/agent/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <UserRound size={19} />
            My Profile
          </Link>

          <Link
            to="/agent/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <Settings size={19} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-slate-800 transition"
          >
            <LogOut size={19} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-100 px-5 md:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Agent Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage your delivery activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {initials}
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 max-w-7xl mx-auto">

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-slate-950 to-emerald-950 rounded-2xl p-6 md:p-8 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-emerald-400 text-sm font-semibold mb-2">
                  DELIVERY AGENT PORTAL
                </p>

                <h2 className="text-2xl md:text-3xl font-bold">
                   Welcome back, {firstName}! 👋
                </h2>

                <p className="text-slate-300 mt-3 max-w-xl">
                  Stay on top of your deliveries and provide excellent service to every customer.
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-300 mt-5">
                  <MapPin size={16} className="text-emerald-400" />
                  Dhaka, Bangladesh
                </div>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-5 min-w-48">
                <p className="text-slate-300 text-sm">
                  Today's Earnings
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  ৳850
                </h3>

                <div className="flex items-center gap-2 text-emerald-400 text-xs mt-3">
                  <TrendingUp size={15} />
                  Demo earnings
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <Icon size={22} className={stat.color} />
                    </div>
                    <ArrowRight size={17} className="text-slate-300" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/agent/tasks"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-5 flex items-center justify-between transition group"
              >
                <div>
                  <Package size={25} className="mb-3" />
                  <h3 className="font-bold text-lg">
                    View My Deliveries
                  </h3>
                  <p className="text-sm text-emerald-100 mt-1">
                    Check your assigned parcel tasks.
                  </p>
                </div>

                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition"
                />
              </Link>

              <Link
                to="/agent/profile"
                className="bg-white hover:border-emerald-300 border border-slate-100 rounded-2xl p-5 flex items-center justify-between transition group"
              >
                <div>
                  <UserRound size={25} className="text-emerald-600 mb-3" />
                  <h3 className="font-bold text-lg text-slate-900">
                    My Profile
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage your personal information.
                  </p>
                </div>

                <ArrowRight
                  size={22}
                  className="text-slate-400 group-hover:translate-x-1 transition"
                />
              </Link>
            </div>
          </div>

          {/* Recent Delivery Tasks */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">

            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Delivery Tasks
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Your latest assigned shipments.
                </p>
              </div>

              <Link
                to="/agent/tasks"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th>Tracking ID</th>
                    <th>Receiver</th>
                    <th>Destination</th>
                    <th>COD Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50">
                      <td>
                        <span className="font-bold text-emerald-700">
                          {task.id}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          {task.type}
                        </p>
                      </td>

                      <td>
                        <p className="font-semibold text-slate-800">
                          {task.receiver}
                        </p>
                        <p className="text-xs text-slate-400">
                          {task.phone}
                        </p>
                      </td>

                      <td className="text-slate-600">
                        {task.address}
                      </td>

                      <td className="font-semibold text-slate-700">
                        ৳{task.amount}
                      </td>

                      <td>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(task.status)}`}>
                          {task.status}
                        </span>
                      </td>

                      <td>
                        <Link
                          to="/agent/tasks"
                          className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm"
                        >
                          View Task
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Delivery Performance
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Demo monthly performance
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl">
                  <TrendingUp className="text-emerald-600" size={22} />
                </div>
              </div>

              <div className="flex justify-between items-end mb-3">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    92%
                  </h2>
                  <p className="text-sm text-slate-500">
                    Successful deliveries
                  </p>
                </div>

                <span className="text-sm font-semibold text-emerald-600">
                  Excellent
                </span>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Agent Rating
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Customer satisfaction
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl">
                  <Star className="text-amber-500" size={22} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-bold text-slate-900">
                  4.8
                </h2>

                <div>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Based on demo ratings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <p className="text-center text-xs text-slate-400 mt-8">
            SwiftCourier Agent Portal — Sample dashboard data, not connected to backend.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
