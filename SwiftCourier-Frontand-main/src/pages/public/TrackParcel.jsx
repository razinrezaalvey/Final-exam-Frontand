import React, { useState } from 'react';
import {
  Search,
  Package,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Clock,
  Truck,
  Warehouse,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/Api';

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      setError('Please enter your tracking ID.');
      setParcel(null);
      return;
    }

    setLoading(true);
    setError('');
    setParcel(null);

    try {
      const res = await api.get(`/api/v1/tracking/${encodeURIComponent(trackingId.trim())}`);
      const data = res.data;

      // Transform backend response
      const statusMap = {
        pending: 'Pending Confirmation',
        confirmed: 'Confirmed',
        assigned: 'Assigned to Agent',
        picked_up: 'Picked Up',
        in_transit: 'In Transit',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivered',
        failed: 'Delivery Failed',
        cancelled: 'Cancelled',
        returned: 'Returned to Sender',
      };

      const events = (data.history || []).map((h) => {
        const dateObj = new Date(h.created_at);
        return {
          title: statusMap[h.new_status] || h.new_status,
          location: data.pickup_address,
          date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: h.note || `Status updated to ${h.new_status.replace('_', ' ')}`,
          completed: true,
          icon: h.new_status === 'delivered' ? CheckCircle2 : h.new_status === 'picked_up' ? Warehouse : Truck,
        };
      });

      setParcel({
        trackingId: data.tracking_number,
        status: statusMap[data.delivery_status] || data.delivery_status,
        sender: data.sender_name,
        receiver: data.receiver_name,
        origin: data.pickup_address,
        destination: data.delivery_address,
        lastLocation: data.pickup_address,
        events: events.length > 0 ? events : [
          {
            title: statusMap[data.delivery_status] || data.delivery_status,
            location: data.pickup_address,
            date: 'Today',
            time: 'Just now',
            description: 'Current shipment status.',
            completed: true,
            icon: Package,
          }
        ],
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No parcel found with this tracking ID. Please check and try again.');
      } else {
        setError(err.response?.data?.error?.message || 'Failed to track parcel. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white md:py-28">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Package size={34} />
          </div>

          <p className="mb-4 font-semibold uppercase tracking-[3px] text-emerald-400">
            SwiftCourier Live Tracking
          </p>

          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Track Your <span className="text-emerald-400">Parcel</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Stay updated with your shipment. Enter your unique tracking ID
            and discover the live status of your parcel.
          </p>

          {/* Tracking Form */}
          <form
            onSubmit={handleTrack}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="shrink-0 text-emerald-600" size={22} />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID (e.g. SWC...)"
                className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Tracking...' : 'Track Parcel'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {error && (
            <div className="mx-auto mt-4 flex max-w-2xl items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Tracking Result */}
      {parcel && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">

            {/* Result Header */}
            <div className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Tracking Number
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {parcel.trackingId}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Origin: {parcel.origin}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 md:self-center">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></span>
                {parcel.status}
              </div>
            </div>

            {/* Delivery Overview */}
            <div className="mb-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={24} />
                </div>
                <p className="text-sm text-slate-500">Pickup Address</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {parcel.origin}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Truck size={24} />
                </div>
                <p className="text-sm text-slate-500">Destination</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {parcel.destination}
                </h3>
              </div>
            </div>

            {/* Timeline */}
            <div className="grid gap-8 lg:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 md:p-8">
                <h3 className="mb-8 text-2xl font-bold text-slate-900">
                  Shipment Progress Timeline
                </h3>

                <div className="space-y-8">
                  {parcel.events.map((event, index) => {
                    const EventIcon = event.icon || Truck;

                    return (
                      <div key={index} className="relative flex gap-5">
                        {index !== parcel.events.length - 1 && (
                          <div
                            className="absolute left-6 top-14 h-[calc(100%+8px)] w-0.5 bg-emerald-500"
                          ></div>
                        )}

                        <div
                          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"
                        >
                          <EventIcon size={21} />
                        </div>

                        <div className="flex-1 border-b border-slate-100 pb-7">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <h4 className="font-bold text-slate-900">
                              {event.title}
                            </h4>

                            <span className="text-xs font-medium text-slate-500">
                              {event.date} • {event.time}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {event.location}
                          </p>

                          <p className="mt-2 text-sm text-slate-400">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipment Details */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-xl font-bold text-slate-900">
                    Shipment Details
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Sender
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {parcel.sender}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Receiver
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {parcel.receiver}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Current Status
                      </p>
                      <p className="mt-1 font-bold text-emerald-600">
                        {parcel.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950 p-6 text-white">
                  <ShieldCheck className="mb-4 text-emerald-400" size={30} />
                  <h3 className="text-lg font-bold">Live Verified Tracking</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Real-time status updates directly from SwiftCourier logistics dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Help Section */}
      {!parcel && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Clock size={28} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Waiting for Your Parcel?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
              Enter your tracking number above to check your shipment progress.
              If you need assistance, our support team is here to help.
            </p>

            <a
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Contact Support <ArrowRight size={18} />
            </a>
          </div>
        </section>
      )}
    </div>
  );
};

export default TrackParcel;
