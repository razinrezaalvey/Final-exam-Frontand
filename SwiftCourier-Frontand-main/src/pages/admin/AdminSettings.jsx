import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  Truck,
  Save,
  Lock,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";
import { useAuth } from "../../context/AuthProvider";

const AdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pricing");
  const [loading, setLoading] = useState(false);

  // Pricing settings from backend
  const [pricing, setPricing] = useState({
    base_delivery_charge: "60",
    per_kg_charge: "30",
    cod_fee_percentage: "1.0",
  });

  // Profile
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  // Password
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsRes, userRes] = await Promise.allSettled([
        api.get("/api/v1/settings"),
        api.get("/api/v1/users/me"),
      ]);

      if (settingsRes.status === "fulfilled" && Array.isArray(settingsRes.value.data)) {
        const map = {};
        settingsRes.value.data.forEach((item) => {
          map[item.setting_key] = item.setting_value;
        });
        setPricing((prev) => ({ ...prev, ...map }));
      }

      if (userRes.status === "fulfilled") {
        setProfile({
          full_name: userRes.value.data.full_name || "",
          phone: userRes.value.data.phone || "",
          email: userRes.value.data.email || "",
        });
      }
    } catch {
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSavePricing = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await Promise.all([
        api.put("/api/v1/settings/base_delivery_charge", { value: String(pricing.base_delivery_charge) }),
        api.put("/api/v1/settings/per_kg_charge", { value: String(pricing.per_kg_charge) }),
        api.put("/api/v1/settings/cod_fee_percentage", { value: String(pricing.cod_fee_percentage) }),
      ]);
      toast.success("Delivery pricing rules updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to update pricing.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put("/api/v1/users/me", {
        full_name: profile.full_name,
        phone: profile.phone,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      await api.put("/api/v1/users/me/change-password", {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      toast.success("Password changed successfully!");
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-7">
        <div>
          <p className="text-sm font-semibold text-emerald-600">CONFIGURATION</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Admin Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure system-wide delivery pricing, admin credentials, and profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tabs */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("pricing")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "pricing"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Truck size={18} /> Pricing Rules
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "profile"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <User size={18} /> Admin Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "security"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Shield size={18} /> Security
            </button>
          </div>

          {/* Content Pane */}
          <div className="md:col-span-3">
            {activeTab === "pricing" && (
              <form onSubmit={handleSavePricing} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Configurable Parcel Pricing
                </h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                    Base Delivery Charge (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricing.base_delivery_charge}
                    onChange={(e) => setPricing({ ...pricing, base_delivery_charge: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">Starting cost applied to every booked shipment.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                    Additional Per-KG Charge (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricing.per_kg_charge}
                    onChange={(e) => setPricing({ ...pricing, per_kg_charge: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">Charged per extra kg above standard 1kg weight.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                    COD Fee Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricing.cod_fee_percentage}
                    onChange={(e) => setPricing({ ...pricing, cod_fee_percentage: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">Percentage charged on cash-on-delivery collections.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition"
                >
                  <Save size={18} /> Save Pricing Changes
                </button>
              </form>
            )}

            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Admin Personal Profile
                </h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Phone</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition"
                >
                  <Save size={18} /> Save Profile
                </button>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleChangePassword} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Security & Password
                </h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current_password}
                    onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirm_password}
                    onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-emerald-600 transition"
                >
                  <Lock size={18} /> Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
