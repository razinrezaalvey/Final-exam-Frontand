import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/Api";
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
  MapPin,
  CalendarDays,
  Bike,
  ShieldCheck,
  Filter,
  Ban,
  CircleCheck,
  Truck,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

const initialAgents = [
  {
    id: 1,
    name: "Sabbir Hossain",
    email: "sabbir@gmail.com",
    phone: "01711112222",
    address: "Mirpur, Dhaka",
    joined: "2026-09-12",
    vehicle: "Motorcycle",
    vehicleNumber: "DHA-METRO-HA-1234",
    assignedParcels: 18,
    delivered: 145,
    earnings: 28500,
    status: "Active",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Arif Rahman",
    email: "arif@gmail.com",
    phone: "01822223333",
    address: "Uttara, Dhaka",
    joined: "2026-09-18",
    vehicle: "Bicycle",
    vehicleNumber: "N/A",
    assignedParcels: 12,
    delivered: 98,
    earnings: 19400,
    status: "Active",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Mehedi Hasan",
    email: "mehedi@gmail.com",
    phone: "01933334444",
    address: "Agrabad, Chattogram",
    joined: "2026-09-22",
    vehicle: "Motorcycle",
    vehicleNumber: "CTG-METRO-HA-5678",
    assignedParcels: 0,
    delivered: 76,
    earnings: 15200,
    status: "Inactive",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Rafiul Islam",
    email: "rafiul@gmail.com",
    phone: "01644445555",
    address: "Dhanmondi, Dhaka",
    joined: "2026-10-01",
    vehicle: "Van",
    vehicleNumber: "DHA-METRO-TA-9012",
    assignedParcels: 24,
    delivered: 210,
    earnings: 42000,
    status: "Active",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Tanvir Ahmed",
    email: "tanvir@gmail.com",
    phone: "01555556666",
    address: "Sylhet Sadar, Sylhet",
    joined: "2026-10-05",
    vehicle: "Motorcycle",
    vehicleNumber: "SYL-METRO-HA-3456",
    assignedParcels: 0,
    delivered: 54,
    earnings: 10800,
    status: "Inactive",
    rating: 4.4,
  },
  {
    id: 6,
    name: "Hasan Mahmud",
    email: "hasan@gmail.com",
    phone: "01366667777",
    address: "Rajshahi Sadar, Rajshahi",
    joined: "2026-10-10",
    vehicle: "Bicycle",
    vehicleNumber: "N/A",
    assignedParcels: 9,
    delivered: 67,
    earnings: 13400,
    status: "Active",
    rating: 4.7,
  },
];

