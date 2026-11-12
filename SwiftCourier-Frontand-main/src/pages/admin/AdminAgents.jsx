import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Package,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  Bike,
  ShieldCheck,
  Filter,
  Ban,
  CircleCheck,
  Truck,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    vehicle_type: "motorcycle",
    vehicle_number: "",
    license_number: "",
  });

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/users?role=agent&page_size=100");
      setAgents(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load delivery agents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/agents", newAgent);
      toast.success("Delivery agent created successfully!");
      setShowAddModal(false);
      setNewAgent({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        vehicle_type: "motorcycle",
        vehicle_number: "",
        license_number: "",
      });
      fetchAgents();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to create agent.");
    }
  };

  const handleToggleStatus = async (agent) => {
    const updatedStatus = !agent.is_active;
    try {
      await api.put(`/api/v1/users/${agent.id}`, { is_active: updatedStatus });
      toast.success(`Agent ${updatedStatus ? "activated" : "deactivated"} successfully!`);
      fetchAgents();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to update agent status.");
    }
  };

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (a.full_name || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q) ||
        (a.phone || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && a.is_active) ||
        (statusFilter === "Deactivated" && !a.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [agents, search, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              FLEET DISPATCH
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Delivery Agents
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage logistics agents, assign deliveries, and monitor fleet performance.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 shadow-md shadow-emerald-100"
          >
            <Plus size={18} />
            Register Agent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Agents</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">{agents.length}</h3>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-semibold uppercase">Active Fleet</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">
              {agents.filter((a) => a.is_active).length}
            </h3>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
            <p className="text-xs text-slate-400 font-semibold uppercase">Deactivated</p>
            <h3 className="text-2xl font-black text-slate-400 mt-2">
              {agents.filter((a) => !a.is_active).length}
            </h3>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agent name, email, or phone..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            {["All", "Active", "Deactivated"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  statusFilter === st
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Agents Table */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-400">Loading fleet agents...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Agent Name</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                            {agent.full_name?.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{agent.full_name}</p>
                            <p className="text-xs text-slate-400">Agent ID #{agent.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        <p className="font-medium text-slate-800">{agent.email}</p>
                        <p className="text-xs text-slate-400">{agent.phone || "No phone"}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            agent.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {agent.is_active ? "Active" : "Deactivated"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(agent.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAgent(agent)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                            title="View Agent Profile"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(agent)}
                            className={`p-2 rounded-lg text-xs font-bold ${
                              agent.is_active
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                            title={agent.is_active ? "Deactivate" : "Activate"}
                          >
                            {agent.is_active ? <Ban size={15} /> : <CircleCheck size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredAgents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400">
                        No delivery agents registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Register Agent Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-slate-900">Register Delivery Agent</h2>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAgent.full_name}
                  onChange={(e) => setNewAgent({ ...newAgent, full_name: e.target.value })}
                  placeholder="Agent Name"
                  className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    placeholder="agent@company.com"
                    className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={newAgent.phone}
                    onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newAgent.password}
                  onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                  placeholder="Min 8 chars, 1 uppercase, 1 digit"
                  className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Vehicle Type</label>
                  <select
                    value={newAgent.vehicle_type}
                    onChange={(e) => setNewAgent({ ...newAgent, vehicle_type: e.target.value })}
                    className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                  >
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Vehicle Number</label>
                  <input
                    type="text"
                    value={newAgent.vehicle_number}
                    onChange={(e) => setNewAgent({ ...newAgent, vehicle_number: e.target.value })}
                    placeholder="DHA-METRO-..."
                    className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">License Number</label>
                <input
                  type="text"
                  value={newAgent.license_number}
                  onChange={(e) => setNewAgent({ ...newAgent, license_number: e.target.value })}
                  placeholder="Driving License #"
                  className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm mt-4"
              >
                Register Agent Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setSelectedAgent(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-slate-900">Agent Profile</h2>
              <button onClick={() => setSelectedAgent(null)}><X size={18} /></button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Full Name</p>
                <p className="font-bold text-slate-800">{selectedAgent.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="font-bold text-slate-800">{selectedAgent.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="font-bold text-slate-800">{selectedAgent.phone || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Status</p>
                <p className="font-semibold text-emerald-700">{selectedAgent.is_active ? "Active" : "Deactivated"}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedAgent(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgents;
