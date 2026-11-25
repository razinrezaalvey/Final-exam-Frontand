
import React, { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Bike,
  IdCard,
  CalendarDays,
  Edit3,
  Save,
  X,
  ShieldCheck,
  Package,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthProvider";

// Input Component - Outside AgentProfile
const InputField = ({
  label,
  name,
  icon: Icon,
  type = "text",
  value,
  onChange,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    <div className="relative">
      {Icon && (
        <Icon
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      )}

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className={`w-full rounded-xl border border-slate-200 bg-white py-3 ${
          Icon ? "pl-10" : "px-4"
        } pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100`}
      />
    </div>
  </div>
);

// Information Component - Outside AgentProfile
const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
    <div className="rounded-lg bg-white p-2 text-emerald-600 shadow-sm">
      <Icon size={18} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

const AgentProfile = () => {
  const { user } = useAuthContext();

  const initialProfile = {
    name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    postalCode: "",
    agentId: `AGT-${user?.id || ""}`,
    vehicleType: "",
    vehicleNumber: "",
    joiningDate: "",
  };

  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Edit Profile
  const handleEdit = () => {
    setFormData({ ...profile });
    setIsEditing(true);
  };

  // Cancel Editing
  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  // Save Profile
  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      toast.error("Please enter a valid Bangladeshi phone number");
      return;
    }

    setProfile({ ...formData });
    setIsEditing(false);

    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              AGENT PORTAL
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your personal and delivery information.
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-600"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Profile Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white md:p-9">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white/10 bg-emerald-500 text-4xl font-bold shadow-xl">
              {profile.name.charAt(0).toUpperCase()}

              <span className="absolute -bottom-2 -right-2 rounded-full border-4 border-slate-900 bg-emerald-400 p-1.5">
                <ShieldCheck size={16} className="text-slate-950" />
              </span>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">
                  {profile.name}
                </h2>

                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Active Agent
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-400">
                {profile.email}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Agent ID: {profile.agentId}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Star size={18} fill="currentColor" />
                <span className="text-2xl font-bold">4.8</span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Agent Rating
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Personal Information */}
          <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <UserRound size={21} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="text-xs text-slate-500">
                  Your basic contact information
                </p>
              </div>
            </div>

            {isEditing ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  name="name"
                  icon={UserRound}
                  value={formData.name}
                  onChange={handleChange}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  icon={Mail}
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                />

                <InputField
                  label="City"
                  name="city"
                  icon={MapPin}
                  value={formData.city}
                  onChange={handleChange}
                />

                <InputField
                  label="Address"
                  name="address"
                  icon={MapPin}
                  value={formData.address}
                  onChange={handleChange}
                />

                <InputField
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={UserRound}
                  label="Full Name"
                  value={profile.name}
                />

                <InfoItem
                  icon={Mail}
                  label="Email Address"
                  value={profile.email}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone Number"
                  value={profile.phone}
                />

                <InfoItem
                  icon={MapPin}
                  label="City"
                  value={profile.city}
                />

                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={profile.address}
                />

                <InfoItem
                  icon={IdCard}
                  label="Postal Code"
                  value={profile.postalCode}
                />
              </div>
            )}
          </div>

          {/* Agent Information */}
          <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Bike size={21} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Agent Information
                </h3>

                <p className="text-xs text-slate-500">
                  Your delivery details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <InfoItem
                icon={IdCard}
                label="Agent ID"
                value={profile.agentId}
              />

              {isEditing ? (
                <>
                  <InputField
                    label="Vehicle Type"
                    name="vehicleType"
                    icon={Bike}
                    value={formData.vehicleType}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Vehicle Number"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <InfoItem
                    icon={Bike}
                    label="Vehicle Type"
                    value={profile.vehicleType}
                  />

                  <InfoItem
                    icon={IdCard}
                    label="Vehicle Number"
                    value={profile.vehicleNumber}
                  />
                </>
              )}

              <InfoItem
                icon={CalendarDays}
                label="Joining Date"
                value={profile.joiningDate}
              />
            </div>
          </div>
        </div>

        {/* Bottom Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Package size={23} />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                24 Deliveries
              </h3>

              <p className="text-xs text-slate-500">
                Demo completed delivery count
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                Agent Account
              </h3>

              <p className="text-xs text-slate-500">
                Demo account status
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Demo profile — changes are temporary and reset after refresh.
        </p>
      </div>
    </div>
  );
};

export default AgentProfile;
