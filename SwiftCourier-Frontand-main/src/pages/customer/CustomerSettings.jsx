import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Settings,
  LockKeyhole,
  Bell,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  MessageSquare,
  Package,
  Truck,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";
import { useAuth } from "../../context/AuthProvider";

const CustomerSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("customer_notifications");
      return saved ? JSON.parse(saved) : {
        email: true,
        sms: true,
        parcelUpdates: true,
        deliveryAlerts: true,
      };
    } catch {
      return {
        email: true,
        sms: true,
        parcelUpdates: true,
        deliveryAlerts: true,
      };
    }
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("customer_preferences");
      return saved ? JSON.parse(saved) : {
        language: "English",
        timeZone: "Asia/Dhaka (GMT+6)",
      };
    } catch {
      return {
        language: "English",
        timeZone: "Asia/Dhaka (GMT+6)",
      };
    }
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (name) => {
    setNotifications((prev) => {
      const updated = { ...prev, [name]: !prev[name] };
      localStorage.setItem("customer_notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("customer_preferences", JSON.stringify(updated));
      return updated;
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password.");
      return;
    }

    try {
      setLoadingPassword(true);
      await api.post("/api/v1/users/me/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.detail || "Failed to update password.";
      toast.error(msg);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem("customer_notifications", JSON.stringify(notifications));
    localStorage.setItem("customer_preferences", JSON.stringify(preferences));
    toast.success("Preferences saved successfully!");
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/login");
      toast.success("Logged out successfully.");
    }
  };

  const notificationItems = [
    {
      name: "email",
      title: "Email Notifications",
      description: "Receive shipment invoices and updates via email.",
      icon: Mail,
    },
    {
      name: "sms",
      title: "SMS Notifications",
      description: "Get text messages when parcel status changes.",
      icon: MessageSquare,
    },
    {
      name: "parcelUpdates",
      title: "Parcel Status Updates",
      description: "Push notifications on pickup, transit and arrival.",
      icon: Package,
    },
    {
      name: "deliveryAlerts",
      title: "Delivery Alerts",
      description: "Immediate alert when the courier is out for delivery.",
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-7">
        {/* Header */}
        <div>
          <Link
            to="/customer/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-3 transition"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
              <Settings size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Account Settings</h1>
              <p className="text-sm text-slate-500">Configure security credentials and platform preferences.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-7">
            {/* Password Change */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-800">
                  <LockKeyhole size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
                  <p className="text-sm text-slate-500">Keep your account secure with a strong password.</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm outline-none focus:border-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60 cursor-pointer"
                >
                  <LockKeyhole size={16} />
                  {loadingPassword ? "Updating Password..." : "Update Password"}
                </button>
              </form>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Bell size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
                  <p className="text-sm text-slate-500">Choose how you want to receive parcel updates.</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {notificationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 text-sm">{item.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        checked={notifications[item.name]}
                        onChange={() => handleNotificationChange(item.name)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Account Preferences */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Localization & Language</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Language</label>
                  <select
                    name="language"
                    value={preferences.language}
                    onChange={handlePreferenceChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    <option>English</option>
                    <option>Bengali (বাংলা)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Time Zone</label>
                  <select
                    name="timeZone"
                    value={preferences.timeZone}
                    onChange={handlePreferenceChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    <option>Asia/Dhaka (GMT+6)</option>
                    <option>UTC (GMT+0)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/customer/profile"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700"
                >
                  My Profile
                  <ArrowLeft size={16} className="rotate-180 text-slate-400" />
                </Link>
                <Link
                  to="/customer/parcels"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700"
                >
                  My Parcels
                  <ArrowLeft size={16} className="rotate-180 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Logout Card */}
            <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                  <LogOut size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Account Session</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">Sign out of your current device session.</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition cursor-pointer"
              >
                <LogOut size={16} /> Logout Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
