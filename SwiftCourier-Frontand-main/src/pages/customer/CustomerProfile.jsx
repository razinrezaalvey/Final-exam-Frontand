import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  CheckCircle2,
  CalendarDays,
  Lock,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/Api";
import { useAuth } from "../../context/AuthProvider";

const CustomerProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    email: "",
    role: "customer",
    is_active: true,
    is_verified: false,
    created_at: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/users/me");
      setProfile(res.data);
    } catch {
      toast.error("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.full_name.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);
      const res = await api.put("/api/v1/users/me", {
        full_name: profile.full_name.trim(),
        phone: profile.phone ? profile.phone.trim() : null,
      });

      setProfile(res.data);
      if (setUser) {
        setUser(res.data);
      }
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated successfully!");
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.detail || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
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

    try {
      setChangingPassword(true);
      await api.post("/api/v1/users/me/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.detail || "Failed to update password.";
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-7">
        {/* Header Navigation */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              to="/customer/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-2 transition"
            >
              <ArrowLeft size={16} /> Back to Customer Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900">Personal Profile</h1>
            <p className="text-sm text-slate-500">
              Manage your personal information, phone number, and security credentials.
            </p>
          </div>

          <button
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 self-start sm:self-auto"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          {/* User Badge Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-slate-100 pb-7">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-3xl font-black text-white shadow-lg shadow-emerald-600/20">
              {profile.full_name?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{profile.full_name || "User"}</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700 border border-emerald-200">
                  {profile.role}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-slate-500">
                <Mail size={15} className="text-slate-400" /> {profile.email}
              </p>
              {profile.created_at && (
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CalendarDays size={14} /> Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleProfileSubmit} className="mt-7 space-y-5">
            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address (Account ID)
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Primary account identifier cannot be changed directly for security reasons.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
            >
              <Save size={16} />
              {savingProfile ? "Saving Profile..." : "Save Profile Changes"}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Security & Password</h3>
              <p className="text-xs text-slate-500">Update your account login password anytime.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Re-type new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60 cursor-pointer"
            >
              <ShieldCheck size={16} />
              {changingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
