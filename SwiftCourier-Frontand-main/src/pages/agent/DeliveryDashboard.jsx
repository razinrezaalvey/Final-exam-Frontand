import React, { useEffect, useState } from "react";
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
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";
import api from "../../services/Api";
import AgentSidebar from "../../components/AgentSidebar";

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [parcelsRes, profileRes] = await Promise.allSettled([
        api.get("/api/v1/parcels?page_size=50"),
        api.get("/api/v1/agents/me/profile"),
      ]);

      if (parcelsRes.status === "fulfilled") {
        const d = parcelsRes.value.data?.data;
        setTasks(Array.isArray(d) ? d : (d?.items || []));
      }
      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value.data);
      }
    } catch {
      toast.error("Failed to load agent dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const counts = {
    assigned: tasks.filter((t) => t.delivery_status === "assigned").length,
    inTransit: tasks.filter((t) =>
      ["picked_up", "in_transit", "out_for_delivery"].includes(t.delivery_status)
    ).length,
    delivered: tasks.filter((t) => t.delivery_status === "delivered").length,
    total: tasks.length,
  };

  const recentTasks = tasks.slice(0, 5);

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700";
      case "in_transit":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-700";
      case "picked_up":
        return "bg-purple-100 text-purple-700";
      case "assigned":
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Complete Agent Sidebar */}
      <AgentSidebar />

      {/* Main Content Area */}
      <main className="min-h-screen lg:ml-64 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-7">
          {/* Welcome Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white md:p-8 shadow-xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  DELIVERY AGENT PORTAL
                </p>
                <h2 className="mt-2 text-2xl font-black md:text-3xl">
                  Welcome back, {user?.full_name || "Agent"}! 👋
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Vehicle: <span className="font-semibold text-white capitalize">{profile?.vehicle_type || "Motorcycle"}</span> ({profile?.vehicle_number || "Unregistered"})
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <MapPin size={15} className="text-emerald-400" />
                  Availability: <span className="text-emerald-400 font-bold capitalize">{profile?.availability_status || "available"}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 min-w-[200px] backdrop-blur-sm">
                <p className="text-xs font-medium text-slate-300">Total Agent Earnings</p>
                <h3 className="mt-1 text-3xl font-black text-emerald-400">
                  ৳{profile?.total_earnings?.toLocaleString() || "0"}
                </h3>
                <p className="mt-2 text-xs text-slate-400">
                  Completed: <span className="font-bold text-white">{profile?.total_deliveries || counts.delivered}</span> deliveries
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">TOTAL TASKS</p>
                  <h3 className="mt-2 text-3xl font-black text-slate-900">{counts.total}</h3>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Package size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">TO PICK UP</p>
                  <h3 className="mt-2 text-3xl font-black text-slate-900">{counts.assigned}</h3>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">IN PROGRESS</p>
                  <h3 className="mt-2 text-3xl font-black text-slate-900">{counts.inTransit}</h3>
                </div>
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Truck size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">DELIVERED</p>
                  <h3 className="mt-2 text-3xl font-black text-slate-900">{counts.delivered}</h3>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Assigned Shipments</h3>
                <p className="text-xs text-slate-500">Parcels assigned to you by admin</p>
              </div>
              <Link
                to="/agent/tasks"
                className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View All Tasks <ArrowRight size={16} />
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Package size={40} className="mx-auto mb-2 opacity-30" />
                <p className="font-medium">No assigned deliveries yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTasks.map((task) => (
                  <div key={task.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {task.tracking_number}
                      </span>
                      <p className="text-sm font-semibold text-slate-800">{task.receiver_name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-emerald-600 shrink-0" />
                        {task.delivery_address}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(task.delivery_status)}`}>
                        {task.delivery_status.replace(/_/g, " ")}
                      </span>
                      <Link
                        to="/agent/tasks"
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
