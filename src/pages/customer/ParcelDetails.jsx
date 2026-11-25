
import React from "react";
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
import { demoParcels } from "../../data/demoParcels";

const ParcelDetails = () => {
  const { trackingId } = useParams();

  const parcel = demoParcels.find(
    (item) => item.trackingId === trackingId
  );

  if (!parcel) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">
            Parcel Not Found
          </h2>
          <p className="text-slate-500 mt-2">
            We couldn't find a parcel with this tracking ID.
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
    "Pending": "bg-amber-100 text-amber-700",
    "Picked Up": "bg-blue-100 text-blue-700",
    "In Transit": "bg-emerald-100 text-emerald-700",
    "Delivered": "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <Link
              to="/customer/parcels"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-3"
            >
              <ArrowLeft size={17} /> Back to My Parcels
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">
              Parcel Details
            </h1>
            <p className="text-slate-500 mt-1">
              View your shipment information and delivery progress.
            </p>
          </div>

          <Link
            to="/track"
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          >
            <Navigation size={18} /> Track Parcel
          </Link>
        </div>

        {/* Tracking Summary */}
        <div className="bg-slate-950 rounded-2xl p-6 md:p-8 text-white mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-slate-400 text-sm mb-2">
                Tracking Number
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
                {parcel.trackingId}
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                Booked on {parcel.bookingDate}
              </p>
            </div>

            <div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  statusColors[parcel.status] ||
                  "bg-slate-700 text-white"
                }`}
              >
                <Truck size={16} />
                {parcel.status}
              </span>
              <p className="text-slate-400 text-sm mt-3">
                Estimated delivery: {parcel.estimatedDelivery}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Route */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-6">
                Delivery Route
              </h3>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <MapPin size={20} />
                    <span className="text-xs font-semibold uppercase">
                      Pickup
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800">
                    {parcel.senderAddress}
                  </h4>
                </div>

                <div className="text-emerald-600">
                  <Truck size={25} />
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-emerald-600 mb-2">
                    <span className="text-xs font-semibold uppercase">
                      Destination
                    </span>
                    <MapPin size={20} />
                  </div>
                  <h4 className="font-bold text-slate-800">
                    {parcel.receiverAddress}
                  </h4>
                </div>
              </div>
            </div>

            {/* Sender and Receiver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600 mb-5">
                  <UserRound size={20} />
                  <h3 className="font-bold text-slate-900">
                    Sender Information
                  </h3>
                </div>

                <h4 className="font-bold text-slate-800">
                  {parcel.sender}
                </h4>
                <p className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                  <Phone size={15} /> {parcel.senderPhone}
                </p>
                <p className="flex items-start gap-2 text-sm text-slate-500 mt-3">
                  <MapPin size={15} className="shrink-0" />
                  {parcel.senderAddress}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600 mb-5">
                  <UserRound size={20} />
                  <h3 className="font-bold text-slate-900">
                    Receiver Information
                  </h3>
                </div>

                <h4 className="font-bold text-slate-800">
                  {parcel.receiver}
                </h4>
                <p className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                  <Phone size={15} /> {parcel.receiverPhone}
                </p>
                <p className="flex items-start gap-2 text-sm text-slate-500 mt-3">
                  <MapPin size={15} className="shrink-0" />
                  {parcel.receiverAddress}
                </p>
              </div>
            </div>

            {/* Parcel Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-5">
                Parcel Information
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Parcel Type</p>
                  <p className="font-semibold text-slate-800">
                    {parcel.parcelType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Weight</p>
                  <p className="font-semibold text-slate-800">
                    {parcel.weight}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Delivery Type</p>
                  <p className="font-semibold text-slate-800">
                    {parcel.deliveryType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Booking Date</p>
                  <p className="font-semibold text-slate-800">
                    {parcel.bookingDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Tracking ID</p>
                  <p className="font-semibold text-slate-800 break-all">
                    {parcel.trackingId}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-7">
                Shipment History
              </h3>

              <div className="space-y-0">
                {parcel.history.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          item.completed
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 size={19} />
                        ) : (
                          <Clock3 size={19} />
                        )}
                      </div>

                      {index !== parcel.history.length - 1 && (
                        <div
                          className={`w-0.5 h-14 ${
                            item.completed
                              ? "bg-emerald-300"
                              : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="pb-7">
                      <h4
                        className={`font-semibold ${
                          item.completed
                            ? "text-slate-800"
                            : "text-slate-400"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {item.location}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="text-emerald-600" size={21} />
                <h3 className="font-bold text-slate-900">
                  Payment Summary
                </h3>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-500">Delivery Charge</span>
                <span className="font-semibold">
                  ৳{parcel.deliveryCharge}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-500">COD Amount</span>
                <span className="font-semibold">
                  ৳{parcel.codAmount}
                </span>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between">
                <span className="font-bold text-slate-800">
                  Total Amount
                </span>
                <span className="font-bold text-emerald-600 text-xl">
                  ৳{parcel.deliveryCharge + parcel.codAmount}
                </span>
              </div>

              <div className="mt-5 bg-amber-50 text-amber-700 rounded-xl p-3 text-sm">
                Payment Status: <strong>{parcel.paymentStatus}</strong>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="text-emerald-600" size={21} />
                <h3 className="font-bold text-slate-900">
                  Delivery Estimate
                </h3>
              </div>

              <p className="text-sm text-slate-500">
                Expected delivery date
              </p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">
                {parcel.estimatedDelivery}
              </p>
            </div>

            {/* Help Card */}
            <div className="bg-emerald-600 rounded-2xl p-6 text-white">
              <Package size={30} className="mb-4" />
              <h3 className="text-lg font-bold">
                Need Help?
              </h3>
              <p className="text-emerald-50 text-sm mt-2">
                Have questions about your shipment? Our support team is here to help.
              </p>
              <Link
                to="/contact"
                className="btn bg-white text-emerald-700 hover:bg-emerald-50 border-0 mt-5 w-full"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Demo parcel information — not connected to the backend yet.
        </p>
      </div>
    </div>
  );
};

export default ParcelDetails;
