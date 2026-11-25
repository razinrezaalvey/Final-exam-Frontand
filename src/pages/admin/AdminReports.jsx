
import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/Api";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Wallet,
  CheckCircle,
  Clock,
  Download,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  Users,
  ChartNoAxesCombined,
  FileSpreadsheet,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

const monthlyData = [
  { month: "Jan", revenue: 0, parcels: 0 },
];

const formatCurrency = (amount) =>
  `৳${Number(amount).toLocaleString("en-IN")}`;

const AdminReports = () => {
  const [period, setPeriod] = useState("7 Months");
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [liveParcels, setLiveParcels] = useState([]);
  const [liveAgents, setLiveAgents] = useState([]);

  useEffect(() => {
    api.get("/api/v1/parcels?page_size=100")
      .then((res) => setLiveParcels(res.data?.data || []))
      .catch(() => setLiveParcels([]));
    api.get("/api/v1/users?role=agent&page_size=100")
      .then((res) => setLiveAgents(res.data?.data || []))
      .catch(() => setLiveAgents([]));
  }, []);

  const totalP = liveParcels.length || 1;
  const deliveredP = liveParcels.filter((p) => p.delivery_status === "delivered").length;
  const transitP = liveParcels.filter((p) => ["picked_up", "in_transit", "out_for_delivery"].includes(p.delivery_status)).length;
  const pendingP = liveParcels.filter((p) => ["pending", "confirmed", "assigned"].includes(p.delivery_status)).length;
  const cancelledP = liveParcels.filter((p) => p.delivery_status === "cancelled").length;
  const totalRev = liveParcels.reduce((sum, p) => sum + Number(p.delivery_charge || 0), 0);

  const parcelStatuses = [
    { label: "Delivered", value: Math.round((deliveredP / totalP) * 100), count: deliveredP, color: "bg-emerald-500" },
    { label: "In Transit", value: Math.round((transitP / totalP) * 100), count: transitP, color: "bg-blue-500" },
    { label: "Pending", value: Math.round((pendingP / totalP) * 100), count: pendingP, color: "bg-amber-500" },
    { label: "Cancelled", value: Math.round((cancelledP / totalP) * 100), count: cancelledP, color: "bg-red-500" },
  ];

  const agents = liveAgents.map((a) => ({
    name: a.full_name,
    deliveries: liveParcels.filter((p) => p.agent_id === a.id && p.delivery_status === "delivered").length,
    rating: 5.0,
    earnings: liveParcels
      .filter((p) => p.agent_id === a.id && p.delivery_status === "delivered")
      .reduce((sum, p) => sum + Number(p.delivery_charge || 0), 0),
  }));

  const transactions = liveParcels.map((p) => ({
    id: p.tracking_number,
    customer: p.sender_name,
    type: p.cod_amount > 0 ? "Cash on Delivery" : "Delivery Charge",
    date: p.created_at ? new Date(p.created_at).toLocaleDateString() : "",
    amount: Number(p.delivery_charge || 0),
    status: p.payment_status === "paid" ? "Paid" : "Pending",
  }));

  const visibleMonths = useMemo(() => {
    if (period === "3 Months") return monthlyData.slice(-3);
    if (period === "6 Months") return monthlyData.slice(-6);
    return monthlyData;
  }, [period]);

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transactionFilter === "All" ||
      transaction.status === transactionFilter
    );
  });

  const stats = [
    {
      label: "Total Revenue",
      value: "৳8,45,250",
      change: "+12.8%",
      positive: true,
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
      description: "Compared to last month",
    },
    {
      label: "Total Parcels",
      value: "12,385",
      change: "+8.2%",
      positive: true,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      description: "Compared to last month",
    },
    {
      label: "Delivered Parcels",
      value: "8,420",
      change: "+15.4%",
      positive: true,
      icon: CheckCircle,
      color: "bg-purple-50 text-purple-600",
      description: "Compared to last month",
    },
    {
      label: "Pending Parcels",
      value: "1,115",
      change: "-4.5%",
      positive: false,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      description: "Compared to last month",
    },
  ];

  const maxRevenue = Math.max(...visibleMonths.map((item) => item.revenue));

  const exportCSV = () => {
    const headers = [
      "Transaction ID",
      "Customer",
      "Type",
      "Date",
      "Amount",
      "Status",
    ];

    const rows = filteredTransactions.map((item) => [
      item.id,
      item.customer,
      item.type,
      item.date,
      item.amount,
      item.status,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "swiftcourier-transactions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success("CSV report downloaded");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-600">
              ADMINISTRATION / ANALYTICS
            </p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Reports & Analytics
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor business performance and delivery operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <CalendarDays size={17} className="text-emerald-600" />
              November 2026
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`flex items-center gap-1 text-xs font-bold ${
                      stat.positive
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {stat.positive ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-400">
                    {stat.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Chart and Status */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Revenue Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 md:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Revenue Overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Monthly revenue performance
                </p>
              </div>

              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-emerald-500"
              >
                <option>3 Months</option>
                <option>6 Months</option>
                <option>7 Months</option>
              </select>
            </div>

            <div className="mt-8">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <h3 className="mt-1 text-3xl font-bold text-slate-900">
                    ৳5,57,000
                  </h3>
                </div>
                <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-600">
                  <TrendingUp size={14} /> 12.8%
                </span>
              </div>

              <div className="flex h-64 gap-3 border-b border-l border-slate-100 px-2 pb-2">
                <div className="flex flex-col justify-between pb-1 text-xs text-slate-400">
                  <span>100k</span>
                  <span>75k</span>
                  <span>50k</span>
                  <span>25k</span>
                  <span>0</span>
                </div>

                <div className="flex flex-1 items-end justify-around gap-2">
                  {visibleMonths.map((item) => (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div
                        className="group relative w-full max-w-12 rounded-t-lg bg-emerald-500 transition hover:bg-emerald-600"
                        style={{
                          height: `${(item.revenue / maxRevenue) * 88}%`,
                          minHeight: "8px",
                        }}
                        title={`${item.month}: ${formatCurrency(item.revenue)}`}
                      >
                        <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>

                      <span className="text-xs text-slate-500">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                Monthly Revenue
              </div>
            </div>
          </div>

          {/* Parcel Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Parcel Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Current parcel distribution
            </p>

            <div className="relative mx-auto my-8 flex h-48 w-48 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#10b981 0% 68%, #3b82f6 68% 86%, #f59e0b 86% 95%, #ef4444 95% 100%)",
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-bold text-slate-900">
                  12,385
                </span>
                <span className="text-xs text-slate-500">Total Parcels</span>
              </div>
            </div>

            <div className="space-y-4">
              {parcelStatuses.map((status) => (
                <div key={status.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
                      <span className="font-medium text-slate-600">
                        {status.label}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {status.value}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${status.color}`}
                      style={{ width: `${status.value}%` }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {status.count.toLocaleString()} parcels
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance and Agents */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Delivery Performance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <ChartNoAxesCombined size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Delivery Performance
                </h2>
                <p className="text-sm text-slate-500">
                  Overall operational performance
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Success Rate</p>
                <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                  94.8%
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Successful deliveries
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Average Delivery</p>
                <h3 className="mt-2 text-3xl font-bold text-blue-600">
                  2.4
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Days per parcel
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Active Agents</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  145
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Currently available
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Customer Satisfaction</p>
                <h3 className="mt-2 text-3xl font-bold text-amber-500">
                  4.8/5
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Average customer rating
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-600">
                  On-time Delivery Rate
                </span>
                <span className="font-bold text-slate-800">92%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[92%] rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Top Agents */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Top Delivery Agents
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Best performing delivery team
                </p>
              </div>
              <Users size={22} className="text-emerald-600" />
            </div>

            <div className="mt-5 space-y-4">
              {agents.map((agent, index) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {agent.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {agent.deliveries} deliveries · ⭐ {agent.rating}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {formatCurrency(agent.earnings)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Earnings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={20} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Transactions
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Latest payment and delivery transactions
              </p>
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-emerald-500"
              >
                <option value="All">All Transactions</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {transaction.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          transaction.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
            Showing {filteredTransactions.length} transactions
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          SwiftCourier Reports & Analytics · Demo data for frontend preview
        </p>
      </div>
    </div>
  );
};

export default AdminReports;
