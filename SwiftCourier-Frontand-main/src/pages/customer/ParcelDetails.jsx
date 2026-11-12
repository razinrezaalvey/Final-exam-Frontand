import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CalendarDays,
  Truck,
  CheckCircle2,
  Clock3,
  CreditCard,
  UserRound,
  Navigation,
} from "lucide-react";
import api from "../../services/Api";

const ParcelDetails = () => {
  const { trackingId } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!trackingId) return;
    setLoading(true);
    api
      .get(`/api/v1/tracking/${encodeURIComponent(trackingId)}`)
      .then((res) => {
        setParcel(res.data);
      })
      .catch((err) => {
        console.error("Error fetching parcel:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [trackingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
        <div className="loading loading-spinner loading-lg text-emerald-600"></div>
      </div>
    );
  }

  if (error || !parcel) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">
            Parcel Not Found
          </h2>
          <p className="text-slate-500 mt-2">
            We couldn't find a parcel with tracking ID: <span className="font-mono font-bold text-emerald-600">{trackingId}</span>
          </p>
          <Link
            to="/customer/parcels"
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0 mt-6"
          >
            <ArrowLeft size={18} /> Back to My Parcels
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-purple-100 text-purple-700",
    assigned: "bg-indigo-100 text-indigo-700",
    picked_up: "bg-blue-100 text-blue-700",
    in_transit: "bg-emerald-100 text-emerald-700",
    out_for_delivery: "bg-cyan-100 text-cyan-700",
    delivered: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div className="flex items-center gap-3">
            <Link
              to="/customer/parcels"
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition text-slate-600"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Parcel Details
              </h1>
              <p className="text-sm text-slate-500">
                Tracking ID: <span className="font-bold text-emerald-700 select-all">{parcel.tracking_number}</span>
              </p>
            </div>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize self-start sm:self-auto ${
              statusColors[parcel.delivery_status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {parcel.delivery_status.replace("_", " ")}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sender */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <UserRound size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Sender Info</h3>
                <p className="text-xs text-slate-400">Pickup Details</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">Name</p>
              <p className="font-semibold text-slate-800">{parcel.sender_name}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Pickup Address</p>
              <p className="text-sm text-slate-600">{parcel.pickup_address}</p>
            </div>
          </div>

          {/* Receiver */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Receiver Info</h3>
                <p className="text-xs text-slate-400">Destination Details</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">Name</p>
              <p className="font-semibold text-slate-800">{parcel.receiver_name}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Delivery Address</p>
              <p className="text-sm text-slate-600">{parcel.delivery_address}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Status History Timeline</h2>

          {parcel.history && parcel.history.length > 0 ? (
            <div className="space-y-6">
              {parcel.history.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    {idx !== parcel.history.length - 1 && (
                      <div className="w-0.5 flex-1 bg-emerald-200 mt-2"></div>
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="font-bold text-slate-800 capitalize">
                      {item.new_status.replace("_", " ")}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                    {item.note && (
                      <p className="text-sm text-slate-600 mt-1">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No status updates recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;
