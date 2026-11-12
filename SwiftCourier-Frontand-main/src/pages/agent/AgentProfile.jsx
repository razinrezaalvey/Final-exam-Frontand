import React, { useEffect, useState } from "react";
import { Mail, Save, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";
import AgentSidebar from "../../components/AgentSidebar";

const AgentProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_type: "motorcycle",
    vehicle_number: "",
    license_number: "",
    availability_status: "available",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, pRes] = await Promise.allSettled([
        api.get("/api/v1/users/me"),
        api.get("/api/v1/agents/me/profile"),
      ]);
      if (uRes.status === "fulfilled") {
        setUser(uRes.value.data);
      }
      if (pRes.status === "fulfilled") {
        const p = pRes.value.data;
        setProfile(p);
        setFormData({
          vehicle_type: p.vehicle_type || "motorcycle",
          vehicle_number: p.vehicle_number || "",
          license_number: p.license_number || "",
          availability_status: p.availability_status || "available",
        });
      }
    } catch {
      toast.error("Failed to load agent profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/api/v1/agents/me/profile", {
        vehicle_type: formData.vehicle_type,
        vehicle_number: formData.vehicle_number || null,
        license_number: formData.license_number || null,
        availability_status: formData.availability_status,
      });
      const updated = res.data;
      setProfile(updated);
      setFormData({
        vehicle_type: updated.vehicle_type || "motorcycle",
        vehicle_number: updated.vehicle_number || "",
        license_number: updated.license_number || "",
        availability_status: updated.availability_status || "available",
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error?.message ||
        "Failed to update profile.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to saved profile data
    if (profile) {
      setFormData({
        vehicle_type: profile.vehicle_type || "motorcycle",
        vehicle_number: profile.vehicle_number || "",
        license_number: profile.license_number || "",
        availability_status: profile.availability_status || "available",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AgentSidebar />

      <main className="lg:ml-64">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Agent Details
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            My Profile
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage your vehicle info, license, and availability status.
          </p>
        </div>

        <div className="p-6 max-w-2xl">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Agent Identity Card */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl shrink-0">
                    {user?.full_name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {user?.full_name || "Delivery Agent"}
                    </h2>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail size={13} />
                      {user?.email}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Delivery Agent
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle & Availability */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-800">
                    Vehicle & Availability
                  </h3>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                    >
                      <Edit2 size={14} /> Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      disabled={!isEditing}
                      value={formData.vehicle_type}
                      onChange={(e) => handleChange("vehicle_type", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                    >
                      <option value="motorcycle">Motorcycle</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="car">Car</option>
                      <option value="van">Delivery Van</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>

                  {/* Availability Status */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                      Availability Status
                    </label>
                    <select
                      disabled={!isEditing}
                      value={formData.availability_status}
                      onChange={(e) => handleChange("availability_status", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                    >
                      <option value="available">✅ Available (Accepting tasks)</option>
                      <option value="busy">🚴 Busy (On delivery)</option>
                      <option value="offline">⛔ Offline</option>
                    </select>
                  </div>
                </div>

                {/* Vehicle Registration Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.vehicle_number}
                    onChange={(e) => handleChange("vehicle_number", e.target.value)}
                    placeholder={isEditing ? "e.g. DHA-KA-1234" : "Not set"}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                  />
                </div>

                {/* Driving License Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.license_number}
                    onChange={(e) => handleChange("license_number", e.target.value)}
                    placeholder={isEditing ? "e.g. DL-123456" : "Not set"}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                  />
                </div>

                {/* Action Buttons — only show when editing */}
                {isEditing && (
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-60 transition"
                    >
                      {saving ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save size={15} /> Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                    >
                      <X size={15} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Stats Summary */}
              {profile && (
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-800 mb-4">
                    Delivery Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 p-4 text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {profile.total_deliveries ?? 0}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Total Deliveries
                      </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-700">
                        ৳{Number(profile.total_earnings ?? 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Total Earnings
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AgentProfile;
