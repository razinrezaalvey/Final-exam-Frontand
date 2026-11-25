
import React, { useMemo, useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Truck,
  Navigation,
  Eye,
  Filter,
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    trackingId: "SWC-2026-10025",
    receiver: "Karim Hasan",
    phone: "01812345678",
    address: "Agrabad, Chattogram",
    parcelType: "Electronics",
    deliveryDate: "Nov 04, 2026",
    amount: 1500,
    status: "Pending",
  },
  {
    id: 2,
    trackingId: "SWC-2026-10026",
    receiver: "Nusrat Jahan",
    phone: "01712345678",
    address: "Dhanmondi, Dhaka",
    parcelType: "Clothing",
    deliveryDate: "Nov 04, 2026",
    amount: 0,
    status: "In Transit",
  },
  {
    id: 3,
    trackingId: "SWC-2026-10027",
    receiver: "Sakib Ahmed",
    phone: "01912345678",
    address: "Uttara, Dhaka",
    parcelType: "Document",
    deliveryDate: "Nov 05, 2026",
    amount: 800,
    status: "Delivered",
  },
  {
    id: 4,
    trackingId: "SWC-2026-10028",
    receiver: "Mim Akter",
    phone: "01612345678",
    address: "Mirpur, Dhaka",
    parcelType: "Fragile Item",
    deliveryDate: "Nov 05, 2026",
    amount: 500,
    status: "Pending",
  },
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  "In Transit": "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
};

const AgentTasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Pending", "In Transit", "Delivered"];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.trackingId.toLowerCase().includes(search.toLowerCase()) ||
        task.receiver.toLowerCase().includes(search.toLowerCase()) ||
        task.address.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        activeFilter === "All" || task.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, activeFilter]);

  const updateStatus = (id, newStatus) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const stats = [
    {
      label: "Total Assigned",
      value: tasks.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending",
      value: tasks.filter((task) => task.status === "Pending").length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "In Transit",
      value: tasks.filter((task) => task.status === "In Transit").length,
      icon: Truck,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Delivered",
      value: tasks.filter((task) => task.status === "Delivered").length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              AGENT PORTAL
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              My Delivery Tasks
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your assigned parcels and update delivery progress.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
            <Navigation size={17} className="text-emerald-600" />
            Delivery Agent
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value.toString().padStart(2, "0")}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Task List */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5 md:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Assigned Parcels
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Find and manage your delivery assignments.
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search parcel or receiver..."
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
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Parcel Information</th>
                  <th className="px-6 py-4">Receiver</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">COD Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Update Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-800">
                        {task.trackingId}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {task.parcelType}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">
                        {task.receiver}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Phone size={12} />
                        {task.phone}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin size={14} className="text-emerald-600" />
                        {task.address}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {task.deliveryDate}
                      </p>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-800">
                      ৳{task.amount}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className="w-36 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium outline-none focus:border-emerald-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
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
              <div
                key={task.id}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-800">
                      {task.trackingId}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {task.parcelType}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">
                    {task.receiver}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={15} />
                    {task.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={15} className="text-emerald-600" />
                    {task.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={15} />
                    {task.deliveryDate}
                  </p>
                  <p className="font-semibold text-slate-800">
                    COD: ৳{task.amount}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    UPDATE DELIVERY STATUS
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Package size={40} className="mx-auto text-slate-300" />
              <h3 className="mt-4 font-bold text-slate-700">
                No parcels found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or status filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All");
                }}
                className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400">
          Demo data only — status changes are temporary and reset after refresh.
        </p>
      </div>
    </div>
  );
};

export default AgentTasks;
