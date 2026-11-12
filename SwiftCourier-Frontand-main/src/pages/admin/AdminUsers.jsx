import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  Filter,
  CircleCheck,
  Ban,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "agent",
    password: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/users?page_size=100");
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load users from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const updatedStatus = !user.is_active;
    try {
      await api.put(`/api/v1/users/${user.id}`, { is_active: updatedStatus });
      toast.success(`User ${updatedStatus ? "activated" : "deactivated"} successfully!`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to update user status.");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/users", newUserData);
      toast.success("User created successfully!");
      setShowAddModal(false);
      setNewUserData({ full_name: "", email: "", phone: "", role: "agent", password: "" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to create user.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q);

      const matchesRole =
        roleFilter === "All" || u.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const counts = {
    total: users.length,
    active: users.filter((u) => u.is_active).length,
    blocked: users.filter((u) => !u.is_active).length,
    customers: users.filter((u) => u.role === "customer").length,
    agents: users.filter((u) => u.role === "agent").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              USER DIRECTORY
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Manage Users
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View and control accounts registered in SwiftCourier.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 shadow-md shadow-emerald-100"
          >
            <UserPlus size={18} />
            Create Account
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Users</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">{counts.total}</h3>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-semibold uppercase">Customers</p>
            <h3 className="text-2xl font-black text-blue-600 mt-2">{counts.customers}</h3>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-semibold uppercase">Delivery Agents</p>
            <h3 className="text-2xl font-black text-purple-600 mt-2">{counts.agents}</h3>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-semibold uppercase">Active Accounts</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">{counts.active}</h3>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name, email, or phone..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {["All", "Customer", "Agent", "Admin"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  roleFilter === role
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-400">Loading user database...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Registered Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{user.full_name}</p>
                        <p className="text-xs text-slate-400">User ID #{user.id}</p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        <p className="font-medium text-slate-800">{user.email}</p>
                        <p className="text-xs text-slate-400">{user.phone || "No phone"}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            user.role === "admin"
                              ? "bg-red-50 text-red-700"
                              : user.role === "agent"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {user.is_active ? "Active" : "Deactivated"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                            title="View Info"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg text-xs font-bold ${
                              user.is_active
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                            title={user.is_active ? "Deactivate User" : "Activate User"}
                          >
                            {user.is_active ? <Ban size={15} /> : <CircleCheck size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400">
                        No users match the search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-slate-900">User Profile</h2>
              <button onClick={() => setSelectedUser(null)}><X size={18} /></button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Full Name</p>
                <p className="font-bold text-slate-800">{selectedUser.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="font-bold text-slate-800">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="font-bold text-slate-800">{selectedUser.phone || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Role</p>
                <p className="font-bold text-emerald-700 capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Verified</p>
                <p className="font-semibold text-slate-700">{selectedUser.is_verified ? "Yes" : "No"}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
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
              <h2 className="text-xl font-bold text-slate-900">Create New Account</h2>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserData.full_name}
                  onChange={(e) => setNewUserData({ ...newUserData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="agent">Delivery Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="Min 8 chars, 1 uppercase, 1 digit"
                  className="w-full mt-1 p-3 border rounded-xl text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm mt-4"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
