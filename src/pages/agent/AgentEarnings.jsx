
import React, { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  Search,
  Download,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Banknote,
} from "lucide-react";

const earningsData = [
  {
    id: 1,
    trackingId: "SWC-2026-10025",
    customer: "Karim Hasan",
    date: "2026-11-03",
    deliveryType: "Express",
    amount: 120,
    status: "Paid",
  },
  {
    id: 2,
    trackingId: "SWC-2026-10026",
    customer: "Nusrat Jahan",
    date: "2026-11-03",
    deliveryType: "Regular",
    amount: 80,
    status: "Pending",
  },
  {
    id: 3,
    trackingId: "SWC-2026-10027",
    customer: "Sakib Ahmed",
    date: "2026-11-02",
    deliveryType: "Express",
    amount: 120,
    status: "Paid",
  },
  {
    id: 4,
    trackingId: "SWC-2026-10028",
    customer: "Mim Akter",
    date: "2026-11-02",
    deliveryType: "Regular",
    amount: 80,
    status: "Paid",
  },
  {
    id: 5,
    trackingId: "SWC-2026-10029",
    customer: "Tanvir Ahmed",
    date: "2026-11-01",
    deliveryType: "Express",
    amount: 120,
    status: "Pending",
  },
];

const AgentEarnings = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const totalEarnings = earningsData.reduce(
    (total, item) => total + item.amount,
    0
  );

  const paidAmount = earningsData
    .filter((item) => item.status === "Paid")
    .reduce((total, item) => total + item.amount, 0);

  const pendingAmount = earningsData
    .filter((item) => item.status === "Pending")
    .reduce((total, item) => total + item.amount, 0);

  const filteredEarnings = useMemo(() => {
    return earningsData.filter((item) => {
      const matchesSearch =
        item.trackingId.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const stats = [
    {
      title: "Total Earnings",
      amount: totalEarnings,
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
      note: "All recorded earnings",
    },
    {
      title: "Paid Amount",
      amount: paidAmount,
      icon: CheckCircle2,
      color: "bg-blue-50 text-blue-600",
      note: "Successfully paid",
    },
    {
      title: "Pending Payment",
      amount: pendingAmount,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      note: "Awaiting payment",
    },
    {
      title: "Total Deliveries",
      amount: earningsData.length,
      isCount: true,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
      note: "Recorded deliveries",
    },
  ];

  const downloadCSV = () => {
    const headers = [
      "Tracking ID",
      "Customer",
      "Date",
      "Delivery Type",
      "Amount",
      "Payment Status",
    ];

    const rows = filteredEarnings.map((item) => [
      item.trackingId,
      item.customer,
      item.date,
      item.deliveryType,
      item.amount,
      item.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "swiftcourier-earnings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

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
              My Earnings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track your delivery income and payment history.
            </p>
          </div>

          <button
            onClick={downloadCSV}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-emerald-600"
          >
            <Download size={17} />
            Export Report
          </button>
        </div>

        {/* Earnings Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl md:p-9">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                <Wallet size={18} />
                Total Earnings
              </div>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                ৳{totalEarnings.toLocaleString("en-BD")}
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Your total recorded delivery income
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                <TrendingUp size={16} />
                Earnings overview
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Paid
                </div>
                <h3 className="mt-3 text-2xl font-bold">
                  ৳{paidAmount}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock size={16} className="text-amber-400" />
                  Pending
                </div>
                <h3 className="mt-3 text-2xl font-bold">
                  ৳{pendingAmount}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.title}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.isCount
                        ? stat.amount
                        : `৳${stat.amount.toLocaleString("en-BD")}`}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {stat.note}
                </p>
              </div>
            );
          })}
        </div>

        {/* Payment Summary */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ArrowUpRight size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Paid Earnings
                </h3>
                <p className="text-xs text-slate-500">
                  Amount already paid to you
                </p>
              </div>
            </div>

            <h2 className="mt-5 text-3xl font-bold text-emerald-600">
              ৳{paidAmount.toLocaleString("en-BD")}
            </h2>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${
                    totalEarnings
                      ? (paidAmount / totalEarnings) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {totalEarnings
                ? Math.round((paidAmount / totalEarnings) * 100)
                : 0}
              % of total earnings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <ArrowDownRight size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Pending Earnings
                </h3>
                <p className="text-xs text-slate-500">
                  Amount waiting for payment
                </p>
              </div>
            </div>

            <h2 className="mt-5 text-3xl font-bold text-amber-600">
              ৳{pendingAmount.toLocaleString("en-BD")}
            </h2>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{
                  width: `${
                    totalEarnings
                      ? (pendingAmount / totalEarnings) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Payment status overview
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 md:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Earnings History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review your delivery-wise earnings.
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tracking ID..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["All", "Paid", "Pending"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    filter === item
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Parcel ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Earning</th>
                  <th className="px-6 py-4">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEarnings.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-5 font-bold text-slate-800">
                      {item.trackingId}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {item.customer}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {item.deliveryType}
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-800">
                      ৳{item.amount}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden">
            {filteredEarnings.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">
                      {item.trackingId}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.customer}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      {item.date} · {item.deliveryType}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      ৳{item.amount}
                    </p>
                  </div>
                  <Banknote className="text-emerald-500" size={24} />
                </div>
              </div>
            ))}
          </div>

          {filteredEarnings.length === 0 && (
            <div className="py-14 text-center">
              <Wallet size={38} className="mx-auto text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                No earnings found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another search or payment filter.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400">
          Demo earnings only — actual payment records will be connected with FastAPI.
        </p>
      </div>
    </div>
  );
};

export default AgentEarnings;
