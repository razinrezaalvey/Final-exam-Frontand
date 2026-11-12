import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  ArrowRight,
  Filter,
  CalendarDays,
  X,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";

const EmptyState = ({ onClear }) => (
  <div className="py-16 text-center">
    <Package size={48} className="mx-auto text-slate-300 mb-4" />
    <h3 className="text-lg font-bold text-slate-700">No Parcels Found</h3>
    <p className="text-sm text-slate-400 mt-1">
      You haven't booked any shipments matching your search or filter.
    </p>
    <div className="mt-5 flex justify-center gap-3">
      <button
        onClick={onClear}
        className="btn btn-sm btn-ghost text-slate-600 rounded-lg"
      >
        Clear Filters
      </button>
      <Link
        to="/customer/book-parcel"
        className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg border-0"
      >
        Book a Parcel
      </Link>
    </div>
  </div>
);

const MyParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/parcels?page_size=100");
      setParcels(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load your parcels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  const handleCancelParcel = async (parcelId) => {
    if (!window.confirm("Are you sure you want to cancel this parcel request?")) return;

    try {
      await api.patch(`/api/v1/parcels/${parcelId}/status`, {
        new_status: "cancelled",
        note: "Cancelled by customer request",
      });
      toast.success("Parcel request cancelled.");
      fetchParcels();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to cancel parcel.");
    }
  };

  const statusMap = {
    pending: "Pending",
    confirmed: "Confirmed",
    assigned: "Assigned",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    failed: "Failed",
    cancelled: "Cancelled",
    returned: "Returned",
  };

  // Calculate statistics
  const totalParcels = parcels.length;
  const pendingParcels = parcels.filter((p) => p.delivery_status === "pending").length;
  const inTransitParcels = parcels.filter(
    (p) => ["in_transit", "picked_up", "out_for_delivery", "assigned"].includes(p.delivery_status)
  ).length;
  const deliveredParcels = parcels.filter((p) => p.delivery_status === "delivered").length;

  // Filter and search parcels
  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      const tracking = p.tracking_number?.toLowerCase() || "";
      const receiver = p.receiver_name?.toLowerCase() || "";
      const address = p.delivery_address?.toLowerCase() || "";
      const q = search.toLowerCase();

      const matchesSearch = tracking.includes(q) || receiver.includes(q) || address.includes(q);

      const statusLabel = statusMap[p.delivery_status] || p.delivery_status;
      const matchesStatus =
        activeFilter === "All" ||
        statusLabel.toLowerCase() === activeFilter.toLowerCase() ||
        (activeFilter === "In Transit" && ["in_transit", "picked_up", "out_for_delivery", "assigned"].includes(p.delivery_status));

      return matchesSearch && matchesStatus;
    });
  }, [parcels, search, activeFilter]);

  const filters = ["All", "Pending", "In Transit", "Delivered", "Cancelled"];

  const getStatusStyle = (rawStatus) => {
    switch (rawStatus) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "in_transit":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-700";
      case "picked_up":
      case "assigned":
      case "confirmed":
        return "bg-purple-100 text-purple-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const stats = [
    {
      title: "Total Parcels",
      value: totalParcels,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      filter: "All",
    },
    {
      title: "Pending",
      value: pendingParcels,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      filter: "Pending",
    },
    {
      title: "In Transit",
      value: inTransitParcels,
      icon: Truck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      filter: "In Transit",
    },
    {
      title: "Delivered",
      value: deliveredParcels,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      filter: "Delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-emerald-600 mb-2">
              CUSTOMER PORTAL
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              My Parcels
            </h1>

            <p className="text-slate-500 mt-2">
              Manage and track all your live shipments in real time.
            </p>
          </div>

          <Link
            to="/customer/book-parcel"
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-xl"
          >
            <Package size={18} />
            Book New Parcel
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <button
                key={index}
                onClick={() => setActiveFilter(stat.filter)}
                className={`bg-white rounded-2xl p-5 text-left border shadow-sm hover:shadow-md transition ${
                  activeFilter === stat.filter
                    ? "border-emerald-500 ring-2 ring-emerald-100"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon size={22} className={stat.color} />
                  </div>

                  <ArrowRight size={17} className="text-slate-300" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {stat.value.toString().padStart(2, "0")}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {stat.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search tracking ID, receiver or destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full pl-11 rounded-xl focus:outline-none focus:border-emerald-500"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-slate-500 mr-1">
                <Filter size={16} />
                Filter:
              </span>

              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              Shipment History
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredParcels.length} parcel(s) found
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading your parcels...</div>
          ) : filteredParcels.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th>Tracking ID</th>
                    <th>Receiver</th>
                    <th>Destination</th>
                    <th>Booking Date</th>
                    <th>Charge</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td>
                        <span className="font-bold text-emerald-700 select-all">
                          {parcel.tracking_number}
                        </span>
                      </td>

                      <td>
                        <p className="font-semibold text-slate-800">
                          {parcel.receiver_name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {parcel.receiver_phone}
                        </p>
                      </td>

                      <td>
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin size={14} />
                          <span className="max-w-xs truncate">{parcel.delivery_address}</span>
                        </div>
                      </td>

                      <td className="text-slate-500">
                        {new Date(parcel.created_at).toLocaleDateString()}
                      </td>

                      <td className="font-semibold text-slate-700">
                        ৳ {parcel.delivery_charge}
                      </td>

                      <td>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                            parcel.delivery_status
                          )}`}
                        >
                          {statusMap[parcel.delivery_status] || parcel.delivery_status}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/customer/parcels/${parcel.tracking_number}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-800"
                          >
                            <Eye size={16} />
                            Details
                          </Link>

                          {["pending", "confirmed"].includes(parcel.delivery_status) && (
                            <button
                              onClick={() => handleCancelParcel(parcel.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                              title="Cancel parcel request"
                            >
                              <XCircle size={14} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              onClear={() => {
                setSearch("");
                setActiveFilter("All");
              }}
            />
          )}
        </div>

        {/* Mobile Parcel Cards */}
        <div className="md:hidden space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Shipments</h2>
            <p className="text-sm text-slate-500">{filteredParcels.length} parcel(s)</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading...</div>
          ) : filteredParcels.length > 0 ? (
            filteredParcels.map((parcel) => (
              <div
                key={parcel.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Tracking Number</p>
                    <h3 className="font-bold text-emerald-700 break-all select-all">
                      {parcel.tracking_number}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      parcel.delivery_status
                    )}`}
                  >
                    {statusMap[parcel.delivery_status] || parcel.delivery_status}
                  </span>
                </div>

                <div className="text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">{parcel.receiver_name}</p>
                  <p className="text-xs text-slate-400">{parcel.delivery_address}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-800">৳ {parcel.delivery_charge}</span>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/customer/parcels/${parcel.tracking_number}`}
                      className="text-sm font-semibold text-emerald-600"
                    >
                      Details →
                    </Link>

                    {["pending", "confirmed"].includes(parcel.delivery_status) && (
                      <button
                        onClick={() => handleCancelParcel(parcel.id)}
                        className="text-xs font-semibold text-red-500"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              onClear={() => {
                setSearch("");
                setActiveFilter("All");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyParcels;
