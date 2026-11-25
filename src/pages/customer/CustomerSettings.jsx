
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
  Bell,
  Mail,
  MessageSquare,
  Package,
  Truck,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  Save,
  Settings,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

const CustomerSettings = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    parcelUpdates: true,
    deliveryAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    language: "English",
    timezone: "Asia/Dhaka",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (name) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different");
      return;
    }

    console.log("Demo password change submitted");

    toast.success("Password form validated successfully!");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSavePreferences = () => {
    console.log("Notification Settings:", notifications);
    console.log("Account Preferences:", preferences);

    toast.success("Settings saved successfully!");
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmed) {
      // Frontend demo only.
      // Connect authentication logout when backend is ready.
      navigate("/login");
      toast.success("Demo logout successful");
    }
  };

  const notificationItems = [
    {
      name: "email",
      title: "Email Notifications",
      description: "Receive important updates through email.",
      icon: Mail,
    },
    {
      name: "sms",
      title: "SMS Notifications",
      description: "Get shipment updates through SMS.",
      icon: MessageSquare,
    },
    {
      name: "parcelUpdates",
      title: "Parcel Status Updates",
      description: "Get notified when your parcel status changes.",
      icon: Package,
    },
    {
      name: "deliveryAlerts",
      title: "Delivery Alerts",
      description: "Receive alerts when your parcel is out for delivery.",
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/customer/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-4"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Settings size={25} className="text-emerald-600" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Account Settings
              </h1>

              <p className="text-slate-500 mt-1">
                Manage your password, notifications and preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">

            {/* Change Password */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <LockKeyhole
                    size={22}
                    className="text-emerald-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Change Password
                  </h2>

                  <p className="text-sm text-slate-500">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-5">

                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Current Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="input input-bordered w-full rounded-xl pr-12"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="input input-bordered w-full rounded-xl"
                    />

                    <p className="text-xs text-slate-400 mt-2">
                      Minimum 8 characters.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm New Password
                    </label>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                        className="input input-bordered w-full rounded-xl pr-12"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm shadow-lg hover:bg-emerald-600 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <LockKeyhole size={17} />
                  Update Password
                </button>
              </form>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Bell size={22} className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Notification Preferences
                  </h2>

                  <p className="text-sm text-slate-500">
                    Choose how you want to receive updates.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {notificationItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-4 py-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <Icon
                            size={20}
                            className="text-slate-600"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        className="toggle toggle-success shrink-0"
                        checked={notifications[item.name]}
                        onChange={() =>
                          handleNotificationChange(item.name)
                        }
                        aria-label={item.title}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Account Preferences */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Settings size={22} className="text-amber-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Account Preferences
                  </h2>

                  <p className="text-sm text-slate-500">
                    Customize your account experience.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Language
                  </label>

                  <select
                    name="language"
                    value={preferences.language}
                    onChange={handlePreferenceChange}
                    className="select select-bordered w-full rounded-xl"
                  >
                    <option value="English">English</option>
                    <option value="Bangla">Bangla</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Timezone
                  </label>

                  <select
                    name="timezone"
                    value={preferences.timezone}
                    onChange={handlePreferenceChange}
                    className="select select-bordered w-full rounded-xl"
                  >
                    <option value="Asia/Dhaka">
                      Asia/Dhaka (GMT+6)
                    </option>
                    <option value="UTC">
                      UTC
                    </option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Save size={17} />
                Save Preferences
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Security Card */}
            <div className="bg-slate-950 rounded-2xl p-6 text-white">
              <ShieldCheck size={32} className="text-emerald-400 mb-4" />

              <h3 className="text-xl font-bold">
                Security & Privacy
              </h3>

              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Use a unique password and keep your account information updated.
              </p>

              <div className="flex items-center gap-2 text-emerald-400 text-sm mt-5">
                <CheckCircle2 size={17} />
                <span>Security settings available</span>
              </div>
            </div>

            {/* Account Links */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">
                Account Management
              </h3>

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

                <Link
                  to="/customer/dashboard"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700"
                >
                  Dashboard
                  <ArrowLeft size={16} className="rotate-180 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Logout */}
            <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-red-50 rounded-xl">
                  <LogOut size={21} className="text-red-600" />
                </div>

                <h3 className="font-bold text-slate-900">
                  Logout
                </h3>
              </div>

              <p className="text-sm text-slate-500 mb-5">
                Sign out of your current customer account.
              </p>

              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <LogOut size={17} />
                Logout Account
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Demo settings — password changes, notification preferences and account preferences are not connected to the backend yet.
        </p>
      </div>
    </div>
  );
};

export default CustomerSettings;
