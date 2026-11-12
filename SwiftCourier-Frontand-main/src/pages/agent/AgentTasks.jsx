import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Truck,
  Navigation,
  Filter,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";
import AgentSidebar from "../../components/AgentSidebar";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-purple-50 text-purple-700",
  assigned: "bg-indigo-50 text-indigo-700",
  picked_up: "bg-blue-50 text-blue-700",
  in_transit: "bg-blue-50 text-blue-700",
  out_for_delivery: "bg-cyan-50 text-cyan-700",
  delivered: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-slate-50 text-slate-700",
};

const AgentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "assigned", "picked_up", "in_transit", "out_for_delivery", "delivered"];

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/parcels?page_size=100");
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.items || []);
      setTasks(list);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to load assigned tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (task.tracking_number && task.tracking_number.toLowerCase().includes(q)) ||
        (task.receiver_name && task.receiver_name.toLowerCase().includes(q)) ||
        (task.delivery_address && task.delivery_address.toLowerCase().includes(q));

      const matchesStatus =
        activeFilter === "All" || task.delivery_status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, activeFilter]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/api/v1/parcels/${id}/status`, {
        new_status: newStatus,
        note: `Status updated to ${newStatus} by agent`,
      });
      toast.success(`Parcel status updated to ${newStatus.replace("_", " ")}`);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to update parcel status.");
    }
  };

  const counts = {
    total: tasks.length,
    assigned: tasks.filter((t) => t.delivery_status === "assigned").length,
    inTransit: tasks.filter((t) => ["picked_up", "in_transit", "out_for_delivery"].includes(t.delivery_status)).length,
    delivered: tasks.filter((t) => t.delivery_status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AgentSidebar />
      <main className="lg:ml-64 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">AGENT PORTAL</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">My Delivery Tasks</h1>
            <p className="mt-2 text-sm text-slate-500">
              Live assigned deliveries from the SwiftCourier system.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTasks}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm">
              <Navigation size={17} className="text-emerald-600" />
              Delivery Agent
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Assigned</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{counts.total}</h2>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Package size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Pickup</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{counts.assigned}</h2>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">In Transit</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{counts.inTransit}</h2>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Truck size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Delivered</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{counts.delivered}</h2>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 md:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Assigned Parcels</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update parcel status step-by-step as you process the shipment.
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search tracking, receiver, address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Filter size={17} className="mr-1 text-slate-400" />
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${
                    activeFilter === filter
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Tracking ID</th>
                  <th className="px-6 py-4">Receiver</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">COD / Charge</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {task.tracking_number}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">{task.parcel_type} • {task.parcel_weight} kg</p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">{task.receiver_name}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Phone size={13} />
                        {task.receiver_phone}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin size={14} className="text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{task.delivery_address}</span>
                      </p>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-800">
                      {task.cod_amount > 0 ? (
                        <span className="text-emerald-700">৳{task.cod_amount} COD</span>
                      ) : (
                        <span className="text-slate-500">Paid (৳{task.delivery_charge})</span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusStyles[task.delivery_status] || "bg-slate-100 text-slate-700"}`}
                      >
                        {task.delivery_status.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <select
                        value={task.delivery_status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium outline-none focus:border-emerald-500"
                      >
                        <option value="assigned">Assigned</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="in_transit">In Transit</option>
                        <option value="out_for_delivery">Out For Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 p-4 md:hidden">
            {filteredTasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono font-bold text-slate-800">{task.tracking_number}</p>
                    <p className="mt-1 text-xs text-slate-500">{task.parcel_type} • {task.parcel_weight} kg</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusStyles[task.delivery_status] || "bg-slate-100"}`}
                  >
                    {task.delivery_status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">{task.receiver_name}</p>
                  <p className="flex items-center gap-2">
                    <Phone size={15} />
                    {task.receiver_phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={15} className="text-emerald-600 shrink-0" />
                    {task.delivery_address}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    UPDATE DELIVERY STATUS
                  </label>
                  <select
                    value={task.delivery_status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="assigned">Assigned</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out For Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && filteredTasks.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Package size={40} className="mx-auto text-slate-300" />
              <h3 className="mt-4 font-bold text-slate-700">No parcels found</h3>
              <p className="mt-1 text-sm text-slate-500">
                You currently have no tasks matching this filter.
              </p>
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
};

export default AgentTasks;
