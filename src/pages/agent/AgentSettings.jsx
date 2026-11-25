
import React, { useState } from "react";
import {
  Settings,
  LockKeyhole,
  Bell,
  Globe,
  Eye,
  EyeOff,
  Save,
  LogOut,
  ShieldCheck,
  Mail,
  MessageSquare,
  Package,
  Truck,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AgentSettings = () => {
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
    deliveryUpdates: true,
    newTasks: true,
    paymentAlerts: true,
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

  const handleNotification = (name) => {
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

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    console.log("Demo password change submitted");

    toast.success("Password validation successful!");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSavePreferences = () => {
    console.log("Demo notification settings:", notifications);
    console.log("Demo preferences:", preferences);

    toast.success("Settings saved successfully!");
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (confirmed) {
      toast.success("Demo logout successful!");
      navigate("/login");
    }
  };

  const Toggle = ({ label, description, checked, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
          <Icon size={19} />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            {label}
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${label}`}
        aria-pressed={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-7">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <Settings size={17} />
            AGENT PORTAL
          </div>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Account Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your security, notifications and preferences.
          </p>
        </div>

        {/* Security Banner */}
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-950 to-emerald-950 p-6 text-white sm:flex-row sm:items-center">
          <div className="rounded-2xl bg-emerald-500/20 p-4 text-emerald-300">
            <ShieldCheck size={30} />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Keep Your Account Secure
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Use a strong password and keep your account information up to date.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">

            {/* Change Password */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <LockKeyhole size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Change Password
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update your account password
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-600"
                >
                  <LockKeyhole size={17} />
                  Update Password
                </button>
              </form>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Bell size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Notification Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Choose which alerts you want to receive
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                <Toggle
                  label="Email Notifications"
                  description="Receive important updates through email"
                  icon={Mail}
                  checked={notifications.email}
                  onChange={() => handleNotification("email")}
                />

                <Toggle
                  label="SMS Notifications"
                  description="Get important alerts on your phone"
                  icon={MessageSquare}
                  checked={notifications.sms}
                  onChange={() => handleNotification("sms")}
                />

                <Toggle
                  label="Delivery Updates"
                  description="Receive updates about delivery progress"
                  icon={Package}
                  checked={notifications.deliveryUpdates}
                  onChange={() => handleNotification("deliveryUpdates")}
                />

                <Toggle
                  label="New Delivery Tasks"
                  description="Get notified when a new task is assigned"
                  icon={Truck}
                  checked={notifications.newTasks}
                  onChange={() => handleNotification("newTasks")}
                />

                <Toggle
                  label="Payment Alerts"
                  description="Receive payment and earnings notifications"
                  icon={Bell}
                  checked={notifications.paymentAlerts}
                  onChange={() => handleNotification("paymentAlerts")}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Preferences */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Globe size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Preferences
                  </h2>
                  <p className="text-xs text-slate-500">
                    Customize your experience
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Language
                  </label>

                  <select
                    name="language"
                    value={preferences.language}
                    onChange={handlePreferenceChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="English">English</option>
                    <option value="Bangla">Bangla</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Timezone
                  </label>

                  <select
                    name="timezone"
                    value={preferences.timezone}
                    onChange={handlePreferenceChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="Asia/Dhaka">
                      Bangladesh (GMT +6)
                    </option>
                    <option value="Asia/Kolkata">
                      India (GMT +5:30)
                    </option>
                    <option value="UTC">UTC (GMT +0)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
              >
                <Save size={17} />
                Save Settings
              </button>
            </div>

            {/* Account */}
            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-500">
                  <LogOut size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Account Actions
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage your session
                  </p>
                </div>
              </div>

              <p className="mb-5 text-sm leading-6 text-slate-500">
                Logout from your SwiftCourier agent account on this device.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>

            {/* Help Card */}
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <div className="mb-3 flex items-center gap-2 text-emerald-400">
                <ShieldCheck size={20} />
                <h3 className="font-bold">Need Help?</h3>
              </div>

              <p className="text-sm leading-6 text-slate-400">
                Contact the SwiftCourier support team if you need help with
                your account or delivery settings.
              </p>

              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="mt-4 text-sm font-bold text-emerald-400 hover:text-emerald-300"
              >
                Contact Support →
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Demo settings only — backend integration is not connected yet.
        </p>
      </div>
    </div>
  );
};

export default AgentSettings;
