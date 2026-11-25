import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/Api";
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
  MapPin,
  CalendarDays,
  ShieldCheck,
  Filter,
  MoreVertical,
  CircleCheck,
  Ban,
} from "lucide-react";
import toast from "react-hot-toast";

const initialUsers = [
  {
    id: 1,
    name: "Rahim Ahmed",
    email: "rahim@gmail.com",
    phone: "01712345678",
    address: "Dhanmondi, Dhaka",
    joined: "2026-10-12",
    totalParcels: 24,
    status: "Active",
    role: "Customer",
  },
  {
    id: 2,
    name: "Karim Hasan",
    email: "karim@gmail.com",
    phone: "01812345678",
    address: "Agrabad, Chattogram",
    joined: "2026-10-15",
    totalParcels: 18,
    status: "Active",
    role: "Customer",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    phone: "01912345678",
    address: "Uttara, Dhaka",
    joined: "2026-10-18",
    totalParcels: 12,
    status: "Blocked",
    role: "Customer",
  },
  {
    id: 4,
    name: "Sakib Hossain",
    email: "sakib@gmail.com",
    phone: "01612345678",
    address: "Sylhet Sadar, Sylhet",
    joined: "2026-10-20",
    totalParcels: 31,
    status: "Active",
    role: "Customer",
  },
  {
    id: 5,
    name: "Tania Akter",
    email: "tania@gmail.com",
    phone: "01512345678",
    address: "Mirpur, Dhaka",
    joined: "2026-10-22",
    totalParcels: 7,
    status: "Active",
    role: "Customer",
  },
  {
    id: 6,
    name: "Imran Khan",
    email: "imran@gmail.com",
    phone: "01312345678",
    address: "Rajshahi Sadar, Rajshahi",
    joined: "2026-10-25",
    totalParcels: 0,
    status: "Blocked",
    role: "Customer",
  },
  {
    id: 7,
    name: "Farzana Rahman",
    email: "farzana@gmail.com",
    phone: "01412345678",
    address: "Banani, Dhaka",
    joined: "2026-10-27",
    totalParcels: 15,
    status: "Active",
    role: "Customer",
  },
];

const statusStyle = (status) =>
  status === "Active"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-red-50 text-red-600";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/api/v1/users?page_size=100")
      .then((res) => {
        const mapped = (res.data?.data || []).map((u) => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          phone: u.phone || "N/A",
          address: u.address || "N/A",
          joined: u.created_at ? new Date(u.created_at).toLocaleDateString() : "",
          totalParcels: 0,
          status: u.is_active ? "Active" : "Blocked",
          role: (u.role || "customer").charAt(0).toUpperCase() + (u.role || "customer").slice(1),
        }));
        setUsers(mapped);
      })
      .catch(() => setUsers([]));
  }, []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const stats = [
    {
      label: "Total Customers",
      value: users.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Customers",
      value: users.filter((user) => user.status === "Active").length,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Blocked Customers",
      value: users.filter((user) => user.status === "Blocked").length,
      icon: UserX,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Total Parcels",
      value: users.reduce((total, user) => total + user.totalParcels, 0),
      icon: ShieldCheck,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const toggleStatus = (id) => {
    const user = users.find((item) => item.id === id);
    if (!user) return;

    const newStatus = user.status === "Active" ? "Blocked" : "Active";

    setUsers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    toast.success(
      `${user.name} ${newStatus === "Active" ? "unblocked" : "blocked"} successfully`
    );
  };

  const handleDelete = () => {
    if (!deleteUser) return;

    setUsers((prev) => prev.filter((user) => user.id !== deleteUser.id));
    toast.success("Customer deleted successfully");
    setDeleteUser(null);

    if (selectedUser?.id === deleteUser.id) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-600">
              ADMINISTRATION / CUSTOMERS
            </p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              User Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage customer accounts and monitor their activity.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
            <Users size={18} className="text-emerald-600" />
            Customer Directory
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
                All Customers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View and manage registered customer accounts.
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
                  placeholder="Search name, email, phone..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-72"
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
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>


          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold">Parcels</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            ID: #{String(user.id).padStart(4, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">{user.email}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {user.phone}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.joined}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                        {user.totalParcels}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(
                          user.status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          title="View details"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => toggleStatus(user.id)}
                          title={
                            user.status === "Active" ? "Block user" : "Unblock user"
                          }
                          className={`rounded-lg border p-2 transition ${
                            user.status === "Active"
                              ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {user.status === "Active" ? (
                            <Ban size={17} />
                          ) : (
                            <CircleCheck size={17} />
                          )}
                        </button>

                        <button
                          onClick={() => setDeleteUser(user)}
                          title="Delete user"
                          className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          <div className="space-y-3 p-4 md:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-800">
                        {user.name}
                      </h3>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="mt-1 font-medium text-slate-700">
                      {user.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Parcels</p>
                    <p className="mt-1 font-medium text-slate-700">
                      {user.totalParcels}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    <Eye size={16} /> Details
                  </button>

                  <button
                    onClick={() => toggleStatus(user.id)}
                    className="rounded-lg border border-amber-200 px-3 text-amber-600 hover:bg-amber-50"
                    title="Change status"
                  >
                    {user.status === "Active" ? (
                      <Ban size={17} />
                    ) : (
                      <CircleCheck size={17} />
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteUser(user)}
                    className="rounded-lg border border-red-100 px-3 text-red-500 hover:bg-red-50"
                    title="Delete customer"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-500">
                No customers found.
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredUsers.length}</span> of{" "}
            <span className="font-semibold text-slate-700">{users.length}</span> customers
          </div>
        </div>
      </div>


      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Customer Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Customer ID: #{String(selectedUser.id).padStart(4, "0")}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
                  {selectedUser.name.charAt(0)}
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900">
                  {selectedUser.name}
                </h3>
                <span
                  className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                    selectedUser.status
                  )}`}
                >
                  {selectedUser.status}
                </span>
              </div>

              <div className="space-y-4">
                <DetailRow
                  icon={<Mail size={17} />}
                  label="Email Address"
                  value={selectedUser.email}
                />
                <DetailRow
                  icon={<Phone size={17} />}
                  label="Phone Number"
                  value={selectedUser.phone}
                />
                <DetailRow
                  icon={<MapPin size={17} />}
                  label="Address"
                  value={selectedUser.address}
                />
                <DetailRow
                  icon={<CalendarDays size={17} />}
                  label="Joined Date"
                  value={selectedUser.joined}
                />
                <DetailRow
                  icon={<ShieldCheck size={17} />}
                  label="Total Parcels"
                  value={selectedUser.totalParcels}
                />
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}


      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash2 size={25} />
            </div>

            <h2 className="mt-4 text-center text-xl font-bold text-slate-900">
              Delete Customer?
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteUser.name}
              </span>
              ? This action cannot be undone in this demo.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteUser(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
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

export default AdminUsers;