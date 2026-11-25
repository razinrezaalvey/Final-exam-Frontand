
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    UserRound,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    ShieldCheck,
    Edit3,
    Save,
    X,
    Package,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthProvider";

const CustomerProfile = () => {
    const { user } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: "",
        city: "",
        postalCode: "",
        joinedDate: "",
    });

    const [formData, setFormData] = useState(profile);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setFormData(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Name is required");
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

        if (!formData.address.trim()) {
            toast.error("Address is required");
            return;
        }

        setProfile(formData);
        setIsEditing(false);

        toast.success("Profile updated successfully!");

        console.log("Updated Profile:", formData);
    };

    const profileFields = [
        {
            label: "Full Name",
            name: "name",
            icon: UserRound,
            type: "text",
            placeholder: "Enter your full name",
        },
        {
            label: "Email Address",
            name: "email",
            icon: Mail,
            type: "email",
            placeholder: "Enter your email",
        },
        {
            label: "Phone Number",
            name: "phone",
            icon: Phone,
            type: "tel",
            placeholder: "01XXXXXXXXX",
        },
        {
            label: "Address",
            name: "address",
            icon: MapPin,
            type: "text",
            placeholder: "Enter your address",
        },
        {
            label: "City",
            name: "city",
            icon: MapPin,
            type: "text",
            placeholder: "Enter your city",
        },
        {
            label: "Postal Code",
            name: "postalCode",
            icon: MapPin,
            type: "text",
            placeholder: "Enter postal code",
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

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-emerald-600 mb-2">
                                CUSTOMER ACCOUNT
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                                My Profile
                            </h1>

                            <p className="text-slate-500 mt-2">
                                Manage your personal information and account details.
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className="group relative inline-flex items-center justify-center gap-2.5
                                px-6 py-3 rounded-xl overflow-hidden
                                bg-gradient-to-r from-emerald-600 to-teal-500
                                text-white font-semibold text-sm
                                shadow-lg shadow-emerald-600/20
                                hover:shadow-xl hover:shadow-emerald-600/30
                                hover:-translate-y-1 active:translate-y-0
                                transition-all duration-300"
                            >
                                <Edit3
                                    size={18}
                                    className="transition-transform duration-300 group-hover:rotate-12"
                                />
                                <span>Edit Profile</span>
                                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Overview */}
                <div className="bg-slate-950 rounded-2xl p-6 md:p-8 text-white mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-emerald-600 flex items-center justify-center text-4xl font-bold">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="absolute -bottom-2 -right-2 bg-white text-emerald-600 p-2 rounded-xl shadow">
                                <UserRound size={17} />
                            </div>
                        </div>

                        <div className="text-center sm:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <h2 className="text-2xl font-bold">
                                    {profile.name}
                                </h2>

                                <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
                                    <ShieldCheck size={14} />
                                    Customer
                                </span>
                            </div>

                            <p className="text-slate-400 mt-2">
                                {profile.email}
                            </p>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-sm text-slate-400">
                                <span className="flex items-center gap-2">
                                    <Phone size={15} />
                                    {profile.phone}
                                </span>

                                <span className="flex items-center gap-2">
                                    <CalendarDays size={15} />
                                    Joined {profile.joinedDate}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Profile Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                        <div className="flex items-center justify-between mb-7">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Personal Information
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Your personal account details
                                </p>
                            </div>

                            <UserRound className="text-emerald-600" size={24} />
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {profileFields.map((field) => {
                                    const Icon = field.icon;

                                    return (
                                        <div
                                            key={field.name}
                                            className={field.name === "address" ? "sm:col-span-2" : ""}
                                        >
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                {field.label}
                                            </label>

                                            <div className="relative">
                                                <Icon
                                                    size={17}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                />

                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={isEditing ? formData[field.name] : profile[field.name]}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    placeholder={field.placeholder}
                                                    className={`input input-bordered w-full pl-10 rounded-xl ${isEditing
                                                        ? "bg-white focus:border-emerald-500"
                                                        : "bg-slate-50 text-slate-600"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {isEditing && (
                                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        className="group inline-flex items-center justify-center gap-2.5
                                            px-6 py-3 rounded-xl
                                            bg-slate-900 text-white
                                            font-semibold text-sm
                                            shadow-lg shadow-slate-900/20
                                            hover:bg-emerald-600 hover:shadow-emerald-600/25
                                            hover:-translate-y-1 active:translate-y-0
                                            transition-all duration-300"
                                    >
                                        <Save
                                            size={18}
                                            className="group-hover:scale-110 transition-transform duration-300"
                                        />
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex items-center justify-center gap-2
                                            px-6 py-3 rounded-xl
                                            bg-white border border-slate-200
                                            text-slate-600 font-semibold text-sm
                                            hover:bg-red-50 hover:text-red-600 hover:border-red-200
                                            transition-all duration-300"
                                    >
                                        <X size={18} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Account Sidebar */}
                    <div className="space-y-6">

                        {/* Account Status */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-5">
                                Account Overview
                            </h3>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-3 bg-emerald-50 rounded-xl">
                                    <CheckCircle2 className="text-emerald-600" size={22} />
                                </div>

                                <div>
                                    <p className="font-semibold text-slate-800">
                                        Active Account
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Demo account status
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="text-slate-500">Account Type</span>
                                    <span className="font-semibold text-slate-800">
                                        Customer
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Member Since</span>
                                    <span className="font-semibold text-slate-800">
                                        {profile.joinedDate}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-4">
                                Quick Links
                            </h3>

                            <div className="space-y-2">
                                <Link
                                    to="/customer/parcels"
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
                                >
                                    <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                        <Package size={18} className="text-emerald-600" />
                                        My Parcels
                                    </span>

                                    <ArrowLeft size={16} className="rotate-180 text-slate-400" />
                                </Link>

                                <Link
                                    to="/customer/book-parcel"
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
                                >
                                    <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                        <Package size={18} className="text-emerald-600" />
                                        Book New Parcel
                                    </span>

                                    <ArrowLeft size={16} className="rotate-180 text-slate-400" />
                                </Link>

                                <Link
                                    to="/contact"
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
                                >
                                    <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                        <Mail size={18} className="text-emerald-600" />
                                        Contact Support
                                    </span>

                                    <ArrowLeft size={16} className="rotate-180 text-slate-400" />
                                </Link>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-emerald-600 rounded-2xl p-6 text-white">
                            <ShieldCheck size={30} className="mb-4" />

                            <h3 className="font-bold text-lg">
                                Account Security
                            </h3>

                            <p className="text-sm text-emerald-50 mt-2">
                                Keep your contact information updated to receive important parcel notifications.
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-8">
                    Demo profile — changes are stored in frontend state only and will reset on page reload.
                </p>
            </div>
        </div>
    );
};

export default CustomerProfile;
