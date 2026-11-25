
import React, { useMemo, useState } from "react";
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

const initialParcels = [
  {
    id: "SWC-2026-10025",
    sender: "Rahim Ahmed",
    senderPhone: "01712345678",
    receiver: "Karim Hasan",
    receiverPhone: "01812345678",
    origin: "Dhanmondi, Dhaka",
    destination: "Agrabad, Chattogram",
    type: "Electronics",
    weight: "2.5 kg",
    bookingDate: "2026-11-03",
    deliveryCharge: 250,
    codAmount: 1500,
    paymentStatus: "COD Pending",
    status: "In Transit",
    agent: "Rahim Ahmed",
  },
  {
    id: "SWC-2026-10024",
    sender: "Nusrat Jahan",
    senderPhone: "01912345678",
    receiver: "Sakib Hasan",
    receiverPhone: "01612345678",
    origin: "Mirpur, Dhaka",
    destination: "Zindabazar, Sylhet",
    type: "Clothing",
    weight: "1.5 kg",
    bookingDate: "2026-11-03",
    deliveryCharge: 180,
    codAmount: 0,
    paymentStatus: "Paid",
    status: "Delivered",
    agent: "Karim Hasan",
  },
  {
    id: "SWC-2026-10023",
    sender: "Tanvir Ahmed",
    senderPhone: "01798765432",
    receiver: "Mim Akter",
    receiverPhone: "01898765432",
    origin: "Khulna Sadar, Khulna",
    destination: "Uttara, Dhaka",
    type: "Document",
    weight: "0.5 kg",
    bookingDate: "2026-11-02",
    deliveryCharge: 120,
    codAmount: 0,
    paymentStatus: "Paid",
    status: "Pending",
    agent: "Not Assigned",
  },
  {
    id: "SWC-2026-10022",
    sender: "Sakib Hossain",
    senderPhone: "01987654321",
    receiver: "Arif Rahman",
    receiverPhone: "01312345678",
    origin: "Banani, Dhaka",
    destination: "Rajshahi Sadar, Rajshahi",
    type: "Electronics",
    weight: "3 kg",
    bookingDate: "2026-11-02",
    deliveryCharge: 300,
    codAmount: 2000,
    paymentStatus: "COD Pending",
    status: "Picked Up",
    agent: "Sakib Hossain",
  },
  {
    id: "SWC-2026-10021",
    sender: "Mim Akter",
    senderPhone: "01612345678",
    receiver: "Nayeem Islam",
    receiverPhone: "01765432109",
    origin: "Panchlaish, Chattogram",
    destination: "Dhanmondi, Dhaka",
    type: "Food",
    weight: "2 kg",
    bookingDate: "2026-11-01",
    deliveryCharge: 220,
    codAmount: 500,
    paymentStatus: "COD Pending",
    status: "Delivered",
    agent: "Rahim Ahmed",
  },
  {
    id: "SWC-2026-10020",
    sender: "Arif Rahman",
    senderPhone: "01876543210",
    receiver: "Tania Islam",
    receiverPhone: "01976543210",
    origin: "Uttara, Dhaka",
    destination: "Barishal Sadar, Barishal",
    type: "Clothing",
    weight: "1 kg",
    bookingDate: "2026-10-31",
    deliveryCharge: 150,
    codAmount: 0,
    paymentStatus: "Paid",
    status: "Cancelled",
    agent: "Not Assigned",
  },
];

const deliveryAgents = [
  "Rahim Ahmed",
  "Karim Hasan",
  "Sakib Hossain",
  "Nayeem Islam",
];

