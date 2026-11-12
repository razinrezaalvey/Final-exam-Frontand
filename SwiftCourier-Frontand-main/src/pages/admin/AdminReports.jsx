import React, { useEffect, useState } from "react";
import {
  Package,
  Wallet,
  CheckCircle,
  Clock,
  Download,
  CalendarDays,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";

const formatCurrency = (amount) => `৳${Number(amount || 0).toLocaleString("en-IN")}`;

const AdminReports = () => {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [sumRes, payRes] = await Promise.allSettled([
        api.get("/api/v1/reports/summary"),
        api.get("/api/v1/payments?page_size=50"),
      ]);
      if (sumRes.status === "fulfilled") {
        setSummary(sumRes.value.data?.data);
      }
      if (payRes.status === "fulfilled") {
        const d = payRes.value.data?.data;
        setPayments(Array.isArray(d) ? d : (d?.items || []));
      }
    } catch {
      toast.error("Failed to load reports summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const overview = summary?.overview || {
    total_revenue: 0,
    total_parcels: 0,
    delivered_parcels: 0,
    pending_parcels: 0,
    active_deliveries: 0,
  };

  const statusBreakdown = summary?.parcel_status_breakdown || {};

  const exportCSV = () => {
    const headers = ["Payment ID", "Parcel ID", "Amount", "Method", "Status", "Date"];
    const rows = payments.map((p) => [
      p.id,
      p.parcel_id,
      p.amount,
      p.payment_method,
      p.payment_status,
      new Date(p.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "swiftcourier-financial-report.csv";
    link.click();
    toast.success("CSV report downloaded!");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold text-emerald-600">ADMINISTRATION / ANALYTICS</p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-slate-500">
              Live operational metrics and revenue tracking directly from SwiftCourier database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchReports}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
            >
              <Download size={17} /> Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(overview.total_revenue)}
                </h3>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <Wallet size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Parcels</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {overview.total_parcels}
                </h3>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Package size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Delivered Shipments</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {overview.delivered_parcels}
                </h3>
              </div>
              <div className="rounded-2xl bg-purple-50 p-3 text-purple-600">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active / In-Transit</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {overview.active_deliveries}
                </h3>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <Clock size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Parcel Status Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Parcel Status Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs uppercase font-semibold text-slate-500">{status.replace(/_/g, " ")}</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Live Payment Transactions</h3>
          {payments.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No payment transactions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Txn ID</th>
                    <th className="px-5 py-3">Parcel ID</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono font-bold text-slate-800">#{p.id}</td>
                      <td className="px-5 py-3 text-slate-600">Parcel #{p.parcel_id}</td>
                      <td className="px-5 py-3 uppercase text-slate-700">{p.payment_method}</td>
                      <td className="px-5 py-3 font-bold text-emerald-600">৳{p.amount}</td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700">
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
