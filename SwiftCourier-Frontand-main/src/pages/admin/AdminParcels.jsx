import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  Search,
  Filter,
  Eye,
  Trash2,
  Truck,
  MapPin,
  Phone,
  UserRound,
  X,
  CalendarDays,
  Wallet,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpDown,
  MoreVertical,
  ClipboardList,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../services/Api";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Assigned", value: "assigned" },
  { label: "Picked Up", value: "picked_up" },
  { label: "In Transit", value: "in_transit" },
  { label: "Out for Delivery", value: "out_for_delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-purple-50 text-purple-700",
    assigned: "bg-indigo-50 text-indigo-700",
    picked_up: "bg-blue-50 text-blue-700",
    in_transit: "bg-blue-50 text-blue-700",
    out_for_delivery: "bg-cyan-50 text-cyan-700",
    delivered: "bg-emerald-50 text-emerald-700",
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

const StatCard = ({ title, value, icon: Icon, color, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
      active ? "border-emerald-400 ring-2 ring-emerald-100" : "border-slate-100"
    }`}
  >
    <div className="flex items-center justify-between">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={22} />
      </div>
      <ArrowUpDown size={16} className="text-slate-300" />
    </div>
    <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
    <h3 className="mt-1 text-2xl font-extrabold text-slate-900">{value}</h3>
  </button>
);

const AdminParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [deleteParcelId, setDeleteParcelId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [parcelsRes, agentsRes] = await Promise.all([
        api.get("/api/v1/parcels?page_size=100"),
        api.get("/api/v1/users?role=agent&page_size=100"),
      ]);
      setParcels(parcelsRes.data.data || []);
      setAgents(agentsRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load parcels or agents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredParcels = useMemo(() => {
    return parcels.filter((parcel) => {
      const searchValue = search.toLowerCase();
      const matchesSearch = [
        parcel.tracking_number,
        parcel.sender_name,
        parcel.receiver_name,
        parcel.sender_phone,
        parcel.receiver_phone,
        parcel.pickup_address,
        parcel.delivery_address,
      ].some((value) => (value || "").toLowerCase().includes(searchValue));

      const matchesStatus =
        statusFilter === "All" || parcel.delivery_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [parcels, search, statusFilter]);

  const counts = {
    total: parcels.length,
    pending: parcels.filter((p) => p.delivery_status === "pending").length,
    transit: parcels.filter((p) => ["in_transit", "picked_up", "out_for_delivery"].includes(p.delivery_status)).length,
    delivered: parcels.filter((p) => p.delivery_status === "delivered").length,
    cancelled: parcels.filter((p) => p.delivery_status === "cancelled").length,
  };

  const handleStatusChange = async (parcel, newStatus) => {
    try {
      await api.patch(`/api/v1/parcels/${parcel.id}/status`, {
        new_status: newStatus,
        note: `Status updated to ${newStatus} by admin`,
      });
      toast.success("Parcel status updated!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Invalid status transition.");
    }
  };

  const handleAgentChange = async (parcel, agentId) => {
    if (!agentId || agentId === "none") return;
    try {
      // If status is pending, confirm it first so assignment is valid
      if (parcel.delivery_status === "pending") {
        await api.patch(`/api/v1/parcels/${parcel.id}/status`, {
          new_status: "confirmed",
        });
      }

      await api.post("/api/v1/agents/assignments", {
        parcel_id: parcel.id,
        agent_id: parseInt(agentId, 10),
        note: "Assigned by admin",
      });
      toast.success("Delivery agent assigned successfully!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to assign agent.");
    }
  };

  const handleCancelParcel = async () => {
    if (!deleteParcelId) return;
    try {
      await api.patch(`/api/v1/parcels/${deleteParcelId}/status`, {
        new_status: "cancelled",
        note: "Cancelled by administrator",
      });
      toast.success("Parcel cancelled.");
      setDeleteParcelId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to cancel parcel.");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const selectedDeleteParcel = parcels.find(
    (parcel) => parcel.id === deleteParcelId
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              ADMIN CONTROL
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Manage All Parcels
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Live database records of all client shipments.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            <ClipboardList size={18} />
            Admin Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Parcels"
            value={counts.total}
            icon={Package}
            color="bg-blue-50 text-blue-600"
            active={statusFilter === "All"}
            onClick={() => setStatusFilter("All")}
          />

          <StatCard
            title="Pending"
            value={counts.pending}
            icon={Clock}
            color="bg-amber-50 text-amber-600"
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          />

          <StatCard
            title="In Transit"
            value={counts.transit}
            icon={Truck}
            color="bg-purple-50 text-purple-600"
            active={statusFilter === "in_transit"}
            onClick={() => setStatusFilter("in_transit")}
          />

          <StatCard
            title="Delivered"
            value={counts.delivered}
            icon={CheckCircle2}
            color="bg-emerald-50 text-emerald-600"
            active={statusFilter === "delivered"}
            onClick={() => setStatusFilter("delivered")}
          />

          <StatCard
            title="Cancelled"
            value={counts.cancelled}
            icon={X}
            color="bg-red-50 text-red-600"
            active={statusFilter === "cancelled"}
            onClick={() => setStatusFilter("cancelled")}
          />
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tracking ID, sender, receiver, address..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 sm:w-44"
                >
                  <option value="All">All Statuses</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Showing {filteredParcels.length} of {parcels.length} total parcels
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
          <div className="border-b border-slate-100 p-6">
            <h2 className="font-bold text-slate-900">All Live Parcels</h2>
            <p className="mt-1 text-xs text-slate-500">
              Update delivery lifecycle states and assign available agents
            </p>
          </div>

          {loading ? (
            <div className="p-16 text-center text-slate-400">Loading live parcels from server...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">Tracking ID</th>
                    <th className="px-5 py-4">Sender</th>
                    <th className="px-5 py-4">Receiver</th>
                    <th className="px-5 py-4">Charge</th>
                    <th className="px-5 py-4">Status & Transition</th>
                    <th className="px-5 py-4">Assign Agent</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-emerald-600 select-all">
                          {parcel.tracking_number}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(parcel.created_at).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {parcel.sender_name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {parcel.sender_phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {parcel.receiver_name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400 truncate max-w-xs">
                          {parcel.delivery_address}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-800">
                        ৳ {parcel.delivery_charge}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={parcel.delivery_status}
                          onChange={(e) =>
                            handleStatusChange(parcel, e.target.value)
                          }
                          className="mb-1.5 w-36 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-emerald-500"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div>
                          <StatusBadge status={parcel.delivery_status} />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={parcel.agent_id || "none"}
                          onChange={(e) =>
                            handleAgentChange(parcel, e.target.value)
                          }
                          className="w-40 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-emerald-500"
                        >
                          <option value="none">
                            {parcel.agent_id ? `Assigned (#${parcel.agent_id})` : "Unassigned"}
                          </option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.full_name} (#{agent.id})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedParcel(parcel)}
                            title="View Details"
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                          >
                            <Eye size={17} />
                          </button>

                          {parcel.delivery_status !== "cancelled" && (
                            <button
                              type="button"
                              onClick={() => setDeleteParcelId(parcel.id)}
                              title="Cancel Parcel"
                              className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                            >
                              <Trash2 size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredParcels.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-5 py-16 text-center">
                        <Package
                          size={36}
                          className="mx-auto text-slate-300"
                        />
                        <p className="mt-3 font-bold text-slate-700">
                          No parcels found
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          No shipment matches the filter criteria.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 lg:hidden">
          {filteredParcels.map((parcel) => (
            <div
              key={parcel.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-emerald-600 select-all">
                    {parcel.tracking_number}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(parcel.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={parcel.delivery_status} />
              </div>

              <div className="text-sm text-slate-700 space-y-1">
                <p><span className="text-slate-400">Sender:</span> {parcel.sender_name}</p>
                <p><span className="text-slate-400">Receiver:</span> {parcel.receiver_name}</p>
                <p><span className="text-slate-400">Charge:</span> ৳ {parcel.delivery_charge}</p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedParcel(parcel)}
                  className="flex-1 py-2 text-center text-xs font-bold text-blue-600 bg-blue-50 rounded-lg"
                >
                  Details
                </button>
                {parcel.delivery_status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => setDeleteParcelId(parcel.id)}
                    className="flex-1 py-2 text-center text-xs font-bold text-red-600 bg-red-50 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parcel Details Modal */}
      {selectedParcel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setSelectedParcel(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Parcel Overview
                </h2>
                <p className="mt-1 text-xs text-emerald-600 font-mono font-bold">
                  {selectedParcel.tracking_number}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedParcel(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-4 space-y-2">
                  <h3 className="font-bold text-emerald-700">Sender Details</h3>
                  <p className="text-sm font-bold text-slate-800">{selectedParcel.sender_name}</p>
                  <p className="text-xs text-slate-500">{selectedParcel.sender_phone}</p>
                  <p className="text-xs text-slate-500">{selectedParcel.pickup_address}</p>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4 space-y-2">
                  <h3 className="font-bold text-blue-700">Receiver Details</h3>
                  <p className="text-sm font-bold text-slate-800">{selectedParcel.receiver_name}</p>
                  <p className="text-xs text-slate-500">{selectedParcel.receiver_phone}</p>
                  <p className="text-xs text-slate-500">{selectedParcel.delivery_address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-center">
                <div>
                  <p className="text-xs text-slate-400">Weight</p>
                  <p className="font-bold text-slate-800">{selectedParcel.parcel_weight} KG</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Charge</p>
                  <p className="font-bold text-slate-800">৳ {selectedParcel.delivery_charge}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">COD</p>
                  <p className="font-bold text-slate-800">৳ {selectedParcel.cod_amount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Payment</p>
                  <p className="font-bold text-slate-800 capitalize">{selectedParcel.payment_status}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedParcel(null)}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete/Cancel Confirmation Modal */}
      {deleteParcelId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={26} />
            </div>

            <h2 className="mt-5 text-center text-xl font-bold text-slate-900">
              Cancel Parcel?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to mark parcel #{deleteParcelId} as cancelled?
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteParcelId(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                No, Keep
              </button>

              <button
                type="button"
                onClick={handleCancelParcel}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600"
              >
                Yes, Cancel Parcel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParcels;
