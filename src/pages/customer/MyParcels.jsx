
import React, { useMemo, useState } from "react";
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
} from "lucide-react";

import { demoParcels } from "../../data/demoParcels";

const MyParcels = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Calculate statistics
  const totalParcels = demoParcels.length;

  const pendingParcels = demoParcels.filter(
    (parcel) => parcel.status === "Pending"
  ).length;

  const inTransitParcels = demoParcels.filter(
    (parcel) => parcel.status === "In Transit"
  ).length;

  const deliveredParcels = demoParcels.filter(
    (parcel) => parcel.status === "Delivered"
  ).length;

  // Filter and search parcels
  const filteredParcels = useMemo(() => {
    return demoParcels.filter((parcel) => {
      const matchesSearch =
        parcel.trackingId.toLowerCase().includes(search.toLowerCase()) ||
        parcel.receiver.toLowerCase().includes(search.toLowerCase()) ||
        parcel.receiverAddress.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        activeFilter === "All" || parcel.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, activeFilter]);

  const filters = [
    "All",
    "Pending",
    "Picked Up",
    "In Transit",
    "Delivered",
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

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
              Manage and track all your shipments in one place.
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

          {filteredParcels.length > 0 ? (
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
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td>
                        <span className="font-bold text-emerald-700">
                          {parcel.trackingId}
                        </span>
                      </td>

                      <td>
                        <p className="font-semibold text-slate-800">
                          {parcel.receiver}
                        </p>

                        <p className="text-xs text-slate-400">
                          {parcel.receiverPhone}
                        </p>
                      </td>

                      <td>
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin size={14} />
                          <span>{parcel.receiverAddress}</span>
                        </div>
                      </td>

                      <td className="text-slate-500">
                        {parcel.bookingDate}
                      </td>

                      <td className="font-semibold text-slate-700">
                        ৳{parcel.deliveryCharge}
                      </td>

                      <td>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                            parcel.status
                          )}`}
                        >
                          {parcel.status}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/customer/parcels/${parcel.trackingId}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-800"
                        >
                          <Eye size={16} />
                          Details
                        </Link>
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
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Shipment History
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredParcels.length} parcel(s) found
            </p>
          </div>

          {filteredParcels.length > 0 ? (
            filteredParcels.map((parcel) => (
              <div
                key={parcel.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Tracking Number
                    </p>

                    <h3 className="font-bold text-emerald-700 break-all">
                      {parcel.trackingId}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${getStatusStyle(
                      parcel.status
                    )}`}
                  >
                    {parcel.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Package size={16} className="text-emerald-600" />
                    <span>{parcel.receiver}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} className="text-emerald-600" />
                    <span>{parcel.receiverAddress}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarDays size={16} className="text-emerald-600" />
                    <span>{parcel.bookingDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Delivery Charge
                    </p>

                    <p className="font-bold text-slate-800">
                      ৳{parcel.deliveryCharge}
                    </p>
                  </div>

                  <Link
                    to={`/customer/parcels/${parcel.trackingId}`}
                    className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-lg"
                  >
                    <Eye size={15} />
                    View Details
                  </Link>
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

        {/* Demo Notice */}
        <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <p className="text-sm text-emerald-800">
            <strong>Demo Mode:</strong> These shipment records are sample data.
            Real parcel information will be loaded from the FastAPI backend later.
          </p>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ onClear }) => {
  return (
    <div className="text-center py-12 px-5 bg-white rounded-2xl">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package size={30} className="text-slate-400" />
      </div>

      <h3 className="text-lg font-bold text-slate-800">
        No Parcels Found
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        No shipments match your search or selected filter.
      </p>

      <button
        onClick={onClear}
        className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-0 mt-5"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default MyParcels;
