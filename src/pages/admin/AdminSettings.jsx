
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthProvider";
import {
  User,
  Building2,
  Bell,
  Shield,
  Truck,
  Save,
  Edit,
  X,
  Lock,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// Input Component
const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}) => (
  <div className="w-full">
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
    />
  </div>
);

// Toggle Component
const Toggle = ({ checked, onChange, disabled = false }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition ${
      checked ? "bg-emerald-600" : "bg-slate-300"
    } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
  >
    <span
      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

// Action Buttons
const ActionButtons = ({ editing, onEdit, onSave, onCancel }) => (
  <div className="flex flex-wrap gap-3">
    {editing ? (
      <>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          <X size={17} />
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
        >
          <Save size={17} />
          Save Changes
        </button>
      </>
    ) : (
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
      >
        <Edit size={17} />
        Edit
      </button>
    )}
  </div>
);

// Section Header
const SectionHeader = ({
  title,
  description,
  editing,
  onEdit,
  onSave,
  onCancel,
  showEdit = true,
}) => (
  <div className="mb-7 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>

    {showEdit && (
      <ActionButtons
        editing={editing}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
      />
    )}
  </div>
);

// Notification Row
const NotificationRow = ({
  title,
  description,
  checked,
  onChange,
}) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-5 last:border-0">
    <div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>

    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [editing, setEditing] = useState({
    profile: false,
    company: false,
    security: false,
    delivery: false,
  });

  const { user } = useAuthContext();

  // Admin Profile
  const [profile, setProfile] = useState({
    name: user?.full_name || "Admin",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.full_name || "Admin",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Company Information
  const [company, setCompany] = useState({
    name: "SwiftCourier",
    email: "support@swiftcourier.com",
    phone: "09612345678",
    address: "Dhaka, Bangladesh",
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    newParcel: true,
    deliveryUpdate: true,
    newUser: false,
    payment: true,
    emailNotification: true,
    smsNotification: false,
  });

  // Security
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
  });

  // Delivery Settings
  const [delivery, setDelivery] = useState({
    insideDhaka: "60",
    outsideDhaka: "120",
    freeDelivery: "1000",
    deliveryTime: "2-3",
    codEnabled: true,
    expressEnabled: true,
  });

  const [originalData, setOriginalData] = useState({});

  const tabs = [
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "company", label: "Company Information", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "delivery", label: "Delivery Settings", icon: Truck },
  ];

  // Get section data
  const getData = (tab) => {
    if (tab === "profile") return profile;
    if (tab === "company") return company;
    if (tab === "security") return security;
    if (tab === "delivery") return delivery;
    return {};
  };

  // Update section data
  const setData = (tab, value) => {
    if (tab === "profile") setProfile(value);
    if (tab === "company") setCompany(value);
    if (tab === "security") setSecurity(value);
    if (tab === "delivery") setDelivery(value);
  };

  // Update field
  const updateField = (setter, field, value) => {
    setter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Edit
  const handleEdit = (tab) => {
    setOriginalData((prev) => ({
      ...prev,
      [tab]: { ...getData(tab) },
    }));

    setEditing((prev) => ({
      ...prev,
      [tab]: true,
    }));
  };

  // Cancel
  const handleCancel = (tab) => {
    if (originalData[tab]) {
      setData(tab, originalData[tab]);
    }

    setEditing((prev) => ({
      ...prev,
      [tab]: false,
    }));
  };

  // Save
  const handleSave = (tab) => {
    if (tab === "security") {
      if (security.newPassword || security.confirmPassword || security.currentPassword) {
        if (!security.currentPassword) {
          toast.error("Please enter your current password");
          return;
        }

        if (!security.newPassword || !security.confirmPassword) {
          toast.error("Please complete all password fields");
          return;
        }

        if (security.newPassword.length < 8) {
          toast.error("New password must be at least 8 characters");
          return;
        }

        if (security.newPassword !== security.confirmPassword) {
          toast.error("New passwords do not match");
          return;
        }
      }
    }

    setOriginalData((prev) => ({
      ...prev,
      [tab]: { ...getData(tab) },
    }));

    setEditing((prev) => ({
      ...prev,
      [tab]: false,
    }));

    toast.success("Changes saved successfully!");
  };

  const isEditing = editing[activeTab] || false;

  const headerProps = {
    editing: isEditing,
    onEdit: () => handleEdit(activeTab),
    onSave: () => handleSave(activeTab),
    onCancel: () => handleCancel(activeTab),
  };

  const updateNotification = (field, value) => {
    updateField(setNotifications, field, value);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <Shield size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Admin Settings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your account, company and platform settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">

          {/* Sidebar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm lg:col-span-3">
            <h3 className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Settings Menu
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition lg:w-full ${
                      activeTab === tab.id
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={19} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7 lg:col-span-9">

            {/* Admin Profile */}
            {activeTab === "profile" && (
              <div>
                <SectionHeader
                  title="Admin Profile"
                  description="Manage your personal account information"
                  {...headerProps}
                />

                <div className="mb-8 flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white">
                    {profile.name.charAt(0).toUpperCase() || "A"}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Administrator
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Full Name"
                    value={profile.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setProfile, "name", e.target.value)
                    }
                    placeholder="Enter your name"
                  />

                  <InputField
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setProfile, "email", e.target.value)
                    }
                    placeholder="Enter email"
                  />

                  <InputField
                    label="Phone Number"
                    value={profile.phone}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setProfile, "phone", e.target.value)
                    }
                    placeholder="Enter phone"
                  />

                  <InputField
                    label="Address"
                    value={profile.address}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setProfile, "address", e.target.value)
                    }
                    placeholder="Enter address"
                  />
                </div>
              </div>
            )}

            {/* Company Information */}
            {activeTab === "company" && (
              <div>
                <SectionHeader
                  title="Company Information"
                  description="Manage your courier company information"
                  {...headerProps}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Company Name"
                    value={company.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setCompany, "name", e.target.value)
                    }
                    placeholder="Company name"
                  />

                  <InputField
                    label="Support Email"
                    type="email"
                    value={company.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setCompany, "email", e.target.value)
                    }
                    placeholder="Support email"
                  />

                  <InputField
                    label="Company Phone"
                    value={company.phone}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setCompany, "phone", e.target.value)
                    }
                    placeholder="Company phone"
                  />

                  <InputField
                    label="Company Address"
                    value={company.address}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setCompany, "address", e.target.value)
                    }
                    placeholder="Company address"
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div>
                <SectionHeader
                  title="Notification Settings"
                  description="Choose which notifications you want to receive"
                  showEdit={false}
                />

                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Activity Notifications
                </h3>

                <NotificationRow
                  title="New Parcel Booking"
                  description="Get notified when a new parcel is booked"
                  checked={notifications.newParcel}
                  onChange={(value) => updateNotification("newParcel", value)}
                />

                <NotificationRow
                  title="Delivery Updates"
                  description="Receive updates about parcel deliveries"
                  checked={notifications.deliveryUpdate}
                  onChange={(value) =>
                    updateNotification("deliveryUpdate", value)
                  }
                />

                <NotificationRow
                  title="New User Registration"
                  description="Get notified when a new customer registers"
                  checked={notifications.newUser}
                  onChange={(value) => updateNotification("newUser", value)}
                />

                <NotificationRow
                  title="Payment Notifications"
                  description="Receive payment and COD updates"
                  checked={notifications.payment}
                  onChange={(value) => updateNotification("payment", value)}
                />

                <h3 className="mb-2 mt-7 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Notification Channels
                </h3>

                <NotificationRow
                  title="Email Notifications"
                  description="Receive notifications through email"
                  checked={notifications.emailNotification}
                  onChange={(value) =>
                    updateNotification("emailNotification", value)
                  }
                />

                <NotificationRow
                  title="SMS Notifications"
                  description="Receive notifications through SMS"
                  checked={notifications.smsNotification}
                  onChange={(value) =>
                    updateNotification("smsNotification", value)
                  }
                />
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div>
                <SectionHeader
                  title="Security Settings"
                  description="Manage your password and account security"
                  {...headerProps}
                />

                <div className="mb-7 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <Lock className="shrink-0 text-amber-600" size={21} />

                    <div>
                      <h3 className="font-semibold text-amber-900">
                        Keep your account secure
                      </h3>
                      <p className="mt-1 text-sm text-amber-800">
                        Use a strong password and enable additional security
                        options when available.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Current Password"
                    type="password"
                    value={security.currentPassword}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(
                        setSecurity,
                        "currentPassword",
                        e.target.value
                      )
                    }
                    placeholder="Enter current password"
                  />

                  <div />

                  <InputField
                    label="New Password"
                    type="password"
                    value={security.newPassword}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setSecurity, "newPassword", e.target.value)
                    }
                    placeholder="Enter new password"
                  />

                  <InputField
                    label="Confirm New Password"
                    type="password"
                    value={security.confirmPassword}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(
                        setSecurity,
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Two-Factor Authentication
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Enable an extra layer of account security
                    </p>
                  </div>

                  <Toggle
                    checked={security.twoFactor}
                    disabled={!isEditing}
                    onChange={(value) =>
                      updateField(setSecurity, "twoFactor", value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Delivery Settings */}
            {activeTab === "delivery" && (
              <div>
                <SectionHeader
                  title="Delivery Settings"
                  description="Configure delivery charges and service options"
                  {...headerProps}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Inside Dhaka Delivery Charge (৳)"
                    value={delivery.insideDhaka}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setDelivery, "insideDhaka", e.target.value)
                    }
                    placeholder="60"
                  />

                  <InputField
                    label="Outside Dhaka Delivery Charge (৳)"
                    value={delivery.outsideDhaka}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setDelivery, "outsideDhaka", e.target.value)
                    }
                    placeholder="120"
                  />

                  <InputField
                    label="Free Delivery Minimum Order (৳)"
                    value={delivery.freeDelivery}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setDelivery, "freeDelivery", e.target.value)
                    }
                    placeholder="1000"
                  />

                  <InputField
                    label="Estimated Delivery Time"
                    value={delivery.deliveryTime}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateField(setDelivery, "deliveryTime", e.target.value)
                    }
                    placeholder="2-3 days"
                  />
                </div>

                <div className="mt-8 space-y-5 rounded-xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Cash on Delivery (COD)
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Allow customers to pay on delivery
                      </p>
                    </div>

                    <Toggle
                      checked={delivery.codEnabled}
                      disabled={!isEditing}
                      onChange={(value) =>
                        updateField(setDelivery, "codEnabled", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Express Delivery
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Enable express delivery service
                      </p>
                    </div>

                    <Toggle
                      checked={delivery.expressEnabled}
                      disabled={!isEditing}
                      onChange={(value) =>
                        updateField(setDelivery, "expressEnabled", value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400">
              <CheckCircle size={15} />
              <span>Frontend demo settings</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