const statusStyle = (status) =>
  status === "Active"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-600";

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    api
      .get("/api/v1/users?role=agent&page_size=100")
      .then((res) => {
        const mapped = (res.data?.data || []).map((a) => ({
          id: a.id,
          name: a.full_name,
          email: a.email,
          phone: a.phone || "N/A",
          address: a.address || "N/A",
          joined: a.created_at ? new Date(a.created_at).toLocaleDateString() : "",
          vehicle: "Standard",
          vehicleNumber: "N/A",
          assignedParcels: 0,
          delivered: 0,
          earnings: 0,
          status: a.is_active ? "Active" : "Inactive",
          rating: 5.0,
        }));
        setAgents(mapped);
      })
      .catch(() => setAgents([]));
  }, []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [deleteAgent, setDeleteAgent] = useState(null);

  const stats = [
    {
      label: "Total Agents",
      value: agents.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Agents",
      value: agents.filter((agent) => agent.status === "Active").length,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Inactive Agents",
      value: agents.filter((agent) => agent.status === "Inactive").length,
      icon: UserX,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Deliveries",
      value: agents.reduce((total, agent) => total + agent.delivered, 0),
      icon: Package,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const filteredAgents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.phone.includes(query);

      const matchesStatus =
        statusFilter === "All" || agent.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [agents, search, statusFilter]);

  const toggleStatus = (id) => {
    const agent = agents.find((item) => item.id === id);
    if (!agent) return;

    const newStatus = agent.status === "Active" ? "Inactive" : "Active";

    setAgents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    toast.success(
      `${agent.name} is now ${newStatus.toLowerCase()}`
    );
  };

  const handleDelete = () => {
    if (!deleteAgent) return;

    setAgents((prev) =>
      prev.filter((agent) => agent.id !== deleteAgent.id)
    );

    if (selectedAgent?.id === deleteAgent.id) {
      setSelectedAgent(null);
    }

    toast.success("Delivery agent deleted successfully");
    setDeleteAgent(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-600">
              ADMINISTRATION / DELIVERY TEAM
            </p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Delivery Agent Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your delivery team and monitor agent performance.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
            <Bike size={19} className="text-emerald-600" />
            Agent Directory
          </div>
        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold text-slate-900">
                      {stat.value.toLocaleString()}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                All Delivery Agents
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View agent profiles, delivery activity and account status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search agent..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
                />
              </div>

              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-9 text-sm outline-none focus:border-emerald-500 sm:w-40"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>


          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Agent</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Deliveries</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {agent.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Agent ID: #{String(agent.id).padStart(4, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">{agent.email}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {agent.phone}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {agent.vehicle}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {agent.vehicleNumber}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {agent.delivered}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {agent.assignedParcels} assigned
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">
                        ⭐ {agent.rating}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(
                          agent.status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {agent.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAgent(agent)}
                          title="View details"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => toggleStatus(agent.id)}
                          title={
                            agent.status === "Active"
                              ? "Make inactive"
                              : "Make active"
                          }
                          className={`rounded-lg border p-2 transition ${
                            agent.status === "Active"
                              ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {agent.status === "Active" ? (
                            <Ban size={17} />
                          ) : (
                            <CircleCheck size={17} />
                          )}
                        </button>

                        <button
                          onClick={() => setDeleteAgent(agent)}
                          title="Delete agent"
                          className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredAgents.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No delivery agents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          <div className="space-y-3 p-4 md:hidden">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                      {agent.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-800">
                        {agent.name}
                      </h3>
                      <p className="truncate text-xs text-slate-500">
                        {agent.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                      agent.status
                    )}`}
                  >
                    {agent.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="mt-1 font-medium text-slate-700">
                      {agent.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Vehicle</p>
                    <p className="mt-1 font-medium text-slate-700">
                      {agent.vehicle}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Deliveries</p>
                    <p className="mt-1 font-medium text-slate-700">
                      {agent.delivered}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Rating</p>
                    <p className="mt-1 font-medium text-slate-700">
                      ⭐ {agent.rating}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    <Eye size={16} /> Details
                  </button>

                  <button
                    onClick={() => toggleStatus(agent.id)}
                    className="rounded-lg border border-amber-200 px-3 text-amber-600 hover:bg-amber-50"
                    title="Change status"
                  >
                    {agent.status === "Active" ? (
                      <Ban size={17} />
                    ) : (
                      <CircleCheck size={17} />
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteAgent(agent)}
                    className="rounded-lg border border-red-100 px-3 text-red-500 hover:bg-red-50"
                    title="Delete agent"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}

            {filteredAgents.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-500">
                No delivery agents found.
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredAgents.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {agents.length}
            </span>{" "}
            agents
          </div>
        </div>
      </div>


      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Agent Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Agent ID: #{String(selectedAgent.id).padStart(4, "0")}
                </p>
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
                  {selectedAgent.name.charAt(0)}
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900">
                  {selectedAgent.name}
                </h3>
                <span
                  className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                    selectedAgent.status
                  )}`}
                >
                  {selectedAgent.status}
                </span>
              </div>

              <div className="space-y-4">
                <AgentDetailRow
                  icon={<Mail size={17} />}
                  label="Email Address"
                  value={selectedAgent.email}
                />
                <AgentDetailRow
                  icon={<Phone size={17} />}
                  label="Phone Number"
                  value={selectedAgent.phone}
                />
                <AgentDetailRow
                  icon={<MapPin size={17} />}
                  label="Address"
                  value={selectedAgent.address}
                />
                <AgentDetailRow
                  icon={<CalendarDays size={17} />}
                  label="Joined Date"
                  value={selectedAgent.joined}
                />
                <AgentDetailRow
                  icon={<Bike size={17} />}
                  label="Vehicle"
                  value={`${selectedAgent.vehicle} (${selectedAgent.vehicleNumber})`}
                />
                <AgentDetailRow
                  icon={<Truck size={17} />}
                  label="Assigned Parcels"
                  value={selectedAgent.assignedParcels}
                />
                <AgentDetailRow
                  icon={<Package size={17} />}
                  label="Total Deliveries"
                  value={selectedAgent.delivered}
                />
                <AgentDetailRow
                  icon={<Wallet size={17} />}
                  label="Total Earnings"
                  value={`৳${selectedAgent.earnings.toLocaleString()}`}
                />
                <AgentDetailRow
                  icon={<ShieldCheck size={17} />}
                  label="Agent Rating"
                  value={`⭐ ${selectedAgent.rating}`}
                />
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}


      {deleteAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash2 size={25} />
            </div>

            <h2 className="mt-4 text-center text-xl font-bold text-slate-900">
              Delete Delivery Agent?
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteAgent.name}
              </span>
              ? This action cannot be undone in this demo.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteAgent(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AgentDetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="break-words text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  </div>
);

export default AdminAgents;