const statusOptions = [
  "Pending",
  "Picked Up",
  "In Transit",
  "Delivered",
  "Cancelled",
];

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    "Picked Up": "bg-purple-50 text-purple-700",
    "In Transit": "bg-blue-50 text-blue-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-700",
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
  const [parcels, setParcels] = useState(initialParcels);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [deleteParcelId, setDeleteParcelId] = useState(null);
  const [editingParcel, setEditingParcel] = useState(null);

  const filteredParcels = useMemo(() => {
    return parcels.filter((parcel) => {
      const searchValue = search.toLowerCase();

      const matchesSearch = [
        parcel.id,
        parcel.sender,
        parcel.receiver,
        parcel.senderPhone,
        parcel.receiverPhone,
        parcel.origin,
        parcel.destination,
      ].some((value) => value.toLowerCase().includes(searchValue));

      const matchesStatus =
        statusFilter === "All" || parcel.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [parcels, search, statusFilter]);

  const counts = {
    total: parcels.length,
    pending: parcels.filter((p) => p.status === "Pending").length,
    transit: parcels.filter((p) => p.status === "In Transit").length,
    delivered: parcels.filter((p) => p.status === "Delivered").length,
    cancelled: parcels.filter((p) => p.status === "Cancelled").length,
  };

  const handleStatusChange = (id, status) => {
    setParcels((prev) =>
      prev.map((parcel) =>
        parcel.id === id ? { ...parcel, status } : parcel
      )
    );

    setEditingParcel(null);
    toast.success("Parcel status updated!");
  };

  const handleAgentChange = (id, agent) => {
    setParcels((prev) =>
      prev.map((parcel) =>
        parcel.id === id ? { ...parcel, agent } : parcel
      )
    );

    toast.success("Delivery agent assigned!");
  };

  const handleDelete = () => {
    setParcels((prev) =>
      prev.filter((parcel) => parcel.id !== deleteParcelId)
    );

    setDeleteParcelId(null);
    toast.success("Parcel deleted successfully!");
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
              ADMIN PORTAL
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Manage Parcels
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor, assign and manage all parcel deliveries.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            <ClipboardList size={18} />
            Dashboard
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
            active={statusFilter === "Pending"}
            onClick={() => setStatusFilter("Pending")}
          />

          <StatCard
            title="In Transit"
            value={counts.transit}
            icon={Truck}
            color="bg-purple-50 text-purple-600"
            active={statusFilter === "In Transit"}
            onClick={() => setStatusFilter("In Transit")}
          />

          <StatCard
            title="Delivered"
            value={counts.delivered}
            icon={CheckCircle2}
            color="bg-emerald-50 text-emerald-600"
            active={statusFilter === "Delivered"}
            onClick={() => setStatusFilter("Delivered")}
          />

          <StatCard
            title="Cancelled"
            value={counts.cancelled}
            icon={X}
            color="bg-red-50 text-red-600"
            active={statusFilter === "Cancelled"}
            onClick={() => setStatusFilter("Cancelled")}
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
                placeholder="Search tracking ID, customer, phone or location..."
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
                  <option value="All">All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
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
            Showing {filteredParcels.length} of {parcels.length} parcels
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
          <div className="border-b border-slate-100 p-6">
            <h2 className="font-bold text-slate-900">All Parcels</h2>
            <p className="mt-1 text-xs text-slate-500">
              Review and update parcel information
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Tracking ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Destination</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Delivery Agent</th>
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
                      <p className="text-sm font-bold text-emerald-600">
                        {parcel.id}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {parcel.bookingDate}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {parcel.sender}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {parcel.senderPhone}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {parcel.destination}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        From: {parcel.origin}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-800">
                      ৳{parcel.deliveryCharge}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={parcel.status}
                        onChange={(e) =>
                          handleStatusChange(parcel.id, e.target.value)
                        }
                        className="mb-2 w-32 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none focus:border-emerald-500"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <StatusBadge status={parcel.status} />
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={parcel.agent}
                        onChange={(e) =>
                          handleAgentChange(parcel.id, e.target.value)
                        }
                        className="w-36 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none focus:border-emerald-500"
                      >
                        <option value="Not Assigned">Not Assigned</option>
                        {deliveryAgents.map((agent) => (
                          <option key={agent} value={agent}>
                            {agent}
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

                        <button
                          type="button"
                          onClick={() => setDeleteParcelId(parcel.id)}
                          title="Delete Parcel"
                          className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2 size={17} />
                        </button>
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
                        Try another search or filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 lg:hidden">
          <div>
            <h2 className="font-bold text-slate-900">All Parcels</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredParcels.length} parcel(s) found
            </p>
          </div>

          {filteredParcels.map((parcel) => (
            <div
              key={parcel.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-emerald-600">
                    {parcel.id}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {parcel.bookingDate}
                  </p>
                </div>
                <StatusBadge status={parcel.status} />
              </div>

              <div className="my-4 space-y-3 border-y border-slate-100 py-4">
                <div className="flex items-center gap-3">
                  <UserRound size={17} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Customer</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {parcel.sender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={17} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Destination</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {parcel.destination}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Wallet size={17} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Delivery Charge</p>
                    <p className="text-sm font-bold text-slate-800">
                      ৳{parcel.deliveryCharge}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Update Status
                  </label>
                  <select
                    value={parcel.status}
                    onChange={(e) =>
                      handleStatusChange(parcel.id, e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none focus:border-emerald-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Assign Agent
                  </label>
                  <select
                    value={parcel.agent}
                    onChange={(e) =>
                      handleAgentChange(parcel.id, e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="Not Assigned">Not Assigned</option>
                    {deliveryAgents.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedParcel(parcel)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                >
                  <Eye size={17} />
                  Details
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteParcelId(parcel.id)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredParcels.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center">
              <Package size={35} className="mx-auto text-slate-300" />
              <p className="mt-3 font-bold text-slate-700">
                No parcels found
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Try another search or filter.
              </p>
            </div>
          )}
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
                  Parcel Details
                </h2>
                <p className="mt-1 text-xs text-emerald-600">
                  {selectedParcel.id}
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
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-400">Current Status</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedParcel.status} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Booking Date</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedParcel.bookingDate}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="mb-3 flex items-center gap-2 text-emerald-600">
                    <UserRound size={18} />
                    <h3 className="font-bold">Sender Information</h3>
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedParcel.sender}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Phone size={15} />
                    {selectedParcel.senderPhone}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                    <MapPin size={15} className="mt-0.5 shrink-0" />
                    {selectedParcel.origin}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="mb-3 flex items-center gap-2 text-blue-600">
                    <UserRound size={18} />
                    <h3 className="font-bold">Receiver Information</h3>
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedParcel.receiver}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Phone size={15} />
                    {selectedParcel.receiverPhone}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                    <MapPin size={15} className="mt-0.5 shrink-0" />
                    {selectedParcel.destination}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold text-slate-900">
                  Parcel Information
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Parcel Type</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedParcel.type}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Weight</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedParcel.weight}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Delivery Charge</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      ৳{selectedParcel.deliveryCharge}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">COD Amount</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      ৳{selectedParcel.codAmount}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Payment Status</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedParcel.paymentStatus}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Assigned Agent</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedParcel.agent}
                    </p>
                  </div>
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

      {/* Delete Confirmation Modal */}
      {deleteParcelId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={26} />
            </div>

            <h2 className="mt-5 text-center text-xl font-bold text-slate-900">
              Delete Parcel?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-800">
                {selectedDeleteParcel?.id}
              </span>
              ? This action cannot be undone in this demo.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteParcelId(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mx-auto mt-8 max-w-7xl text-center text-xs text-slate-400">
        Demo parcel management — changes are temporary and reset after refresh.
      </p>
    </div>
  );
};

export default AdminParcels;
