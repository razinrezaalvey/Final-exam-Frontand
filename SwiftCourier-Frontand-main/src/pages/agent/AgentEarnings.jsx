import React, { useEffect, useState, useMemo } from "react";
import {
  Wallet,
  CheckCircle2,
  Search,
  Download,
  CalendarDays,
  Package,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";
import AgentSidebar from "../../components/AgentSidebar";

const AgentEarnings = () => {
  const [profile, setProfile] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profRes, parcelsRes] = await Promise.allSettled([
        api.get("/api/v1/agents/me/profile"),
        api.get("/api/v1/parcels?page_size=100"),
      ]);
      if (profRes.status === "fulfilled") {
        setProfile(profRes.value.data);
      }
      if (parcelsRes.status === "fulfilled") {
        const d = parcelsRes.value.data?.data;
        setParcels(Array.isArray(d) ? d : (d?.items || []));
      }
    } catch {
      toast.error("Failed to load earnings records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deliveredParcels = useMemo(() => {
    return parcels.filter((p) => p.delivery_status === "delivered");
  }, [parcels]);

  const filteredEarnings = useMemo(() => {
    return deliveredParcels.filter((p) => {
      const q = search.toLowerCase();
      return (
        (p.tracking_number || "").toLowerCase().includes(q) ||
        (p.receiver_name || "").toLowerCase().includes(q)
      );
    });
  }, [deliveredParcels, search]);

  const totalEarnings = profile?.total_earnings || (deliveredParcels.length * 80);

  const exportCSV = () => {
    const headers = ["Tracking ID", "Receiver", "Delivery Charge", "COD Collected", "Date"];
    const rows = filteredEarnings.map((p) => [
      p.tracking_number,
      p.receiver_name,
      p.delivery_charge,
      p.cod_amount,
      new Date(p.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agent-earnings.csv";
    link.click();
    toast.success("Earnings report exported!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AgentSidebar />
      <main className="lg:ml-64 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">FINANCES</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Agent Earnings</h1>
            <p className="mt-2 text-sm text-slate-500">
              Track commissions and payouts for completed parcel deliveries.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <Download size={16} /> Export Statement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Accrued Earnings</p>
                <h3 className="mt-2 text-3xl font-black text-emerald-600">৳{totalEarnings.toLocaleString()}</h3>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Wallet size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed Deliveries</p>
                <h3 className="mt-2 text-3xl font-black text-slate-900">{profile?.total_deliveries || deliveredParcels.length}</h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Tasks</p>
                <h3 className="mt-2 text-3xl font-black text-amber-600">{parcels.length - deliveredParcels.length}</h3>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Package size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-slate-900">Completed Delivery History</h3>
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search delivery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {filteredEarnings.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Package size={36} className="mx-auto mb-2 opacity-30" />
              <p>No completed deliveries found yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Tracking Number</th>
                    <th className="px-5 py-3">Receiver</th>
                    <th className="px-5 py-3">Delivery Fee</th>
                    <th className="px-5 py-3">COD Amount</th>
                    <th className="px-5 py-3">Delivered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredEarnings.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">{p.tracking_number}</td>
                      <td className="px-5 py-4 text-slate-800">{p.receiver_name}</td>
                      <td className="px-5 py-4 font-semibold text-emerald-600">৳{p.delivery_charge}</td>
                      <td className="px-5 py-4 text-slate-700">৳{p.cod_amount}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {new Date(p.updated_at || p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
};

export default AgentEarnings;
